import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TokenTransfer } from '../types';
import { format } from 'date-fns';


interface TokenActivityChartProps {
    transfers: TokenTransfer[];
}

export const TokenActivityChart: React.FC<TokenActivityChartProps> = ({ transfers }) => {
    const data = useMemo(() => {
        const grouped = transfers.reduce((acc, curr) => {
            const date = format(new Date(Number(curr.timeStamp) * 1000), 'yyyy-MM-dd');
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(grouped)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-30); // Last 30 days of activity
    }, [transfers]);

    if (data.length === 0) {
        return (
            <div className="chart-empty-state">
                <p>No token activity data available for chart</p>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <h3>30-Day Token Activity</h3>
            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0052FF" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0052FF" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(str) => format(new Date(str), 'MMM dd')}
                            stroke="#52525b"
                            tick={{ fill: '#a1a1aa', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#52525b"
                            tick={{ fill: '#a1a1aa', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#18181b',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                            itemStyle={{ color: '#0052FF' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#0052FF"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorCount)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
