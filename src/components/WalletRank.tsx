import React, { useMemo } from 'react';
import { Trophy, TrendingUp, Award, Star } from 'lucide-react';
import type { WalletData } from '../types';
import '../styles/WalletRank.css';

interface WalletRankProps {
    data: WalletData;
}

export const WalletRank: React.FC<WalletRankProps> = ({ data }) => {
    const rankData = useMemo(() => {
        const txCount = data.transactions.length;
        // Calculate total volume in ETH
        const volume = data.transactions.reduce((acc, tx) => acc + Number(tx.value) / 1e18, 0);

        // Heuristic Thresholds for Base Chain
        // These are estimated percentiles based on typical chain activity
        if (txCount > 1000 || volume > 100) {
            return {
                tier: 'Whale',
                percentile: 'Top 1%',
                color: '#8b5cf6', // Violet
                icon: <Trophy size={24} />,
                description: 'Elite network participant with massive activity.',
                nextTier: null
            };
        }
        if (txCount > 500 || volume > 20) {
            return {
                tier: 'Shark',
                percentile: 'Top 5%',
                color: '#3b82f6', // Blue
                icon: <Award size={24} />,
                description: 'Highly active power user.',
                nextTier: '1000+ Tx or 100+ ETH Vol'
            };
        }
        if (txCount > 100 || volume > 5) {
            return {
                tier: 'Dolphin',
                percentile: 'Top 20%',
                color: '#06b6d4', // Cyan
                icon: <TrendingUp size={24} />,
                description: 'Regular active user.',
                nextTier: '500+ Tx or 20+ ETH Vol'
            };
        }
        if (txCount > 10) {
            return {
                tier: 'Fish',
                percentile: 'Top 50%',
                color: '#10b981', // Emerald
                icon: <Star size={24} />,
                description: 'Casual network participant.',
                nextTier: '100+ Tx or 5+ ETH Vol'
            };
        }
        return {
            tier: 'Plankton',
            percentile: 'Bottom 50%',
            color: '#71717a', // Zinc
            icon: <Star size={24} />,
            description: 'New or inactive wallet.',
            nextTier: '10+ Tx'
        };
    }, [data]);

    return (
        <div className="wallet-rank-card" style={{ borderColor: rankData.color }}>
            <div className="rank-header">
                <div className="rank-icon" style={{ backgroundColor: `${rankData.color}20`, color: rankData.color }}>
                    {rankData.icon}
                </div>
                <div className="rank-title">
                    <h3>{rankData.tier}</h3>
                    <span className="rank-percentile" style={{ color: rankData.color }}>{rankData.percentile}</span>
                </div>
            </div>

            <p className="rank-description">{rankData.description}</p>

            {rankData.nextTier && (
                <div className="rank-progress">
                    <span>Next Tier:</span>
                    <span className="next-goal">{rankData.nextTier}</span>
                </div>
            )}
        </div>
    );
};
