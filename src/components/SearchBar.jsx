import React, { useState } from "react";
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [Term, setTerm] = useState("");

  // Debounce function to delay search input handling
  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  // Handle input changes with debounced search
  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setTerm(searchTerm);
    debouncedSearch(searchTerm);
  };

  const debouncedSearch = debounce((searchTerm) => {
    onSearch(searchTerm);
  }, 300);

  const handleSearch = () => {
    onSearch(Term);
  };

  return (
    <div className="search-bar-container">
      <input
        className="search-input"
        type="text"
        value={Term}
        onChange={handleInputChange}
        placeholder="Search Pokemon"
      />
      {/* <button className="search-button" onClick={handleSearch}>
        Search
      </button> */}
    </div>
  );
};

export default SearchBar;
