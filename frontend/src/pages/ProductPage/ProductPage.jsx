import ProductCard from "./components/ProductCard/ProductCard";
import { useParams } from "react-router-dom";
import ReservationWindow from "./components/ReservationWindow/ReservationWindow";
import Header from "../MainPage/components/Header/Header";
import ReservationModal from "./components/ReservationModal/ReservationModal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductPage.css";

export default function ProductPage() {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [reservationData, setReservationData] = useState({
    startDate: null,
    endDate: null,
    totalCost: 0,
  });
  const [equipmentType, setEquipmentType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/equipment-types/${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched product data:', data); // Debug log
          setEquipmentType(data);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  const saveToCart = (item) => {
    try {
      const cartKey = 'cart';
      const currentCart = JSON.parse(localStorage.getItem(cartKey)) || { items: [] };
      const newCart = {
        items: Array.isArray(currentCart.items) 
          ? [...currentCart.items, item]
          : [item],
      };
      localStorage.setItem(cartKey, JSON.stringify(newCart));
    } catch (error) {
      console.error('Błąd podczas zapisywania do koszyka:', error);
    }
  };
  const handleReserveClick = (reservationDetails) => {
    const cartItem = {
      id: equipmentType.id,
      name: equipmentType.name,
      image: equipmentType.image_path,
      startDate: reservationDetails.startDate,
      endDate: reservationDetails.endDate,
      totalCost: reservationDetails.totalCost,
      timestamp: new Date().toISOString(),
    };

    saveToCart(cartItem);
    window.dispatchEvent(new Event("cartUpdated"));
    setReservationData(reservationDetails);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  const handleContinueBrowsing = () => {
    navigate("/");
  };

  return (
    <>
      <Header />
      <div className="product-page">
        {equipmentType ? (
          <>
            <ProductCard 
              name={equipmentType.name}
              description={equipmentType.description}
              image={equipmentType.image_path}
            />
            <ReservationWindow 
              price={equipmentType.price}
              equipmentId={equipmentType.id}
              onReserve={handleReserveClick}
            />
            <ReservationModal
              show={showModal}
              onClose={handleCloseModal}
              onGoToCart={handleGoToCart}
              onContinueBrowsing={handleContinueBrowsing}
              productImage={equipmentType.image_path}
              productName={equipmentType.name}
              startDate={reservationData.startDate}
              endDate={reservationData.endDate}
              totalCost={reservationData.totalCost}
            />
          </>
        ) : (
          <p>Ładowanie...</p>
        )}
      </div>
    </>
  );
}
