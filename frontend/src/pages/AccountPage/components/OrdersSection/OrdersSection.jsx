import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaHistory, FaShoppingCart } from 'react-icons/fa';
import './OrdersSection.css';

const OrdersSection = ({ activeOrders, pastOrders }) => {
  const [equipmentNames, setEquipmentNames] = useState({});

  const fetchEquipmentTypeName = async (equipmentId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8000/api/equipment/${equipmentId}/type`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEquipmentNames(prev => ({
          ...prev,
          [equipmentId]: data.name
        }));
      }
    } catch (error) {
      console.error('Error fetching equipment type:', error);
    }
  };

  useEffect(() => {
    const allOrders = [...activeOrders, ...pastOrders];
    allOrders.forEach(order => {
      if (order.equipment_id && !equipmentNames[order.equipment_id]) {
        fetchEquipmentTypeName(order.equipment_id);
      }
    });
  }, [activeOrders, pastOrders]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pl-PL');
  };

  const renderOrder = (order, isActive) => (
    <div key={order.id} className={`order-item ${!isActive ? 'past' : ''}`}>
      <div className="order-header">
        <span className="order-name">
          {equipmentNames[order.equipment_id] || 'Ładowanie...'}
        </span>
        <span className="order-status">
          {isActive ? 'Aktywne' : 'Zakończone'}
        </span>
      </div>
      <div className="order-dates">
        <span>Od: {formatDate(order.start_date)}</span>
        <span>Do: {formatDate(order.end_date)}</span>
      </div>
      <div className="order-price">
        Całkowity koszt: {order.total_cost} zł
      </div>
    </div>
  );

  return (
    <div className="orders-section">
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '2rem',
        justifyContent: 'space-between',
        margin: '0 auto',
        maxWidth: '1200px'
      }}>
        <div className="orders-group active" style={{
          flex: 1,
          maxWidth: '550px'
        }}>
          <h2><FaShoppingCart /> Aktywne zamówienia</h2>
          <div className="orders-list">
            {activeOrders?.length > 0 ? (
              activeOrders.map(order => renderOrder(order, true))
            ) : (
              <p className="no-orders">Brak aktywnych zamówień</p>
            )}
          </div>
        </div>

        <div className="orders-group past" style={{
          flex: 1,
          maxWidth: '550px'
        }}>
          <h2><FaHistory /> Historia zamówień</h2>
          <div className="orders-list">
            {pastOrders?.length > 0 ? (
              pastOrders.map(order => renderOrder(order, false))
            ) : (
              <p className="no-orders">Brak historycznych zamówień</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

OrdersSection.propTypes = {
  activeOrders: PropTypes.array,
  pastOrders: PropTypes.array
};

export default OrdersSection;
