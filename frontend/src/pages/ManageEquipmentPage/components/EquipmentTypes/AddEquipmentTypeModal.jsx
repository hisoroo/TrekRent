/* eslint-disable react/prop-types */
import React from 'react';
import Modal from '../../../../components/Modal/Modal';

const AddEquipmentTypeModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    price_per_day: '',
    description: '',
    image_path: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ 
      name: '', 
      price_per_day: '', 
      description: '', 
      image_path: '' 
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dodaj nowy typ sprzętu">
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
            className="equipment-types__textarea"
            rows="4"
          />
        </div>

        <div className="equipment-types__form-group">
          <label>Ścieżka do obrazu:</label>
          <input
            type="text"
            value={formData.image_path}
            onChange={(e) => setFormData({...formData, image_path: e.target.value})}
            className="equipment-types__input"
            placeholder="np. /images/sprzet.jpg"
          />
        </div>

        <div className="equipment-types__modal-actions">
          <button type="submit" className="equipment-types__submit-btn">Dodaj</button>
          <button type="button" onClick={onClose} className="equipment-types__cancel-btn">Anuluj</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEquipmentTypeModal;
