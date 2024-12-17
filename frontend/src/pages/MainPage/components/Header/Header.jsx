import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./Header.css";
import { FaSignInAlt, FaUserPlus, FaChartLine, FaSignOutAlt, FaTools, FaMagic, FaUserCircle } from "react-icons/fa";

export default function Header() {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cartData = localStorage.getItem("cart");
        if (cartData) {
          const parsedData = JSON.parse(cartData);
          const itemsCount = parsedData?.items?.length || 0;
          setCartItemsCount(itemsCount);
        } else {
          setCartItemsCount(0);
        }
      } catch (error) {
        console.error("Błąd podczas aktualizacji licznika koszyka:", error);
        setCartItemsCount(0);
      }
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const checkLoginStatus = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setIsLoggedIn(true);
        setUserRole(parsedUserData.role);
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserRole(null);
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleInitializeEquipment = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/equipment-types/');
      const equipmentTypes = await response.json();

      const count = 5;
      for (const type of equipmentTypes) {
        await fetch(`http://localhost:8000/api/equipment/initialize/${type.id}?count=${count}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });
      }
      alert('Pomyślnie zainicjalizowano sprzęt dla wszystkich typów!');
    } catch (error) {
      console.error('Błąd podczas inicjalizacji sprzętu:', error);
      alert('Wystąpił błąd podczas inicjalizacji sprzętu');
    }
  };

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
          <button
            className="account-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <img src="/user-alt-1-svgrepo-com.svg" alt="account" />
          </button>
          {isMenuOpen && (
            <div className="menu-dropdown">
              {isLoggedIn ? (
                <>
                  <Link to="/account" className="menu-item">
                    <FaUserCircle className="menu-icon" style={{ marginRight: '8px' }} /> Moje konto
                  </Link>
                  {userRole === "user" && (
                    <>
                      <Link to="/manage-equipment" className="menu-item">
                        <FaTools className="menu-icon" style={{ marginRight: '8px' }} /> Zarządzanie sprzętem
                      </Link>
                      <Link to="/trends" className="menu-item">
                        <FaChartLine className="menu-icon" style={{ marginRight: '8px' }} /> Analiza trendów
                      </Link>
                      <button onClick={handleInitializeEquipment} className="menu-item" style={{color: '#ff6b6b'}}>
                        <FaMagic className="menu-icon" style={{ marginRight: '8px' }} /> Inicjalizuj sprzęt (TEST)
                      </button>
                    </>
                  )}
                  <button onClick={handleLogout} className="menu-item">
                    <FaSignOutAlt className="menu-icon" style={{ marginRight: '8px' }} /> Wyloguj się
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="menu-item">
                    <FaSignInAlt className="menu-icon" style={{ marginRight: '8px' }} /> Zaloguj się
                  </Link>
                  <Link to="/register" className="menu-item">
                    <FaUserPlus className="menu-icon" style={{ marginRight: '8px' }} /> Zarejestruj się
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}