import React, { useMemo } from 'react';
import { ArrowDownLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import type { Transaction } from '../types';
import { formatAddress, formatDate } from '../utils';
import '../styles/TransactionsTable.css';

interface TransactionsTableProps {
    transactions: Transaction[];
    currentAddress: string;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions, currentAddress }) => {
    const recentTransactions = useMemo(() => {
        return transactions.slice(0, 10);
    }, [transactions]);

    return (
        <div className="transactions-container">
            <div className="table-header">
                <h3>Recent Transactions (Last 10)</h3>
            </div>

            <div className="table-wrapper">
                <table className="transactions-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Hash</th>
                            <th>Time</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Value (ETH)</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentTransactions.map((tx) => {
                            const isIncoming = tx.to.toLowerCase() === currentAddress.toLowerCase();
                            return (
                                <tr key={tx.hash}>
                                    <td>
                                        <span className={`tx-type ${isIncoming ? 'incoming' : 'outgoing'}`}>
                                            {isIncoming ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                            {isIncoming ? 'In' : 'Out'}
                                        </span>
                                    </td>
                                    <td>
                                        <a
                                            href={`https://basescan.org/tx/${tx.hash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hash-link"
                                        >
                                            {formatAddress(tx.hash)} <ExternalLink size={12} />
                                        </a>
                                    </td>
                                    <td>{formatDate(tx.timeStamp)}</td>
                                    <td>{formatAddress(tx.from)}</td>
                                    <td>{formatAddress(tx.to)}</td>
                                    <td>{(Number(tx.value) / 1e18).toFixed(4)}</td>
                                    <td>
                                        <span className={`status-badge ${tx.isError === '0' ? 'success' : 'failed'}`}>
                                            {tx.isError === '0' ? 'Success' : 'Failed'}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        {recentTransactions.length === 0 && (
                            <tr>
                                <td colSpan={7} className="empty-state">No transactions found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
