import { useState, useEffect } from "react";
import "./MainPage.css";
import Header from "./components/Header/Header";
import SearchSection from "./components/SearchSection/SearchSection";
import EquipmentSection from "./components/EquipmentSection/EquipmentSection";

export default function MainPage() {
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [allEquipment, setAllEquipment] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInputValue, setSearchInputValue] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/equipment-types/")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setAllEquipment(data);
        setFilteredEquipment(data);
        setEquipmentTypes(data.map(item => item.name));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching equipment data:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const handleSearch = (searchTerm) => {
    setSearchInputValue(searchTerm);
    const filtered = allEquipment.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEquipment(filtered);
  };

  return (
    <div className="main-page">
      <Header 
        onSearch={handleSearch} 
        searchValue={searchInputValue} 
        equipmentTypes={equipmentTypes}
      />
      {error && <div className="error-message">{error}</div>}
      {isLoading ? (
        <div></div>
      ) : (
        <>
          <SearchSection 
            onSearch={handleSearch} 
            searchValue={searchInputValue}
            equipmentTypes={equipmentTypes} 
          />
          <EquipmentSection equipment={filteredEquipment} />
        </>
      )}
    </div>
  );
}