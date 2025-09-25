import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    // Return fallback instead of throwing error
    return {
      searchQuery: '',
      updateSearchQuery: () => {},
      clearSearch: () => {}
    };
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const updateSearchQuery = (query) => {
    setSearchQuery(query || '');
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <SearchContext.Provider value={{
      searchQuery,
      updateSearchQuery,
      clearSearch
    }}>
      {children}
    </SearchContext.Provider>
  );
};
