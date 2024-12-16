import PropTypes from "prop-types";
import "./EquipmentSection.css";
import EquipmentCard from "../EquipmentCard/EquipmentCard";
import { useState, useEffect } from "react";

export default function EquipmentSection() {
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/equipment-types/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Raw received data:', data);
        
        if (!Array.isArray(data)) {
          console.error('Received data is not an array:', data);
          return;
        }

        setEquipment(data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      }
    };

    fetchEquipment();
  }, []);

  return (
    <section className="equipment-section">
      <div className="equipment-list">
        {Array.isArray(equipment) && equipment.length > 0 ? (
          equipment.map((item) => (
            <EquipmentCard
              key={item.id}
              id={item.id}
              image={item.image_path}
              name={item.name}
              price={`Cena: ${item.price} zł/dzień`}
            />
          ))
        ) : (
          <div>Ładowanie sprzętu...</div>
        )}
      </div>
    </section>
  );
}

// Poprawione PropTypes
EquipmentSection.propTypes = {
  equipment: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.number.isRequired,
      image_path: PropTypes.string,
      name: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      description: PropTypes.string
    })
  )
};
