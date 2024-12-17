import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaExclamationTriangle, FaTrash, FaTimes as FaTimesCircle } from 'react-icons/fa';
import './DeleteAccountModal.css';

const DeleteAccountModal = ({ isOpen, onClose, onConfirm, userEmail }) => {
  const [confirmEmail, setConfirmEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (confirmEmail !== userEmail) {
      setError('Podany adres email nie jest zgodny z Twoim adresem email');
      return;
    }
    onConfirm();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="delete-account-modal">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        <div className="warning-icon">
          <FaExclamationTriangle />
        </div>
        <h2>Potwierdź usunięcie konta</h2>
        <p className="warning-text">
          Ta operacja jest nieodwracalna. Wszystkie Twoje dane zostaną trwale usunięte. Przemyśl swoją decyzję.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="password-input-wrapper">
              <input
                type="email"
                value={confirmEmail}
                onChange={(e) => {
                  setConfirmEmail(e.target.value);
                  setError('');
                }}
                placeholder={userEmail}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
          <div className="modal-buttons">
            <button 
              type="submit" 
              className="save-button"
              disabled={!confirmEmail || confirmEmail !== userEmail}
            >
              <FaTrash /> Usuń konto
            </button>
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
            >
              <FaTimesCircle /> Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

DeleteAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired
};

export default DeleteAccountModal;
