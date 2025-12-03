import { format, formatDistanceToNow } from 'date-fns';

export const formatBalance = (wei: string): string => {
    if (!wei) return '0';
    const eth = Number(wei) / 1e18;
    return eth.toLocaleString('en-US', { maximumFractionDigits: 4 });
};

export const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatDate = (timestamp: string): string => {
    if (!timestamp) return '';
    const date = new Date(Number(timestamp) * 1000);
    return format(date, 'MMM dd, yyyy HH:mm');
};

export const formatRelativeTime = (timestamp: string): string => {
    if (!timestamp) return '';
    const date = new Date(Number(timestamp) * 1000);
    return formatDistanceToNow(date, { addSuffix: true });
};
