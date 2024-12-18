import PropTypes from 'prop-types';

const AddressSection = ({ formData, handleChange, handlePostalCodeChange, isDisabled }) => {
  return (
    <div>
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
                disabled={isDisabled}
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
                disabled={isDisabled}
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
                disabled={isDisabled}
                pattern="[0-9A-Za-z]{1,5}"
              />
              <label>Nr mieszkania</label>
              <span className="validation-message-apartment">
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
                disabled={isDisabled}
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
                disabled={isDisabled}
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
              disabled={isDisabled}
              required
            />
            <label className="required-field">Państwo</label>
            <span className="validation-message">Wprowadź nazwę państwa</span>
          </div>
        </div>
      </div>
    </div>
  );
};

AddressSection.propTypes = {
  formData: PropTypes.shape({
    street: PropTypes.string.isRequired,
    houseNumber: PropTypes.string.isRequired,
    apartmentNumber: PropTypes.string.isRequired,
    postalCode: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handlePostalCodeChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool
};

export default AddressSection;
