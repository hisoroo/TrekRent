import { useState, useEffect } from "react";
import "./MainPage.css";
import Header from "./components/Header/Header";
import SearchSection from "./components/SearchSection/SearchSection";
import EquipmentSection from "./components/EquipmentSection/EquipmentSection";
import equipmentData from '../../utils/equipmentData.json';

export default function MainPage() {
  const [filteredEquipment, setFilteredEquipment] = useState(equipmentData);

  // wymagany backend
  useEffect(() => {
    fetch("http://localhost:8080/api/equipment/catalog")
      .then((response) => response.json())
      .then((data) => {
        setFilteredEquipment(data);
      })
      .catch((error) => console.error("Error fetching equipment data:", error));
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
      <SearchSection onSearch={handleSearch} />
      <EquipmentSection equipment={filteredEquipment} />
    </div>
  );
}