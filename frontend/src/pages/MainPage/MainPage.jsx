import React, { useState } from "react";
import "./MainPage.css";
import Header from "./components/Header/Header";
import SearchSection from "./components/SearchSection/SearchSection";
import EquipmentSection from "./components/EquipmentSection/EquipmentSection";
import equipmentData from '../../utils/equipmentData.json';

export default function MainPage() {
  const [filteredEquipment, setFilteredEquipment] = useState(equipmentData);

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