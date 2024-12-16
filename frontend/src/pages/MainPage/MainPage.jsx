import { useState, useEffect } from "react";
import "./MainPage.css";
import Header from "./components/Header/Header";
import SearchSection from "./components/SearchSection/SearchSection";
import EquipmentSection from "./components/EquipmentSection/EquipmentSection";
import equipmentData from '../../utils/equipmentData.json';

export default function MainPage() {
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/equipment-types/")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setFilteredEquipment(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching equipment data:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = equipmentData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEquipment(filtered);
  };

  return (
    <div className="main-page">
      <Header />
      {error && <div className="error-message">{error}</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <SearchSection onSearch={handleSearch} />
          <EquipmentSection equipment={filteredEquipment} />
        </>
      )}
    </div>
  );
}