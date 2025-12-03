import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Transaction, TokenTransfer } from '../types';
import { format } from 'date-fns';


interface VolumeChartProps {
    transactions: Transaction[];
    tokenTransfers: TokenTransfer[];
    currentAddress: string;
}

type AssetType = 'ETH' | 'USDC';

export const VolumeChart: React.FC<VolumeChartProps> = ({ transactions, tokenTransfers, currentAddress }) => {
    const [asset, setAsset] = useState<AssetType>('ETH');

    const data = useMemo(() => {
        const dailyVolume: Record<string, { date: string; incoming: number; outgoing: number }> = {};

        const processTx = (date: string, value: number, isIncoming: boolean) => {
            if (!dailyVolume[date]) {
                dailyVolume[date] = { date, incoming: 0, outgoing: 0 };
            }
            if (isIncoming) {
                dailyVolume[date].incoming += value;
            } else {
                dailyVolume[date].outgoing += value;
            }
        };

        if (asset === 'ETH') {
            transactions.forEach(tx => {
                const date = format(new Date(Number(tx.timeStamp) * 1000), 'yyyy-MM-dd');
                const value = Number(tx.value) / 1e18;
                const isIncoming = tx.to.toLowerCase() === currentAddress.toLowerCase();
                processTx(date, value, isIncoming);
            });
        } else {
            // USDC Logic
            tokenTransfers.forEach(tx => {
                if (tx.tokenSymbol === 'USDC') {
                    const date = format(new Date(Number(tx.timeStamp) * 1000), 'yyyy-MM-dd');
                    const decimals = Number(tx.tokenDecimal) || 6; // USDC usually 6
                    const value = Number(tx.value) / Math.pow(10, decimals);
                    const isIncoming = tx.to.toLowerCase() === currentAddress.toLowerCase();
                    processTx(date, value, isIncoming);
                }
            });
        }

        return Object.values(dailyVolume)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-14); // Last 14 days
    }, [transactions, tokenTransfers, currentAddress, asset]);

    return (
        <div className="volume-chart-container">
            <div className="chart-header">
                <h3>14-Day Volume</h3>
                <div className="asset-selector">
                    <button
                        className={`asset-btn ${asset === 'ETH' ? 'active' : ''}`}
                        onClick={() => setAsset('ETH')}
                    >
                        ETH
                    </button>
                    <button
                        className={`asset-btn ${asset === 'USDC' ? 'active' : ''}`}
                        onClick={() => setAsset('USDC')}
                    >
                        USDC
                    </button>
                </div>
            </div>

            {data.length === 0 ? (
                <div className="chart-empty-state">
                    <p>No {asset} transaction volume found in the last 14 days</p>
                </div>
            ) : (
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
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
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                formatter={(value: number) => [value.toLocaleString(undefined, { maximumFractionDigits: 2 }), asset]}
                            />
                            <Legend />
                            <Bar dataKey="incoming" name={`Incoming ${asset}`} fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="outgoing" name={`Outgoing ${asset}`} fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};
