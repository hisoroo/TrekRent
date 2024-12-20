/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { FaSave, FaTimesCircle } from 'react-icons/fa';
import Modal from '../../../../components/Modal/Modal';

export default function EditEquipmentTypeModal({ isOpen, onClose, onSubmit, equipmentType }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '', // zmiana z price_per_day na price
    description: '',
    image_path: ''
  });

  useEffect(() => {
    if (equipmentType) {
      setFormData({
        name: equipmentType.name,
        price: equipmentType.price, // zmiana z price_per_day na price
        description: equipmentType.description || '',
        image_path: equipmentType.image_path || ''
      });
    }
  }, [equipmentType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      price: Number(formData.price) // zmiana z price_per_day na price
    };
    onSubmit(formattedData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edytuj typ sprzętu">
      <form 
        onSubmit={handleSubmit} 
        className="equipment-types__modal-form"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div className="form-group" style={{ width: "80%" }}>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            placeholder="Nazwa"
          />
          <label>Nazwa</label>
        </div>

        <div className="form-group" style={{ width: "80%" }}>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
            min="0"
            step="1"
            placeholder="Cena za dzień"
          />
          <label>Cena za dzień</label>
        </div>

        <div className="form-group" style={{ width: "80%", display: "flex", justifyContent: "center" }}>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="4"
            placeholder="Opis"
            style={{
              minHeight: "120px",
              width: "95%",
              padding: "12px",
              borderRadius: "6px",
              resize: "none",
              fontSize: "16px",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div className="form-group" style={{ width: "80%" }}>
          <input
            type="text"
            value={formData.image_path}
            onChange={(e) => setFormData({...formData, image_path: e.target.value})}
            placeholder="Ścieżka do obrazu"
          />
          <label>Ścieżka do obrazu</label>
        </div>

        <div className="modal-buttons" style={{ width: "80%" }}>
          <button type="submit" className="save-button">
            <FaSave /> Zapisz
          </button>
          <button type="button" onClick={onClose} className="cancel-button">
            <FaTimesCircle /> Anuluj
          </button>
        </div>
      </form>
    </Modal>
  );
}
