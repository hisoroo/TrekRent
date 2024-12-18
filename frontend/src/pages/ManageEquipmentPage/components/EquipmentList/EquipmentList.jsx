import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function EquipmentList() {
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/api/equipment-types/').then(res => res.json()),
      fetch('http://localhost:8000/api/equipment/').then(res => res.json())
    ])
    .then(([typesData, equipmentData]) => {
      setEquipmentTypes(typesData);
      setEquipment(equipmentData);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  const getTypeName = (typeId) => {
    const type = equipmentTypes.find(t => t.id === typeId);
    return type ? type.name : 'Nieznany typ';
  };

  const handleToggleAvailability = async (item) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/equipment/${item.id}/availability?is_available=${!item.is_available}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')?.replace(/"/g, '')}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Błąd podczas aktualizacji statusu');
      }

      const updatedEquipment = await response.json();
      setEquipment(equipment.map(eq => 
        eq.id === item.id ? updatedEquipment : eq
      ));

      toast.success(`Status sprzętu został ${!item.is_available ? 'włączony' : 'wyłączony'}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Wystąpił błąd podczas aktualizacji statusu sprzętu');
    }
  };

  const handleAvailabilityChange = async (item) => {
    setUpdatingId(item.id);
    await handleToggleAvailability(item);
    setUpdatingId(null);
  };

  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div>Błąd: {error}</div>;

  return (
    <div className="equipment-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Typ Sprzętu</th>
            <th>Status</th>
            <th>Dostępność</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{getTypeName(item.equipment_type_id)}</td>
              <td>
                <span className={`status-badge ${item.is_available ? 'available' : 'unavailable'}`}>
                  {item.is_available ? 'Dostępny' : 'Niedostępny'}
                </span>
              </td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={item.is_available}
                    disabled={updatingId === item.id}
                    onChange={() => handleAvailabilityChange(item)}
                  />
                  <span className={`slider round ${updatingId === item.id ? 'updating' : ''}`}></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
