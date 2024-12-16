import { useState, useEffect } from "react";
import BillComponent from "./components/BillComponent/BillComponent";
import Header from "../MainPage/components/Header/Header";
import CartCard from "./components/CartCard/CartCard";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./CartPage.css";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCart = () => {
      const cartData = localStorage.getItem('cart');
      if (!cartData) return setCartItems([]);
      
      try {
        const parsedData = JSON.parse(cartData);
        setCartItems(parsedData.items || []);
      } catch (error) {
        console.error('Error parsing cart data:', error);
        setCartItems([]);
      }
    };

    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const handleRemove = (timestamp) => {
    try {
      const currentCart = JSON.parse(localStorage.getItem('cart'));
      const updatedCart = {
        items: currentCart.items.filter(item => item.timestamp !== timestamp)
      };
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart.items);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Błąd podczas usuwania przedmiotu z koszyka:', error);
    }
  };

  return (
    <div className="cart-page">
      <Header />
      <div className="cart-content">
        {!cartItems.length ? (
          <p className="empty-cart">Twój koszyk jest pusty</p>
        ) : (
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.timestamp} className="cart-item">
                <CartCard 
                  item={item}
                  onRemove={() => handleRemove(item.timestamp)}
                />
                <BillComponent
                  startDate={item.startDate}
                  endDate={item.endDate}
                  productName={item.name}
                  totalCost={item.totalCost}
                  equipmentId={item.id}
                  timestamp={item.timestamp}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer 
        position="top-center" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        draggable
        theme="light"
      />
    </div>
  );
}