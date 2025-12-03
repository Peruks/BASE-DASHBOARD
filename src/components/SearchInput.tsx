import React, { useState } from 'react';
import { Search } from 'lucide-react';


interface SearchInputProps {
    onSearch: (address: string) => void;
    isLoading?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading }) => {
    const [value, setValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onSearch(value.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="search-container">
            <div className="search-wrapper">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Enter Base wallet address (0x...)"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={isLoading}
                />
                <button type="submit" className="search-button" disabled={isLoading || !value}>
                    {isLoading ? 'Loading...' : 'Track'}
                </button>
            </div>
        </form>
    );
};
