import { differenceInDays, format, eachDayOfInterval, subDays } from 'date-fns';
import type { Transaction } from '../types';

export interface DailyActivity {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4; // 0 = none, 4 = high
}

export interface GasStats {
    totalGasEth: number;
    mostActiveHour: number;
    mostActiveDay: string;
}

export interface InteractionStats {
    uniqueInteractions: number;
    successRate: number;
    topInteractions: { address: string; count: number }[];
    timeLabel: string;
}

export interface WalletStats {
    onchainScore: number;
    uniqueDaysActive: number;
    longestStreak: number;
    currentStreak: number;
    activityPeriodDays: number;
    heatmapData: DailyActivity[];
    gasStats: GasStats;
    interactionStats: InteractionStats;
}

export const calculateWalletStats = (transactions: Transaction[]): WalletStats => {
    if (transactions.length === 0) {
        return {
            onchainScore: 0,
            uniqueDaysActive: 0,
            longestStreak: 0,
            currentStreak: 0,
            activityPeriodDays: 0,
            heatmapData: [],
            gasStats: {
                totalGasEth: 0,
                mostActiveHour: 0,
                mostActiveDay: 'Sunday'
            },
            interactionStats: {
                uniqueInteractions: 0,
                successRate: 0,
                topInteractions: [],
                timeLabel: 'N/A'
            }
        };
    }

    // 1. Process Dates
    const sortedTxs = [...transactions].sort((a, b) => Number(a.timeStamp) - Number(b.timeStamp));
    const firstTxDate = new Date(Number(sortedTxs[0].timeStamp) * 1000);
    const today = new Date();

    // 2. Activity Map (Date -> Count)
    const activityMap = new Map<string, number>();
    sortedTxs.forEach(tx => {
        const dateStr = format(new Date(Number(tx.timeStamp) * 1000), 'yyyy-MM-dd');
        activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
    });

    const uniqueDaysActive = activityMap.size;
    const activityPeriodDays = differenceInDays(today, firstTxDate);

    // 3. Calculate Streaks
    let currentStreak = 0;
    let longestStreak = 0;

    // Robust Streak Calculation:
    // Iterate backwards from today for current streak
    let checkDate = today;
    while (activityMap.has(format(checkDate, 'yyyy-MM-dd'))) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
    }

    if (currentStreak === 0 && activityMap.has(format(subDays(today, 1), 'yyyy-MM-dd'))) {
        checkDate = subDays(today, 1);
        while (activityMap.has(format(checkDate, 'yyyy-MM-dd'))) {
            currentStreak++;
            checkDate = subDays(checkDate, 1);
        }
    }

    // Longest Streak
    let streak = 0;
    let prevDate: Date | null = null;

    const dayList = Array.from(activityMap.keys()).sort();
    dayList.forEach(dateStr => {
        const d = new Date(dateStr);
        if (prevDate && differenceInDays(d, prevDate) === 1) {
            streak++;
        } else {
            streak = 1;
        }
        if (streak > longestStreak) longestStreak = streak;
        prevDate = d;
    });

    // 4. Heatmap Data (Last 365 Days)
    const days = eachDayOfInterval({ start: subDays(today, 364), end: today });

    const heatmapData: DailyActivity[] = days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const count = activityMap.get(dateStr) || 0;
        let level: 0 | 1 | 2 | 3 | 4 = 0;
        if (count > 0) level = 1;
        if (count > 2) level = 2;
        if (count > 5) level = 3;
        if (count > 10) level = 4;

        return { date: dateStr, count, level };
    });

    // 5. Onchain Score Calculation (0-100)
    // Revised Weights to favor Activity & Consistency over Age:
    // - Activity (40 pts): 1000 txs = 40pts
    // - Diversity (25 pts): 100 unique days = 25pts
    // - Volume (20 pts): 20 ETH = 20pts
    // - Age (15 pts): 2 years (730 days) = 15pts

    const activityScore = Math.min(40, (transactions.length / 1000) * 40);

    const uniqueDaysCap = 100;
    const diversityScore = Math.min(25, (uniqueDaysActive / uniqueDaysCap) * 25);

    const totalVolume = transactions.reduce((acc, tx) => acc + Number(tx.value) / 1e18, 0);
    const volumeScore = Math.min(20, (totalVolume / 20) * 20);

    const ageCapDays = 730; // 2 years
    const ageScore = Math.min(15, (activityPeriodDays / ageCapDays) * 15);

    const onchainScore = Math.round(activityScore + diversityScore + volumeScore + ageScore);

    // 6. Gas & Pattern Analysis
    let totalGasUsedWei = BigInt(0);
    const hourCounts = new Array(24).fill(0);
    const dayCounts = new Array(7).fill(0); // 0=Sun, 6=Sat

    transactions.forEach(tx => {
        // Gas
        const gasUsed = BigInt(tx.gasUsed);
        const gasPrice = BigInt(tx.gasPrice);
        totalGasUsedWei += gasUsed * gasPrice;

        // Time Patterns
        const date = new Date(Number(tx.timeStamp) * 1000);
        hourCounts[date.getHours()]++;
        dayCounts[date.getDay()]++;
    });

    const totalGasEth = Number(totalGasUsedWei) / 1e18;

    // Find most active hour
    let maxHourCount = 0;
    let mostActiveHour = 0;
    hourCounts.forEach((count, hour) => {
        if (count > maxHourCount) {
            maxHourCount = count;
            mostActiveHour = hour;
        }
    });

    // Find most active day
    let maxDayCount = 0;
    let mostActiveDay = 0;
    dayCounts.forEach((count, day) => {
        if (count > maxDayCount) {
            maxDayCount = count;
            mostActiveDay = day;
        }
    });

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // 7. Behavioral Analytics
    const uniqueInteractions = new Set(transactions.map(tx => tx.to.toLowerCase())).size;

    const interactionMap = new Map<string, number>();
    let successfulTxs = 0;

    transactions.forEach(tx => {
        if (tx.isError === '0') successfulTxs++;

        const to = tx.to.toLowerCase();
        // Exclude self-transfers or empty to (contract creation)
        if (to && to !== '0x' && to !== '') {
            interactionMap.set(to, (interactionMap.get(to) || 0) + 1);
        }
    });

    const successRate = transactions.length > 0
        ? (successfulTxs / transactions.length) * 100
        : 0;

    const topInteractions = Array.from(interactionMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([address, count]) => ({ address, count }));

    // Time Label
    let timeLabel = 'Balanced Trader';
    if (mostActiveHour >= 0 && mostActiveHour < 6) timeLabel = 'Night Owl 🦉';
    else if (mostActiveHour >= 6 && mostActiveHour < 12) timeLabel = 'Early Bird 🌅';
    else if (mostActiveHour >= 12 && mostActiveHour < 18) timeLabel = 'Day Trader ☀️';
    else timeLabel = 'Evening Warrior 🌙';

    return {
        onchainScore,
        uniqueDaysActive,
        longestStreak,
        currentStreak,
        activityPeriodDays,
        heatmapData,
        gasStats: {
            totalGasEth,
            mostActiveHour,
            mostActiveDay: daysOfWeek[mostActiveDay]
        },
        interactionStats: {
            uniqueInteractions,
            successRate,
            topInteractions,
            timeLabel
        }
    };
};
