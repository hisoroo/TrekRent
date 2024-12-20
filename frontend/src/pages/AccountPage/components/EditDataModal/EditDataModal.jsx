import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaSave, FaTimesCircle } from 'react-icons/fa';
import AddressSection from '../../../RegisterPage/components/AddressSection/AddressSection';
import './EditDataModal.css';

const EditDataModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    phonenumber: '',
    street: '',
    houseNumber: '',
    apartmentNumber: '',
    postalCode: '',
    city: '',
    country: 'Polska'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email || '',
        firstname: initialData.firstname || '',
        lastname: initialData.lastname || '',
        phonenumber: initialData.phonenumber || '',
        street: initialData.street || '',
        houseNumber: initialData.house_number || '',
        apartmentNumber: initialData.apartment_number || '',
        postalCode: initialData.postal_code || '',
        city: initialData.city || '',
        country: 'Polska'
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePostalCodeChange = (e) => {
    let value = e.target.value.replace(/[^\d-]/g, '');
    if (value.length === 2 && !value.includes('-')) {
      value += '-';
    }
    setFormData(prev => ({
      ...prev,
      postalCode: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataForApi = {
      ...formData,
      house_number: formData.houseNumber,
      postal_code: formData.postalCode
    };
    onSubmit(dataForApi);
  };

  return (
    <div className="modal-overlay">
      <div className="edit-modal">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        <h2>Edycja danych</h2>
        <form onSubmit={handleSubmit}>
          <div className="personal-details-section">
            <h3>Dane osobowe</h3>
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
              />
              <label>Email</label>
            </div>
            <div className="name-group">
              <div className="form-group">
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  placeholder="Imię"
                />
                <label>Imię</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  placeholder="Nazwisko"
                />
                <label>Nazwisko</label>
              </div>
            </div>
            <div className="form-group">
              <input
                type="tel"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                required
                placeholder="Telefon"
              />
              <label>Telefon</label>
            </div>
          </div>

          <AddressSection 
            formData={formData}
            handleChange={handleChange}
            handlePostalCodeChange={handlePostalCodeChange}
            isDisabled={false}
          />

          <div className="modal-buttons">
            <button type="submit" className="save-button">
              <FaSave /> Zapisz zmiany
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              <FaTimesCircle /> Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditDataModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object
};

export default EditDataModal;
