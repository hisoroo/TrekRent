import { useState, useEffect } from 'react';
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa'; // Dodaj import ikon
import AddEquipmentTypeModal from './AddEquipmentTypeModal';
import EditEquipmentTypeModal from './EditEquipmentTypeModal';
import './EquipmentTypes.css';

export default function EquipmentTypes() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/equipment-types/');
      const data = await response.json();
      setTypes(data);
      setLoading(false);
    } catch (error) {
      console.error('Błąd podczas pobierania typów:', error);
      setLoading(false);
    }
  };

  const handleAddType = async (typeData) => {
    try {
      console.log('Sending data:', typeData); // debugging
      const response = await fetch('http://localhost:8000/api/equipment-types/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: typeData.name,
          price: typeData.price_per_day,
          description: typeData.description || null,
          image_path: typeData.image_path || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.detail || 'Unknown error occurred');
      }

      setIsModalOpen(false);
      fetchTypes();
    } catch (error) {
      console.error('Błąd podczas dodawania typu:', error);
      alert(error.message);
    }
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setIsEditModalOpen(true);
    setActiveDropdown(null);
  };

  const handleEditSubmit = async (formData) => {
    try {
      console.log('Sending data:', formData); // debugging
      const response = await fetch(`http://localhost:8000/api/equipment-types/${editingType.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          price: formData.price,
          description: formData.description || null,
          image_path: formData.image_path || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.detail || 'Unknown error occurred');
      }

      setIsEditModalOpen(false);
      setEditingType(null);
      fetchTypes();
    } catch (error) {
      console.error('Błąd podczas edycji typu:', error);
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten typ sprzętu?')) {
      try {
        await fetch(`http://localhost:8000/api/equipment-types/${id}`, {
          method: 'DELETE',
        });
        fetchTypes();
      } catch (error) {
        console.error('Błąd podczas usuwania typu:', error);
      }
    }
    setActiveDropdown(null);
  };

  if (loading) return <div className="equipment-types__loading">Ładowanie...</div>;

  return (
    <>
      <button 
        className="equipment-types__add-button"
        onClick={() => setIsModalOpen(true)}
      >
        + Dodaj nowy typ sprzętu
      </button>

      <div className="equipment-types__table-container">
        <table className="equipment-types__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nazwa</th>
              <th>Cena za dzień</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {types.map((type) => (
              <tr key={type.id}>
                <td>{type.id}</td>
                <td>{type.name}</td>
                <td>{type.price} zł</td>
                <td className="equipment-types__actions">
                  <div className="equipment-types__dropdown">
                    <button 
                      className="equipment-types__dropdown-trigger"
                      onClick={() => setActiveDropdown(activeDropdown === type.id ? null : type.id)}
                    >
                      <FaEllipsisV />
                    </button>
                    {activeDropdown === type.id && (
                      <div className="equipment-types__dropdown-menu">
                        <button onClick={() => handleEdit(type)}>
                          <FaEdit />
                          Edytuj
                        </button>
                        <button onClick={() => handleDelete(type.id)} style={{ color: '#dc3545' }}>
                          <FaTrash />
                          Usuń
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddEquipmentTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddType} 
      />

      <EditEquipmentTypeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingType(null);
        }}
        onSubmit={handleEditSubmit}
        equipmentType={editingType} 
      />
    </>
  );
}
