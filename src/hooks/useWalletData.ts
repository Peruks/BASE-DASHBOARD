import { useState, useCallback } from 'react';
import { basescanApi } from '../api/basescan';
import type { WalletData, TokenTransfer, TokenHolding } from '../types';

interface UseWalletDataReturn {
    data: WalletData | null;
    loading: boolean;
    error: string | null;
    fetchWalletData: (address: string) => Promise<void>;
}

const calculateHoldings = (transfers: TokenTransfer[], address: string): TokenHolding[] => {
    const holdingsMap = new Map<string, TokenHolding>();
    const normalizedAddress = address.toLowerCase();

    transfers.forEach((tx) => {
        const isIncoming = tx.to.toLowerCase() === normalizedAddress;
        const isOutgoing = tx.from.toLowerCase() === normalizedAddress;

        if (!isIncoming && !isOutgoing) return;

        const contractAddress = tx.contractAddress;
        const decimals = Number(tx.tokenDecimal) || 18;
        const value = Number(tx.value) / Math.pow(10, decimals);

        if (!holdingsMap.has(contractAddress)) {
            holdingsMap.set(contractAddress, {
                symbol: tx.tokenSymbol,
                name: tx.tokenName,
                balance: 0,
                decimals,
                contractAddress,
            });
        }

        const holding = holdingsMap.get(contractAddress)!;
        if (isIncoming) {
            holding.balance += value;
        } else {
            holding.balance -= value;
        }
    });

    return Array.from(holdingsMap.values())
        .filter(h => h.balance > 0.000001) // Filter out dust/zero balances
        .sort((a, b) => b.balance - a.balance); // Sort by balance desc (simplified)
};

export const useWalletData = (): UseWalletDataReturn => {
    const [data, setData] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWalletData = useCallback(async (address: string) => {
        if (!address) return;

        setLoading(true);
        setError(null);
        setData(null); // Clear previous data

        try {
            // Parallelize requests for better performance
            const [balance, transactions, tokenTransfers] = await Promise.all([
                basescanApi.getBalance(address),
                basescanApi.getTransactions(address),
                basescanApi.getTokenTransfers(address),
            ]);

            const holdings = calculateHoldings(tokenTransfers, address);

            setData({
                address,
                balance,
                transactions,
                tokenTransfers,
                holdings,
                lastUpdated: Date.now(),
            });
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch wallet data. Please check the address and try again.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, fetchWalletData };
};
