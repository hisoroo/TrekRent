import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaEye, FaEyeSlash, FaTimes, FaSave, FaTimesCircle } from 'react-icons/fa';
import './PasswordModal.css';

const PasswordModal = ({ isOpen, onClose, onSubmit }) => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setPasswords(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Nowe hasła nie są identyczne');
      return;
    }
    if (passwords.newPassword.length < 8) {
      setError('Nowe hasło musi mieć co najmniej 8 znaków');
      return;
    }
    
    try {
      await onSubmit(passwords.oldPassword, passwords.newPassword);
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="password-modal">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        <h2>Zmiana hasła</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="password-input-wrapper">
              <input
                type={showPasswords.old ? "text" : "password"}
                name="oldPassword"
                placeholder="Wprowadź aktualne hasło"
                value={passwords.oldPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => togglePasswordVisibility('old')}
              >
                {showPasswords.old ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <div className="password-input-wrapper">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                placeholder="Wprowadź nowe hasło"
                value={passwords.newPassword}
                onChange={handleChange}
                required
                minLength="8"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <div className="password-input-wrapper">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Potwierdź nowe hasło"
                value={passwords.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-buttons">
            <button 
              type="submit" 
              className="save-button"
              disabled={!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword}
            >
              <FaSave /> Zmień hasło
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

PasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default PasswordModal;
