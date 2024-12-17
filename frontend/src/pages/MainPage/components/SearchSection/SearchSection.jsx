/* eslint-disable react/prop-types */
import { useState } from "react";
import "./SearchSection.css";
import { Autocomplete, TextField, Button, createFilterOptions } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const filterOptions = createFilterOptions({
  limit: 5,
});

export default function SearchSection({ onSearch, equipmentTypes }) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && inputValue) {
      onSearch(inputValue);
      setIsOpen(false);
    }
  };

  return (
    <section className="search-section">
      <div className="input-container">
        <Autocomplete
          inputValue={inputValue}
          onInputChange={(event, newValue) => {
            setInputValue(newValue);
            setIsOpen(newValue.length > 0);
            if (newValue === '') {
              onSearch('');
            }
          }}
          onChange={(event, newValue) => {
            if (newValue) {
              setInputValue(newValue);
              onSearch(newValue);
            }
          }}
          open={isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
          onKeyDown={handleKeyPress}
          options={equipmentTypes}
          filterOptions={filterOptions}
          selectOnFocus
          handleHomeEndKeys
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Wyszukaj sprzęt"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  height: '45px',
                  '& fieldset': {
                    borderColor: '#ccc',
                  },
                  '&:hover fieldset': {
                    borderColor: '#007bff',
                  },
                },
              }}
            />
          )}
          freeSolo
          fullWidth
          listbox={{
            style: { maxHeight: '200px' }
          }}
          sx={{
            '& .MuiAutocomplete-inputRoot': {
              '& .MuiAutocomplete-input': {
                padding: '4px 8px !important',
              },
            },
          }}
        />
      </div>
      <Button
        variant="contained"
        className="search-button"
        onClick={() => {
          onSearch(inputValue);
          setIsOpen(false);
        }}
        startIcon={<SearchIcon />}
        sx={{
          borderRadius: '12px',
          height: '45px',
        }}
      >
        Wyszukaj
      </Button>
    </section>
  );
}