export interface BaseScanResponse<T> {
    status: string;
    message: string;
    result: T;
}

export interface Transaction {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    transactionIndex: string;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasPrice: string;
    isError: string;
    txreceipt_status: string;
    input: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    gasUsed: string;
    confirmations: string;
    methodId?: string;
    functionName?: string;
}

export interface TokenTransfer {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    from: string;
    contractAddress: string;
    to: string;
    value: string;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: string;
    transactionIndex: string;
    gas: string;
    gasPrice: string;
    gasUsed: string;
    cumulativeGasUsed: string;
    input: string;
    confirmations: string;
}

export interface TokenHolding {
    symbol: string;
    name: string;
    balance: number;
    decimals: number;
    contractAddress: string;
}

export interface WalletData {
    address: string;
    balance: string; // in Wei
    transactions: Transaction[];
    tokenTransfers: TokenTransfer[];
    holdings: TokenHolding[];
    lastUpdated: number;
}
