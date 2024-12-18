/* eslint-disable react/prop-types */
import {useState, useEffect } from 'react';
import Modal from '../../../../components/Modal/Modal';

export default function EditEquipmentTypeModal({ isOpen, onClose, onSubmit, equipmentType }) {
  const [formData, setFormData] = useState({
    name: '',
    price_per_day: '',
    description: '',
    image_path: ''
  });

  useEffect(() => {
    if (equipmentType) {
      setFormData({
        name: equipmentType.name,
        price_per_day: equipmentType.price,
        description: equipmentType.description || '',
        image_path: equipmentType.image_path || ''
      });
    }
  }, [equipmentType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edytuj typ sprzętu">
      <form onSubmit={handleSubmit} className="equipment-types__modal-form">
        <div className="equipment-types__form-group">
          <label>Nazwa:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            className="equipment-types__input"
          />
        </div>

        <div className="equipment-types__form-group">
          <label>Cena za dzień:</label>
          <input
            type="number"
            value={formData.price_per_day}
            onChange={(e) => setFormData({...formData, price_per_day: e.target.value})}
            required
            min="0"
            step="0.01"
            className="equipment-types__input"
          />
        </div>

        <div className="equipment-types__form-group">
          <label>Opis:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="equipment-types__input"
          />
        </div>

        <div className="equipment-types__form-group">
          <label>Ścieżka obrazu:</label>
          <input
            type="text"
            value={formData.image_path}
            onChange={(e) => setFormData({...formData, image_path: e.target.value})}
            className="equipment-types__input"
          />
        </div>

        <div className="equipment-types__modal-actions">
          <button type="submit" className="equipment-types__submit-btn">Zapisz</button>
          <button type="button" onClick={onClose} className="equipment-types__cancel-btn">Anuluj</button>
        </div>
      </form>
    </Modal>
  );
}
