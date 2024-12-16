/* eslint-disable react/prop-types */
import { useState } from "react";
import { toast } from 'react-toastify';
import "./BillComponent.css";

const BillComponent = ({ startDate, endDate, productName, totalCost, equipmentId, timestamp, onReservationComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDate = (date) => {
    if (!date) return "Brak daty";

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        console.error("Nieprawidłowa data:", date);
        return "Nieprawidłowa data";
      }
      return dateObj.toLocaleDateString("pl-PL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      console.error("Błąd formatowania daty:", error);
      return "Błąd daty";
    }
  };

  const displayCost = (cost) => {
    if (cost === undefined || cost === null) return "0";
    return typeof cost === "number" ? cost.toFixed(2) : "0";
  };

  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const formatDateForAPI = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleReserve = async () => {
    setIsLoading(true);
    setError(null); // Reset błędu przed rozpoczęciem
    
    try {
      const userDataString = localStorage.getItem('user');
      const userData = JSON.parse(userDataString);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Nie jesteś zalogowany');
      }

      const requestData = {
        equipment_id: Number(equipmentId),
        user_id: Number(userData.id),
        start_date: formatDateForAPI(startDate),
        end_date: formatDateForAPI(endDate),
        total_cost: Number(totalCost)
      };

      const response = await fetch('http://localhost:8000/api/rentals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.replace(/"/g, '')}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Błąd podczas rezerwacji');
      }

      // Wyczyść konkretny przedmiot z koszyka używając timestamp
      const cart = JSON.parse(localStorage.getItem('cart'));
      if (cart && cart.items) {
        const updatedItems = cart.items.filter(item => item.timestamp !== timestamp);
        localStorage.setItem('cart', JSON.stringify({ items: updatedItems }));
      }
      
      window.dispatchEvent(new Event('cartUpdated'));

      toast.success('Rezerwacja została pomyślnie utworzona!', {
        onClose: () => {
          if (onReservationComplete) {
            onReservationComplete();
          }
        },
        autoClose: 600
      });
      
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const numberOfDays = calculateDays();
  const pricePerDay = totalCost / numberOfDays;

  return (
    <div className="bill-container">
      <h2>Podsumowanie zamówienia</h2>

      <div className="bill-details">
        <div className="bill-row">
          <span>Data rozpoczęcia:</span>
          <span>{formatDate(startDate)}</span>
        </div>

        <div className="bill-row">
          <span>Data zakończenia:</span>
          <span>{formatDate(endDate)}</span>
        </div>

        <div className="bill-row">
          <span>Przedmiot:</span>
          <span>{productName || "Brak nazwy"}</span>
        </div>

        <div className="bill-summary">
          <div className="bill-left">
            <span className="bill-label">Łączna cena:</span>
          </div>
          <div>
            <span className="bill-equation">
              {numberOfDays} dni x {displayCost(pricePerDay)} zł = 
            </span>
            <span className="bill-total">{displayCost(totalCost)} zł</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        <button 
          className="bill-button" 
          onClick={handleReserve}
          disabled={isLoading}
        >
          {"Zarezerwuj"}
        </button>
      </div>
    </div>
  );
};

export default BillComponent;
