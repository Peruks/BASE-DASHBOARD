import React from 'react';
import { Fuel, Clock, Calendar } from 'lucide-react';
import type { WalletStats } from '../utils/analytics';
import '../styles/GasAnalytics.css';

interface GasAnalyticsProps {
    stats: WalletStats['gasStats'];
}

export const GasAnalytics: React.FC<GasAnalyticsProps> = ({ stats }) => {
    const formatHour = (hour: number) => {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h = hour % 12 || 12;
        return `${h} ${ampm}`;
    };

    return (
        <div className="gas-analytics-container">
            <div className="gas-card">
                <div className="gas-icon-wrapper">
                    <Fuel size={24} className="gas-icon" />
                </div>
                <div className="gas-info">
                    <span className="gas-label">Total Gas Spent</span>
                    <span className="gas-value">{stats.totalGasEth.toFixed(4)} ETH</span>
                    <span className="gas-sub">Estimated Fees</span>
                </div>
            </div>

            <div className="gas-card">
                <div className="gas-icon-wrapper">
                    <Clock size={24} className="gas-icon" />
                </div>
                <div className="gas-info">
                    <span className="gas-label">Active Time (Local)</span>
                    <span className="gas-value">{formatHour(stats.mostActiveHour)}</span>
                    <span className="gas-sub">Peak Activity</span>
                </div>
            </div>

            <div className="gas-card">
                <div className="gas-icon-wrapper">
                    <Calendar size={24} className="gas-icon" />
                </div>
                <div className="gas-info">
                    <span className="gas-label">Active Day</span>
                    <span className="gas-value">{stats.mostActiveDay}</span>
                    <span className="gas-sub">Favorite Day</span>
                </div>
            </div>
        </div>
    );
};
