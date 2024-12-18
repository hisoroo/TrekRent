import { useState, useEffect } from 'react';
import { IoCaretUpSharp, IoCaretDownSharp } from 'react-icons/io5';

export default function StockLevels() {
  const [stockLevels, setStockLevels] = useState([]);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchStockLevels();
  }, []);

  const fetchStockLevels = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/stock-levels/');
      const data = await response.json();
      setStockLevels(data.sort((a, b) => a.equipment_type.id - b.equipment_type.id));
    } catch (error) {
      console.error('Błąd podczas pobierania stanów magazynowych:', error);
    }
  };

  const handleAddEquipment = async (equipmentTypeId) => {
    setUpdating(equipmentTypeId);
    try {
      const response = await fetch('http://localhost:8000/api/equipment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipment_type_id: equipmentTypeId,
          is_available: true
        }),
      });
      
      if (response.ok) {
        await fetchStockLevels();
      }
    } catch (error) {
      console.error('Błąd podczas dodawania sprzętu:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveEquipment = async (equipmentTypeId) => {
    setUpdating(equipmentTypeId);
    try {
      const response = await fetch(`http://localhost:8000/api/equipment/available/${equipmentTypeId}`);
      const equipment = await response.json();

      if (equipment && equipment.id) {
        const deleteResponse = await fetch(`http://localhost:8000/api/equipment/${equipment.id}`, {
          method: 'DELETE',
        });

        if (deleteResponse.ok) {
          await fetchStockLevels();
        }
      }
    } catch (error) {
      console.error('Błąd podczas usuwania sprzętu:', error);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="stock-levels-table">
      <table>
        <thead>
          <tr>
            <th>Typ sprzętu</th>
            <th>Dostępne sztuki</th>
          </tr>
        </thead>
        <tbody>
          {stockLevels.map((stock) => (
            <tr key={stock.id}>
              <td>{stock.equipment_type.name}</td>
              <td>
                <div className="stock-control">
                  <span className={updating === stock.equipment_type.id ? 'updating' : ''}>
                    {stock.available_count}
                  </span>
                  <div className="spinner-buttons">
                    <button
                      onClick={() => handleAddEquipment(stock.equipment_type.id)}
                      disabled={updating === stock.equipment_type.id}
                      className="up"
                    >
                      <IoCaretUpSharp />
                    </button>
                    <button
                      onClick={() => handleRemoveEquipment(stock.equipment_type.id)}
                      disabled={updating === stock.equipment_type.id || stock.available_count <= 0}
                      className="down"
                    >
                      <IoCaretDownSharp />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
