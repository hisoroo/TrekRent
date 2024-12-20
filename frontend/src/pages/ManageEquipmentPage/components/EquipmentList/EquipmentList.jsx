import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

export default function EquipmentList() {
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [changingStatus, setChangingStatus] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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

  const handleAvailabilityChange = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedItem) return;
    
    setUpdatingId(selectedItem.id);
    setChangingStatus(selectedItem.id);
    
    try {
      await handleToggleAvailability(selectedItem);
    } finally {
      setModalOpen(false);
      setSelectedItem(null);
      setTimeout(() => {
        setChangingStatus(null);
        setUpdatingId(null);
      }, 150);
    }
  };

  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div>Błąd: {error}</div>;

  return (
    <>
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
            {equipment
              .sort((a, b) => a.equipment_type_id - b.equipment_type_id)
              .map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{getTypeName(item.equipment_type_id)}</td>
                <td>
                  <span className={`status-badge 
                    ${item.is_available ? 'available' : 'unavailable'}
                    ${changingStatus === item.id ? 'changing' : ''}
                    ${updatingId === item.id ? 'changed' : ''}`}>
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
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={handleConfirm}
        message={`Czy na pewno chcesz ${selectedItem?.is_available ? 'wyłączyć' : 'włączyć'} dostępność tego sprzętu? Upewnij się, że nie zmieniasz dostępności sprzętu, który jest aktualnie wypożyczony.`}
      />
    </>
  );
}
