import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import RegisterForm from './components/RegisterForm/RegisterForm';
import "./RegisterPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="register-container">
      <button className="back-button" onClick={() => navigate('/')}>
        <FaArrowLeft />
        Powrót
      </button>
      <div className="register-form-box">
        <h2>Zarejestruj się</h2>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
