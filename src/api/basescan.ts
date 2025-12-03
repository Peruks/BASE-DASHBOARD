import axios from 'axios';
import type { BaseScanResponse, Transaction, TokenTransfer } from '../types';

const BASE_URL = 'https://base.blockscout.com/api';

export const basescanApi = {
    async getBalance(address: string): Promise<string> {
        try {
            const response = await axios.get<BaseScanResponse<string>>(BASE_URL, {
                params: {
                    module: 'account',
                    action: 'balance',
                    address,
                },
            });

            if (response.data.status === '1') {
                return response.data.result;
            }
            return '0';
        } catch (error) {
            console.error('Error fetching balance:', error);
            throw error;
        }
    },

    async getTransactions(address: string): Promise<Transaction[]> {
        try {
            const response = await axios.get<BaseScanResponse<Transaction[]>>(BASE_URL, {
                params: {
                    module: 'account',
                    action: 'txlist',
                    address,
                    startblock: 0,
                    endblock: 99999999,
                    sort: 'desc',
                    page: 1,
                    offset: 1000, // Limit to 1000 for performance
                },
            });

            if (response.data.status === '1') {
                return response.data.result;
            }
            // Blockscout might return empty array or different message for no txs
            if (Array.isArray(response.data.result)) {
                return response.data.result;
            }
            return [];
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }
    },

    async getTokenTransfers(address: string): Promise<TokenTransfer[]> {
        try {
            const response = await axios.get<BaseScanResponse<TokenTransfer[]>>(BASE_URL, {
                params: {
                    module: 'account',
                    action: 'tokentx',
                    address,
                    startblock: 0,
                    endblock: 99999999,
                    sort: 'desc',
                    offset: 1000,
                },
            });

            if (response.data.status === '1') {
                return response.data.result;
            }
            if (Array.isArray(response.data.result)) {
                return response.data.result;
            }
            return [];
        } catch (error) {
            console.error('Error fetching token transfers:', error);
            throw error;
        }
    },
};
