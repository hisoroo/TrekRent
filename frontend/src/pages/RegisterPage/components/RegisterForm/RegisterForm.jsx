import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddressSection from "../AddressSection/AddressSection";
import PasswordInput from "../PasswordInput/PasswordInput";
import PersonalInfoSection from "../PersonalInfoSection/PersonalInfoSection";

const RegisterForm = () => {
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatPostalCode = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}`;
  };

  const handlePostalCodeChange = (e) => {
    const formattedValue = formatPostalCode(e.target.value);
    if (formattedValue.length <= 6) {
      setFormData({
        ...formData,
        postalCode: formattedValue,
      });
    }
  };

  const validateConfirmPassword = (e) => {
    const confirmPassword = e.target.value;
    if (confirmPassword !== formData.password) {
      e.target.setCustomValidity("Hasła muszą być identyczne");
    } else {
      e.target.setCustomValidity("");
    }
    handleChange(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstname: formData.firstName,
          lastname: formData.lastName,
          phonenumber: formData.phoneNumber,
          street: formData.street,
          house_number: formData.houseNumber,
          apartment_number: formData.apartmentNumber,
          postal_code: formData.postalCode,
          city: formData.city,
          country: formData.country,
        }),
      });

      if (response.ok) {
        toast.success("Rejestracja zakończona sukcesem!");
        navigate("/login");
      } else {
        const error = await response.json();
        toast.error(error.detail || "Błąd rejestracji");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Błąd połączenia z serwerem");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PersonalInfoSection formData={formData} handleChange={handleChange} />
      <AddressSection 
        formData={formData} 
        handleChange={handleChange} 
        handlePostalCodeChange={handlePostalCodeChange} 
      />
      <PasswordInput
        password={formData.password}
        confirmPassword={formData.confirmPassword}
        handleChange={handleChange}
        validateConfirmPassword={validateConfirmPassword}
      />
      <button type="submit" className="register-button">
        Zarejestruj się
      </button>
    </form>
  );
};

export default RegisterForm;
