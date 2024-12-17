import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './PasswordChangeSection.css';

const PasswordChangeSection = ({ onSubmit, isDisabled }) => {
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

  const handleChange = (e) => {
    setPasswords(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Nowe hasła nie są identyczne');
      return;
    }
    if (passwords.newPassword.length < 8) {
      setError('Nowe hasło musi mieć co najmniej 8 znaków');
      return;
    }
    onSubmit(passwords.oldPassword, passwords.newPassword);
    setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="password-change-section">
      <h3>Zmiana hasła</h3>
      <form onSubmit={handleSubmit} className="password-form">
        <div className="form-group">
          <div className="password-input-wrapper">
            <input
              type={showPasswords.old ? "text" : "password"}
              name="oldPassword"
              placeholder="Stare hasło"
              value={passwords.oldPassword}
              onChange={handleChange}
              disabled={isDisabled}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => togglePasswordVisibility('old')}
              disabled={isDisabled}
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
              placeholder="Nowe hasło"
              value={passwords.newPassword}
              onChange={handleChange}
              disabled={isDisabled}
              required
              minLength="8"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => togglePasswordVisibility('new')}
              disabled={isDisabled}
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
              disabled={isDisabled}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => togglePasswordVisibility('confirm')}
              disabled={isDisabled}
            >
              {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        <button 
          type="submit" 
          className="change-password-button" 
          disabled={isDisabled || !passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword}
        >
          Zmień hasło
        </button>
      </form>
    </div>
  );
};

PasswordChangeSection.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool
};

export default PasswordChangeSection;
