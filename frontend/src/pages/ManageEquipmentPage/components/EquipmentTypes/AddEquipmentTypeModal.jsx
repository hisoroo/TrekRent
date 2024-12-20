/* eslint-disable react/prop-types */
import React from "react";
import { FaSave, FaTimesCircle } from "react-icons/fa";
import Modal from "../../../../components/Modal/Modal";

const AddEquipmentTypeModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = React.useState({
    name: "",
    price_per_day: "",
    description: "",
    image_path: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      price_per_day: Number(formData.price_per_day)
    };
    onSubmit(formattedData);
    setFormData({
      name: "",
      price_per_day: "",
      description: "",
      image_path: "",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dodaj nowy typ sprzętu">
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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Nazwa"
          />
          <label>Nazwa</label>
        </div>

        <div className="form-group" style={{ width: "80%" }}>
          <input
            type="number"
            value={formData.price_per_day}
            onChange={(e) =>
              setFormData({ ...formData, price_per_day: e.target.value })
            }
            required
            min="0"
            step="1"
            placeholder="Cena za dzień"
          />
          <label>Cena za dzień</label>
        </div>

        <div className="form-group" style={{ width: "80%", display: "flex" ,justifyContent: "center" }}>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
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

        <div className="form-group" style={{ width: "80%" }}  >
          <input
            type="text"
            value={formData.image_path}
            onChange={(e) =>
              setFormData({ ...formData, image_path: e.target.value })
            }
            placeholder="Ścieżka do obrazu"
          />
          <label>Ścieżka do obrazu</label>
        </div>

        <div className="modal-buttons" style={{ width: "80%" }}>
          <button type="submit" className="save-button">
            <FaSave /> Dodaj
          </button>
          <button type="button" onClick={onClose} className="cancel-button">
            <FaTimesCircle /> Anuluj
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEquipmentTypeModal;
