import React, { useState } from 'react';

const SearchBar: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSearch} className="flex items-center">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for topics..."
                className="border border-gray-300 rounded-lg p-2 flex-grow"
            />
            <button type="submit" className="ml-2 bg-blue-500 text-white rounded-lg px-4 py-2">
                Search
            </button>
        </form>
    );
};

export default SearchBar;