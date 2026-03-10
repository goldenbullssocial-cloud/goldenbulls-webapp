"use client";
import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [submittedSearchQuery, setSubmittedSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = () => {
        setSubmittedSearchQuery(searchQuery);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSubmittedSearchQuery('');
    };

    return (
        <SearchContext.Provider value={{ 
            searchQuery, 
            submittedSearchQuery, 
            handleSearchChange, 
            handleSearch, 
            setSearchQuery,
            setSubmittedSearchQuery,
            clearSearch
        }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
}
