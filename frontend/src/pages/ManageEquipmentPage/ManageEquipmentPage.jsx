import { useState } from 'react';
import Header from '../MainPage/components/Header/Header';
import EquipmentList from './components/EquipmentList/EquipmentList';
import EquipmentTypes from './components/EquipmentTypes/EquipmentTypes';
import StockLevels from './components/StockLevels/StockLevels';
import './ManageEquipmentPage.css';

export default function ManageEquipmentPage() {
  const [activeTab, setActiveTab] = useState('equipment');

  const renderContent = () => {
    switch (activeTab) {
      case 'equipment':
        return <EquipmentList />;
      case 'types':
        return <EquipmentTypes />;
      case 'stock':
        return <StockLevels />;
      default:
        return <EquipmentList />;
    }
  };

  return (
    <div className="manage-page">
      <Header />
      <div className="manage-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'equipment' ? 'active' : ''}`}
            onClick={() => setActiveTab('equipment')}
          >
            Lista Sprzętu
          </button>
          <button 
            className={`tab ${activeTab === 'types' ? 'active' : ''}`}
            onClick={() => setActiveTab('types')}
          >
            Typy Sprzętu
          </button>
          <button 
            className={`tab ${activeTab === 'stock' ? 'active' : ''}`}
            onClick={() => setActiveTab('stock')}
          >
            Stany Magazynowe
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
