import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const urlEncodedData = new URLSearchParams();
      urlEncodedData.append('username', formData.email);
      urlEncodedData.append('password', formData.password);

      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedData,
      });

      // Najpierw próbujemy pobrać dane JSON
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // Jeśli mamy dane z błędu, używamy ich
        if (data && data.detail) {
          toast.error(data.detail);
        } else if (response.status === 401) {
          toast.error('Nieprawidłowy email lub hasło');
        } else {
          toast.error('Wystąpił błąd podczas logowania');
        }
        return;
      }
      
      if (!data || !data.access_token) {
        toast.error('Otrzymano nieprawidłowe dane z serwera');
        return;
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify({
        id: data.user_id,
        role: data.user_group
      }));
      
      // Emitujemy event o zalogowaniu
      window.dispatchEvent(new Event('userLoggedIn'));
      
      toast.success('Zalogowano pomyślnie!', {
        onClose: () => {
          navigate('/');
        },
        autoClose: 600
      });
      
    } catch (error) {
      console.error('Login error:', error);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        toast.error('Nie można połączyć się z serwerem. Sprawdź połączenie internetowe.');
      } else {
        toast.error('Wystąpił nieoczekiwany błąd podczas logowania');
      }
    }
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
      <ToastContainer 
        position="top-center" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default LoginPage;
