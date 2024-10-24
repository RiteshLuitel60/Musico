import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

// Searchbar component for handling search functionality
const Searchbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search/${searchTerm}`);
  };

  // Handle search icon click
  const handleIconClick = () => {
    inputRef.current.focus();
    handleSubmit({ preventDefault: () => {} });
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="p-1 text-gray-400 focus-within:text-gray-600">
      <label htmlFor="search-field" className="sr-only">
        Search all files
      </label>
      <div className="flex flex-row justify-start items-center outline-none shadow-lg rounded-2xl">
        <FiSearch aria-hidden="true" className="w-5 h-5 ml-4 cursor-pointer text-white" onClick={handleIconClick} />
        <input
          name="search-field"
          autoComplete="off"
          id="search-field"
          ref={inputRef}
          className="flex-1 bg-transparent border-none placeholder-gray-200 outline-none text-base text-white p-4 transition-all duration-300 ease-in-out focus:shadow-2xl focus:rounded-lg focus:p-6 focus:border-2 focus:border-gray-600"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </form>
  );
};

export default Searchbar;