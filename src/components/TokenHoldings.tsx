import React from 'react';
import type { TokenHolding } from '../types';


interface TokenHoldingsProps {
    holdings: TokenHolding[];
}

export const TokenHoldings: React.FC<TokenHoldingsProps> = ({ holdings }) => {
    return (
        <div className="holdings-container">
            <h3>Token Holdings (Estimated)</h3>
            <div className="holdings-list">
                {holdings.length === 0 ? (
                    <div className="empty-holdings">No tokens found</div>
                ) : (
                    holdings.map((token) => (
                        <div key={token.contractAddress} className="holding-item">
                            <div className="token-info">
                                <span className="token-symbol">{token.symbol}</span>
                                <span className="token-name">{token.name}</span>
                            </div>
                            <div className="token-balance">
                                {token.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
