import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./Header.css";

export default function Header() {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
          const parsedData = JSON.parse(cartData);
          const itemsCount = parsedData?.items?.length || 0;
          setCartItemsCount(itemsCount);
        } else {
          setCartItemsCount(0);
        }
      } catch (error) {
        console.error('Błąd podczas aktualizacji licznika koszyka:', error);
        setCartItemsCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="header">
      <Link to="/" className="home-button">
        <img src="/bike-svgrepo-com.svg" alt="logo" />
      </Link>
      <Link to="/" className="header-title">
        TrekRent
      </Link>
      <div className="right-section">
        <Link to="/cart" className="cart-button">
          <img src="/cart-shopping-svgrepo-com.svg" alt="cart" />
          {cartItemsCount > 0 && (
            <span className="cart-counter">{cartItemsCount}</span>
          )}
        </Link>
        <div className="account-menu" ref={menuRef}>
          <button className="account-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <img src="/user-alt-1-svgrepo-com.svg" alt="account" />
          </button>
          {isMenuOpen && (
            <div className="menu-dropdown">
              <Link to="/login" className="menu-item">Zaloguj się</Link>
              <Link to="/register" className="menu-item">Zarejestruj się</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
