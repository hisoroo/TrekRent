/* eslint-disable react/prop-types */
// BillComponent.jsx
import "./BillComponent.css";

const BillComponent = ({ startDate, endDate, productName, totalCost }) => {
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

  const handleReserve = () => {
    console.log("Rezerwacja dokonana");
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

        <button className="bill-button" onClick={handleReserve}>Zarezerwuj</button>
      </div>
    </div>
  );
};

export default BillComponent;
