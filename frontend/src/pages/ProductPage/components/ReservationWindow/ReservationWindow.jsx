/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ReservationWindow.css";
import { toast } from "react-toastify";

export default function ReservationWindow({ price, onReserve, equipmentId }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [error, setError] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [isCostUpdated, setIsCostUpdated] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [availableCount, setAvailableCount] = useState(0);

  useEffect(() => {
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 3);
    setEndDate(returnDate);
    calculateInitialCost(new Date(), returnDate);
  }, [price]);

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/stock-levels/available/${equipmentId}`);
        const data = await response.json();
        setAvailableCount(data.count);
        setIsAvailable(data.count > 0);
      } catch (error) {
        console.error('Error checking availability:', error);
        setIsAvailable(false);
      }
    };

    checkAvailability();
  }, [equipmentId]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date >= endDate) {
      const newEndDate = new Date(date);
      newEndDate.setDate(newEndDate.getDate() + 3);
      setEndDate(newEndDate);
    }
  };

  const handleEndDateChange = (date) => {
    if (date <= startDate) {
      setError("Data zwrotu musi być późniejsza niż data wypożyczenia.");
    } else {
      setError("");
      setEndDate(date);
      updateTotalCost(startDate, date);
    }
  };

  const calculateInitialCost = (start, end) => {
    if (price) { 
      const days = (end - start) / (1000 * 60 * 60 * 24);
      setTotalCost(Math.round(days * price)); 
    }
  };

  const updateTotalCost = (start, end) => {
    const days = (end - start) / (1000 * 60 * 60 * 24);
    setTotalCost(Math.round(days * price));
    setIsCostUpdated(true);
  };

  const handleSubmit = async () => {
    if (endDate <= startDate) {
      toast.error("Data zwrotu musi być późniejsza niż data wypożyczenia.")
      return;
    }

    onReserve({
      startDate,
      endDate,
      totalCost,
    });
  };

  return (
    <div className="reservation-window">
      <h1>Wypożycz produkt</h1>
      <p>Cena: {price} zł/za dobę</p>   
      <div className="date-picker-container">
        <label htmlFor="start-date">Data wypożyczenia:</label>
        <DatePicker
          onKeyDown={(e) => e.preventDefault()}
          selected={startDate}
          onChange={handleStartDateChange}
          dateFormat="yyyy-MM-dd"
          id="start-date"
          name="start-date"
          className="date-picker"
        />
      </div>
      <div className="date-picker-container">
        <label htmlFor="end-date">Data zwrotu:</label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          dateFormat="yyyy-MM-dd"
          id="end-date"
          name="end-date"
          className="date-picker"
          onKeyDown={(e) => e.preventDefault()}
        />
      </div>

      <div className="availability-info">
        <p className={`availability-status ${isAvailable ? 'available' : 'unavailable'}`}>
          {isAvailable 
            ? `Dostępnych sztuk: ${availableCount}` 
            : 'Produkt tymczasowo niedostępny'}
        </p>
      </div>
      {isCostUpdated && !error && <p>Całkowity koszt: {totalCost} zł</p>}
      <button 
        onClick={handleSubmit} 
        className={`rent-button ${!isAvailable ? 'disabled' : ''}`}
        disabled={!isAvailable}
      >
        {isAvailable ? 'ZAREZERWUJ' : 'NIEDOSTĘPNY'}
      </button>
    </div>
  );
}
