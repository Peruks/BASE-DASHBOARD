import React, { useMemo } from 'react';
import { Trophy, TrendingUp, Award, Star } from 'lucide-react';
import type { WalletData } from '../types';


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

        // LEVIATHAN: > 1000 Txs AND > 100 ETH Volume (True Whale)
        if (txCount >= 1000 && volume > 100) {
            return {
                tier: 'Leviathan',
                percentile: 'Top 0.1%',
                color: '#7c3aed', // Deep Violet
                icon: <Trophy size={24} />,
                description: 'Legendary status. A true market mover.',
                nextTier: null
            };
        }

        // WHALE: > 1000 Txs OR > 50 ETH Volume
        if (txCount >= 1000 || volume > 50) {
            return {
                tier: 'Whale',
                percentile: 'Top 1%',
                color: '#8b5cf6', // Violet
                icon: <Trophy size={24} />,
                description: 'Elite network participant with massive activity.',
                nextTier: '100+ ETH Vol for Leviathan'
            };
        }

        // SHARK: > 500 Txs OR > 20 ETH Volume
        if (txCount > 500 || volume > 20) {
            return {
                tier: 'Shark',
                percentile: 'Top 5%',
                color: '#3b82f6', // Blue
                icon: <Award size={24} />,
                description: 'Highly active power user.',
                nextTier: '1000+ Tx or 50+ ETH Vol'
            };
        }

        // ORCA: > 250 Txs OR > 10 ETH Volume
        if (txCount > 250 || volume > 10) {
            return {
                tier: 'Orca',
                percentile: 'Top 10%',
                color: '#0ea5e9', // Sky Blue
                icon: <Award size={24} />,
                description: 'Serious trader and active participant.',
                nextTier: '500+ Tx or 20+ ETH Vol'
            };
        }

        // DOLPHIN: > 100 Txs OR > 5 ETH Volume
        if (txCount > 100 || volume > 5) {
            return {
                tier: 'Dolphin',
                percentile: 'Top 20%',
                color: '#06b6d4', // Cyan
                icon: <TrendingUp size={24} />,
                description: 'Regular active user.',
                nextTier: '250+ Tx or 10+ ETH Vol'
            };
        }

        // CRAB: > 50 Txs
        if (txCount > 50) {
            return {
                tier: 'Crab',
                percentile: 'Top 35%',
                color: '#14b8a6', // Teal
                icon: <TrendingUp size={24} />,
                description: 'Growing portfolio and activity.',
                nextTier: '100+ Tx or 5+ ETH Vol'
            };
        }

        // FISH: > 10 Txs
        if (txCount > 10) {
            return {
                tier: 'Fish',
                percentile: 'Top 50%',
                color: '#10b981', // Emerald
                icon: <Star size={24} />,
                description: 'Casual network participant.',
                nextTier: '50+ Tx'
            };
        }

        // SHRIMP: > 1 Tx
        if (txCount > 1) {
            return {
                tier: 'Shrimp',
                percentile: 'Top 75%',
                color: '#84cc16', // Lime
                icon: <Star size={24} />,
                description: 'Just getting started.',
                nextTier: '10+ Tx'
            };
        }

        return {
            tier: 'Plankton',
            percentile: 'Bottom 25%',
            color: '#71717a', // Zinc
            icon: <Star size={24} />,
            description: 'New or inactive wallet.',
            nextTier: 'Make a transaction!'
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
