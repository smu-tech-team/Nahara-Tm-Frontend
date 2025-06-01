import React, { useState } from 'react';
import { Search, X, Mic } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchValue('');
    onSearch('');
  };

  return (
    <div className="flex justify-end items-center w-full px-4">
      <div className="relative flex items-center bg-gray-800 text-white rounded-full shadow-md p-2 max-w-lg">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search podcasts..."
          value={searchValue}
          onChange={handleSearchChange}
          className="flex-1 pl-10 pr-10 py-2 text-sm bg-transparent placeholder-gray-400 border-none focus:outline-none focus:ring-2 "
        />
        {searchValue && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-14 flex items-center text-gray-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          className="absolute inset-y-0 right-3 flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 transition shadow-md"
        >
          <Mic className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
