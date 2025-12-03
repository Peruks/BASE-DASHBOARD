import React from 'react';
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


interface DashboardProps {
    data: WalletData;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    return (
        <div className="dashboard-container">
            <WelcomeHero />

            <div className="overview-grid">
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
            </div>

            <div className="insights-section">
                <OnchainScore transactions={data.transactions} address={data.address} />
            </div>

            <div className="behavioral-section" style={{ marginBottom: '24px' }}>
                <BehavioralInsights stats={calculateWalletStats(data.transactions).interactionStats} />
            </div>

            <div className="charts-grid">
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
            </div>

            <div className="content-grid">
                <div className="holdings-col">
                    <TokenHoldings holdings={data.holdings} />
                </div>
                <div className="transactions-col">
                    <TransactionsTable transactions={data.transactions} currentAddress={data.address} />
                </div>
            </div>
        </div>
    );
};
