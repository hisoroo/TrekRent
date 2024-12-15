import { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="login-container">
      <Link to="/" className="browse-catalog-button">
        Przeglądaj katalog bez logowania
      </Link>
      <div className="login-box">
        <h2>Zaloguj się</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Wprowadź email"
              value={formData.email}
              onChange={handleChange}
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            />
            <label className="required-field">Email</label>
            <span className="validation-message">
              Wprowadź poprawny adres email
            </span>
          </div>
          <div className="form-group">
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Wprowadź hasło"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <label className="required-field">Hasło</label>
              <span className="validation-message">
                Hasło musi mieć minimum 8 znaków
              </span>
            </div>
          </div>
          <button type="submit" className="login-button">
            Zaloguj się
          </button>
        </form>
        <div className="register-option">
          <p>Nie masz jeszcze konta?</p>
          <Link to="/register" className="register-link">
            Załóż konto
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
