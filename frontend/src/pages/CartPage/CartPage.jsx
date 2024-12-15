import { useState, useEffect } from "react";
import BillComponent from "./components/BillComponent/BillComponent";
import Header from "../MainPage/components/Header/Header";
import "./CartPage.css";
import CartCard from "./components/CartCard/CartCard";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
  
    useEffect(() => {
      const loadCart = () => {
        try {
          const cartData = localStorage.getItem('cart');
          if (cartData) {
            const parsedData = JSON.parse(cartData);
            if (parsedData.items && Array.isArray(parsedData.items)) {
              setCartItems(parsedData.items);
            } else if (parsedData) {
              setCartItems([parsedData]);
            }
          }
        } catch (error) {
          console.error('Error parsing cart data:', error);
          setCartItems([]);
        }
      };
  
      loadCart();
      window.addEventListener('cartUpdated', loadCart);
      
      return () => {
        window.removeEventListener('cartUpdated', loadCart);
      };
    }, []);

    const handleRemove = (timestamp) => {
      try {
        const currentCart = JSON.parse(localStorage.getItem('cart'));
        
        if (currentCart && currentCart.items) {
          const updatedCart = {
            ...currentCart,
            items: currentCart.items.filter(item => item.timestamp !== timestamp)
          };
          
          localStorage.setItem('cart', JSON.stringify(updatedCart));
          setCartItems(updatedCart.items);
          window.dispatchEvent(new Event('cartUpdated'));
        }
      } catch (error) {
        console.error('Błąd podczas usuwania przedmiotu z koszyka:', error);
      }
    };
  
    const isCartEmpty = !cartItems || cartItems.length === 0;
  
    return (
      <div className="cart-page">
        <Header />
        <div className="cart-content">
          {isCartEmpty ? (
            <p className="empty-cart">Twój koszyk jest pusty</p>
          ) : (
            <div className="cart-items">
              {cartItems.flat().map((item) => (
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
              />
              </div>
            ))}
            </div>
          )}
        </div>
      </div>
    );
  }