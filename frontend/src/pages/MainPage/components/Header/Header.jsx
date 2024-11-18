import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Header.css";

export default function Header() {

  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItemsCount(cartItems.length);
    };
    updateCartCount();

    window.addEventListener('storage', updateCartCount);

    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  return (
    <nav className="header">
      <Link to="/" className="home-button">
        <img src="/bike-svgrepo-com.svg" alt="logo" />
      </Link>
      <Link to="/" className="header-title">
        TrekRent
      </Link>
      <Link to="/cart" className="cart-button">
        <img src="/cart-shopping-svgrepo-com.svg" alt="cart" />
        {cartItemsCount > 0 && (
          <span className="cart-counter">{cartItemsCount}</span>
        )}
      </Link>
    </nav>
  );
}
