import ProductCard from "./components/ProductCard/ProductCard";
import { useParams } from "react-router-dom";
import ReservationWindow from "./components/ReservationWindow/ReservationWindow";
import Header from "../MainPage/components/Header/Header";
import ReservationModal from "./components/ReservationModal/ReservationModal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import equipmentData from '../../utils/equipmentData.json';
import "./ProductPage.css";

export default function ProductPage() {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [reservationData, setReservationData] = useState({
    startDate: null,
    endDate: null,
    totalCost: 0,
  });
  const [productData, setProductData] = useState({
    id: "",
    image: "",
    name: "",
    description: "",
    price: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const product = equipmentData.find((item) => item.id === parseInt(id));
    if (product) {
      setProductData({
        id: product.id,
        image: product.image,
        name: product.name,
        description: product.description,
        price: product.price,
      });
    }
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/equipment/catalog/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProductData(data);
      })
      .catch((error) => console.error("Error fetching product data:", error));
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
      id: productData.id,
      name: productData.name,
      image: productData.image,
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
        <ProductCard
          image={productData.image}
          name={productData.name}
          description={productData.description}
        />
        <ReservationWindow
          price={productData.price}
          onReserve={handleReserveClick}
        />
        <ReservationModal
          show={showModal}
          onClose={handleCloseModal}
          onGoToCart={handleGoToCart}
          onContinueBrowsing={handleContinueBrowsing}
          productImage={productData.image}
          productName={productData.name}
          startDate={reservationData.startDate}
          endDate={reservationData.endDate}
          totalCost={reservationData.totalCost}
        />
      </div>
    </>
  );
}
