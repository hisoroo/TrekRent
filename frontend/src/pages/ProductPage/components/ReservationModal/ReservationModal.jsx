import React from 'react';
import './ReservationModal.css';

const ReservationModal = ({ 
  show, 
  onClose, 
  onGoToCart, 
  onContinueBrowsing, 
  productImage,
  productName,
  startDate,
  endDate,
  totalCost
}) => {
  if (!show) {
    return null;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pl-PL');
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>

        <p className="confirmation-text">
          Sprzęt został dodany do koszyka! 🥳
        </p>
        
        <div className="modal-product-info">
          <img src={productImage} alt={productName} className="modal-product-image" />
          <div className="modal-details">
            <h3>{productName}</h3>
            <p>Termin wypożyczenia:</p>
            <p className="date-range">
              {formatDate(startDate)} - {formatDate(endDate)}
            </p>
            <p className="total-cost">Całkowity koszt: {totalCost} zł</p>
          </div>
        </div>
        
        <div className="modal-buttons">
          <button onClick={onGoToCart}>Przejdź do koszyka</button>
          <button onClick={onContinueBrowsing}>Wróć do przeglądania katalogu</button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;