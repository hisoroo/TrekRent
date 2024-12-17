import PropTypes from 'prop-types';

const PersonalInfoSection = ({ formData, handleChange }) => {
  return (
    <>
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
        <span className="validation-message">Imię może zawierać tylko litery</span>
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
        <span className="validation-message">Wprowadź poprawny adres email</span>
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
    </>
  );
};

PersonalInfoSection.propTypes = {
  formData: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired
  }).isRequired,
  handleChange: PropTypes.func.isRequired
};

export default PersonalInfoSection;
