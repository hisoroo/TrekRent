import { useState } from "react";
import "./RegisterPage.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    street: "",
    houseNumber: "",
    apartmentNumber: "",
    postalCode: "",
    city: "",
    password: "",
    confirmPassword: "",
    country: "Polska",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatPostalCode = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}`;
  };

  const handlePostalCodeChange = (e) => {
    const formattedValue = formatPostalCode(e.target.value);
    if (formattedValue.length <= 6) {
      setFormData({
        ...formData,
        postalCode: formattedValue
      });
    }
  };

  const validateConfirmPassword = (e) => {
    const confirmPassword = e.target.value;
    if (confirmPassword !== formData.password) {
      e.target.setCustomValidity('Hasła muszą być identyczne');
    } else {
      e.target.setCustomValidity('');
    }
    handleChange(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement registration logic
  };

  return (
    <div className="register-container">
      <div className="register-form-box">
        <h2>Zarejestruj się</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              placeholder="Wprowadź imię"
              value={formData.firstName}
              onChange={handleChange}
              required
              pattern="[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]+"
              title="Tylko litery"
            />
            <label className="required-field">Imię</label>
            <span className="validation-message">
              Imię może zawierać tylko litery
            </span>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="lastName"
              placeholder="Wprowadź nazwisko"
              value={formData.lastName}
              onChange={handleChange}
              required
              pattern="[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]+(-[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]+)?"
              title="Tylko litery (dopuszczalny myślnik dla nazwisk dwuczłonowych)"
            />
            <label className="required-field">Nazwisko</label>
            <span className="validation-message">
              Nazwisko może zawierać tylko litery i myślnik
            </span>
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Wprowadź email"
              value={formData.email}
              onChange={handleChange}
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Wprowadź poprawny adres email"
            />
            <label className="required-field">Email</label>
            <span className="validation-message">
              Wprowadź poprawny adres email
            </span>
          </div>
          <div className="form-group">
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Wprowadź numer telefonu"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              pattern="(?:\+48)?[0-9]{9}"
              title="9 cyfr, opcjonalnie poprzedzone +48"
            />
            <label className="required-field">Numer telefonu</label>
            <span className="validation-message">
              Wprowadź 9 cyfr, opcjonalnie poprzedzone +48
            </span>
          </div>

          <div className="address-section">
            <h3>Adres zamieszkania</h3>
            <div className="address-grid">
              <div className="address-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="street"
                    placeholder="Wprowadź ulicę"
                    value={formData.street}
                    onChange={handleChange}
                    required
                  />
                  <label className="required-field">Ulica</label>
                  <span className="validation-message">
                    Wprowadź poprawną nazwę ulicy
                  </span>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="houseNumber"
                    placeholder="Nr domu"
                    value={formData.houseNumber}
                    onChange={handleChange}
                    required
                    pattern="[0-9A-Za-z]{1,5}"
                  />
                  <label className="required-field">Nr domu</label>
                  <span className="validation-message">
                    Wprowadź poprawny numer domu
                  </span>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="apartmentNumber"
                    placeholder="Nr mieszkania"
                    value={formData.apartmentNumber}
                    onChange={handleChange}
                    pattern="[0-9A-Za-z]{1,5}"
                  />
                  <label>Nr mieszkania</label>
                  <span className="validation-message">
                    Wprowadź poprawny numer mieszkania
                  </span>
                </div>
              </div>

              <div className="location-group">
                <div className="form-group">
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="__-___"
                    value={formData.postalCode}
                    onChange={handlePostalCodeChange}
                    required
                    maxLength="6"
                    pattern="\d{2}-\d{3}"
                  />
                  <label className="required-field">Kod pocztowy</label>
                  <span className="validation-message">Format: XX-XXX</span>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="city"
                    placeholder="Miejscowość"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    pattern="[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]{2,}"
                  />
                  <label className="required-field">Miejscowość</label>
                  <span className="validation-message">
                    Wprowadź poprawną nazwę miejscowości
                  </span>
                </div>
              </div>

              <div className="form-group full-width">
                <input
                  type="text"
                  name="country"
                  placeholder="Państwo"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
                <label className="required-field">Państwo</label>
                <span className="validation-message">
                  Wprowadź nazwę państwa
                </span>
              </div>
            </div>
            <div className="address-separator"></div>
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
                pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
                title="Minimum 8 znaków, przynajmniej jedna litera, cyfra i znak specjalny"
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
                Hasło musi mieć minimum 8 znaków, zawierać literę, cyfrę i znak
                specjalny
              </span>
            </div>
          </div>
          <div className="form-group">
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Potwierdź hasło"
                value={formData.confirmPassword}
                onChange={validateConfirmPassword}
                required
                pattern={formData.password}
                title="Hasła muszą być identyczne"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <label className="required-field">Potwierdź hasło</label>
              <span className="validation-message">
                Hasła muszą być identyczne
              </span>
            </div>
          </div>
          <button type="submit" className="register-button">
            Zarejestruj się
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
