import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ReservationWindow.css";

export default function ReservationWindow({ price, onReserve }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [error, setError] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [isCostUpdated, setIsCostUpdated] = useState(false);


  useEffect(() => {
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 3);
    setEndDate(returnDate);
    calculateInitialCost(new Date(), returnDate);
  }, [price]);

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

  const handleSubmit = () => {
    if (endDate <= startDate) {
      setError("Data zwrotu musi być późniejsza niż data wypożyczenia.");
    } else {
      setError("");
      onReserve({
        startDate,
        endDate,
        totalCost,
      });
      console.log(
        "Wypożyczono od",
        startDate.toLocaleDateString(),
        "do",
        endDate.toLocaleDateString()
      );
    }
  };

  return (
    <div className="reservation-window">
      <h1>Wypożycz produkt</h1>
      <p>Cena: {price} zł/za dobę</p>
      <div className="date-picker-container">
        <label htmlFor="start-date">Data wypożyczenia:</label>
        <DatePicker
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
        />
      </div>
      {isCostUpdated && !error && <p>Całkowity koszt: {totalCost} zł</p>}
      {error && <p className="error">{error}</p>}
      <button onClick={handleSubmit} className="rent-button">
        ZAREZERWUJ
      </button>
    </div>
  );
}
