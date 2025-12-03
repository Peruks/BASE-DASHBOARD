import React from 'react';
import { calculateWalletStats } from '../utils/analytics';
import { ActivityHeatmap } from './ActivityHeatmap';
import { GasAnalytics } from './GasAnalytics';
import type { Transaction } from '../types';
import '../styles/OnchainScore.css';

interface OnchainScoreProps {
    transactions: Transaction[];
    address: string;
}

export const OnchainScore: React.FC<OnchainScoreProps> = ({ transactions, address }) => {
    const stats = calculateWalletStats(transactions);

    return (
        <div className="onchain-score-container">
            <div className="score-card-header">
                <div className="identity-badge">
                    <div className="base-logo">🔵</div>
                    <span className="address-label">{address.slice(0, 6)}...{address.slice(-4)}</span>
                </div>
            </div>

            <div className="score-main">
                <div className="score-value-section">
                    <h4 className="score-label">ONCHAIN SCORE</h4>
                    <div className="score-big">{stats.onchainScore}/100</div>
                    <div className="score-disclaimer">
                        *Based on last {transactions.length === 1000 ? '1000+' : transactions.length} transactions
                    </div>
                </div>

                <div className="heatmap-section">
                    <ActivityHeatmap data={stats.heatmapData} />
                </div>
            </div>

            <GasAnalytics stats={stats.gasStats} />

            <div className="stats-grid">
                <div className="stat-item">
                    <span className="stat-value">
                        {transactions.length === 1000 ? '1000+' : transactions.length}
                    </span>
                    <span className="stat-label">Total Transactions</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{stats.uniqueDaysActive}</span>
                    <span className="stat-label">Unique Days Active</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{stats.longestStreak}</span>
                    <span className="stat-label">Longest Streak</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{stats.currentStreak}</span>
                    <span className="stat-label">Current Streak</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{stats.activityPeriodDays}</span>
                    <span className="stat-label">Days Active Period</span>
                </div>
            </div>
        </div>
    );
};
