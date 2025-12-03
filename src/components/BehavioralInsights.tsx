import React from 'react';
import { Clock, Target, Users } from 'lucide-react';
import type { InteractionStats } from '../utils/analytics';


interface BehavioralInsightsProps {
    stats: InteractionStats;
}

export const BehavioralInsights: React.FC<BehavioralInsightsProps> = ({ stats }) => {
    return (
        <div className="behavioral-container">
            <h3 className="section-title">Behavioral Profile</h3>

            <div className="behavioral-grid">
                <div className="behavior-card">
                    <div className="behavior-icon-wrapper time-icon">
                        <Clock size={20} />
                    </div>
                    <div className="behavior-content">
                        <span className="behavior-label">Activity Style</span>
                        <span className="behavior-value">{stats.timeLabel}</span>
                    </div>
                </div>

                <div className="behavior-card">
                    <div className="behavior-icon-wrapper success-icon">
                        <Target size={20} />
                    </div>
                    <div className="behavior-content">
                        <span className="behavior-label">Success Rate</span>
                        <span className="behavior-value">{stats.successRate.toFixed(1)}%</span>
                    </div>
                </div>

                <div className="behavior-card">
                    <div className="behavior-icon-wrapper diversity-icon">
                        <Users size={20} />
                    </div>
                    <div className="behavior-content">
                        <span className="behavior-label">Interactions</span>
                        <span className="behavior-value">{stats.uniqueInteractions}</span>
                        <span className="behavior-sub">Unique Contracts</span>
                    </div>
                </div>
            </div>

            <div className="top-interactions">
                <h4 className="subsection-title">Top Interactions (Last 1000 Txs)</h4>
                <div className="interactions-list">
                    {stats.topInteractions.map((item, index) => (
                        <div key={item.address} className="interaction-row">
                            <div className="rank-circle">{index + 1}</div>
                            <div className="interaction-address">
                                {item.address.slice(0, 8)}...{item.address.slice(-6)}
                            </div>
                            <div className="interaction-count">
                                {item.count} <span className="tx-label">txs</span>
                            </div>
                        </div>
                    ))}
                    {stats.topInteractions.length === 0 && (
                        <div className="empty-interactions">No interactions found</div>
                    )}
                </div>
            </div>
        </div>
    );
};
