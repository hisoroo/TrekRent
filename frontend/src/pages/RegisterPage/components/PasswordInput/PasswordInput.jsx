import PropTypes from 'prop-types';
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({ password, confirmPassword, handleChange, validateConfirmPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <div className="form-group">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Wprowadź hasło"
          value={password}
          onChange={handleChange}
          required
          pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
          title="Minimum 8 znaków, jedna wielka litera, jedna mała litera, jedna cyfra i jeden znak specjalny"
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
          Hasło musi zawierać minimum 8 znaków, jedną wielką literę, jedną małą literę, jedną cyfrę i jeden znak specjalny
        </span>
      </div>

      <div className="form-group">
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Potwierdź hasło"
          value={confirmPassword}
          onChange={validateConfirmPassword}
          required
        />
        <button
          type="button"
          className="toggle-password"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
        <label className="required-field">Potwierdź hasło</label>
        <span className="validation-message">Hasła muszą być identyczne</span>
      </div>
    </>
  );
};

PasswordInput.propTypes = {
  password: PropTypes.string.isRequired,
  confirmPassword: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  validateConfirmPassword: PropTypes.func.isRequired
};

export default PasswordInput;
