import React, { useState, useRef } from "react";
import "./SearchSection.css";
import equipmentData from '../../../../utils/equipmentData.json';

export default function SearchSection({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      const filteredSuggestions = equipmentData.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setSuggestions([]);
    onSearch(suggestion.name);
  };

  const handleClearInput = () => {
    setSearchTerm("");
    setSuggestions([]);
    inputRef.current.focus();
    onSearch("");
  };

  return (
    <section className="search-section">
      <div className="input-container">
        <input
          type="text"
          placeholder="Wyszukaj sprzęt"
          className="search-input"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          ref={inputRef}
        />
        {searchTerm && (
          <button className="clear-button" onClick={handleClearInput}>
            &#x2716;
          </button>
        )}
      </div>
      <button className="search-button" onClick={handleSearch}>
        Wyszukaj
      </button>
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}