import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Activity } from 'lucide-react';
import type { WalletData } from '../types';
import { formatBalance } from '../utils';
import { calculateWalletStats } from '../utils/analytics';
import { Card } from './Card';
import { TransactionsTable } from './TransactionsTable';
import { TokenActivityChart } from './TokenActivityChart';
import { TokenHoldings } from './TokenHoldings';
import { VolumeChart } from './VolumeChart';
import { WalletRank } from './WalletRank';
import { OnchainScore } from './OnchainScore';
import { BehavioralInsights } from './BehavioralInsights';
import { WelcomeHero } from './WelcomeHero';
import '../styles/Dashboard.css';

interface DashboardProps {
    data: WalletData;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    return (
        <motion.div
            className="dashboard-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <WelcomeHero />

            <motion.div className="overview-grid" variants={itemVariants}>
                <Card title="ETH Balance" className="balance-card">
                    <div className="card-content">
                        <Wallet className="card-icon" size={24} />
                        <div className="card-value">
                            {formatBalance(data.balance)} <span className="currency">ETH</span>
                        </div>
                        <div className="card-label">{data.address}</div>
                    </div>
                </Card>

                <Card title="Transactions">
                    <div className="card-content">
                        <Activity className="card-icon" size={24} />
                        <div className="card-value">
                            {data.transactions.length === 1000 ? '1000+' : data.transactions.length}
                        </div>
                        <div className="card-label">Lifetime Transactions</div>
                    </div>
                </Card>

                <WalletRank data={data} />
            </motion.div>

            <motion.div className="insights-section" variants={itemVariants}>
                <OnchainScore transactions={data.transactions} address={data.address} />
            </motion.div>

            <motion.div className="behavioral-section" style={{ marginBottom: '24px' }} variants={itemVariants}>
                <BehavioralInsights stats={calculateWalletStats(data.transactions).interactionStats} />
            </motion.div>

            <motion.div className="charts-grid" variants={itemVariants}>
                <div className="chart-col">
                    <VolumeChart
                        transactions={data.transactions}
                        tokenTransfers={data.tokenTransfers}
                        currentAddress={data.address}
                    />
                </div>
                <div className="chart-col">
                    <TokenActivityChart transfers={data.tokenTransfers} />
                </div>
            </motion.div>

            <motion.div className="content-grid" variants={itemVariants}>
                <div className="holdings-col">
                    <TokenHoldings holdings={data.holdings} />
                </div>
                <div className="transactions-col">
                    <TransactionsTable transactions={data.transactions} currentAddress={data.address} />
                </div>
            </motion.div>
        </motion.div>
    );
};
