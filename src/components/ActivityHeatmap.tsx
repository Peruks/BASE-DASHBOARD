import React from 'react';
import type { DailyActivity } from '../utils/analytics';
import '../styles/ActivityHeatmap.css';

interface ActivityHeatmapProps {
    data: DailyActivity[];
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data }) => {
    // Group by weeks for the grid layout
    const weeks: DailyActivity[][] = [];
    let currentWeek: DailyActivity[] = [];

    data.forEach((day) => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });
    if (currentWeek.length > 0) weeks.push(currentWeek);

    return (
        <div className="heatmap-container">
            <div className="heatmap-grid">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="heatmap-week">
                        {week.map((day) => (
                            <div
                                key={day.date}
                                className={`heatmap-cell level-${day.level}`}
                                title={`${day.date}: ${day.count} transactions`}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="heatmap-legend">
                <span>Less</span>
                <div className="legend-cells">
                    <div className="heatmap-cell level-0" />
                    <div className="heatmap-cell level-1" />
                    <div className="heatmap-cell level-2" />
                    <div className="heatmap-cell level-3" />
                    <div className="heatmap-cell level-4" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
};
