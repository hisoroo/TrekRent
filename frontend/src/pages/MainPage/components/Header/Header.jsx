import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./Header.css";
import { 
  FaSignInAlt, 
  FaUserPlus, 
  FaChartLine, 
  FaSignOutAlt, 
  FaTools,
  FaUserCircle, 
  FaMountain, 
  FaHiking, 
  FaCampground, 
  FaCompass, 
  FaMap, 
  FaSnowboarding,
  FaBiking,
  FaWater,
  FaUmbrellaBeach,
  FaSkiing,
} from "react-icons/fa";
import { BiUser, BiCartAlt } from "react-icons/bi";
import SearchSection from '../SearchSection/SearchSection';
import PropTypes from 'prop-types';

export default function Header({ onSearch, searchValue, equipmentTypes }) {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchInHeader, setShowSearchInHeader] = useState(false);

  const icons = [
    FaMountain,
    FaHiking,
    FaCampground,
    FaCompass,
    FaMap,
    FaSnowboarding,
    FaBiking,
    FaWater,
    FaUmbrellaBeach,
    FaSkiing,
  ];

  useEffect(() => {
    setIsAnimating(true);
    let currentIndex = currentIconIndex;
    
    const animationInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % icons.length;
      setCurrentIconIndex(currentIndex);
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(animationInterval);
      setCurrentIconIndex(Math.floor(Math.random() * icons.length));
      setIsAnimating(false);
    }, 500);

    return () => {
      clearInterval(animationInterval);
      clearTimeout(timeout);
    };
  }, [location.pathname]); // Trigger animation on route change

  const CurrentIcon = icons[currentIconIndex];

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dodaj nowy useEffect do śledzenia pozycji SearchSection
  useEffect(() => {
    const handleScroll = () => {
      const searchSection = document.querySelector('.search-section:not(.minimal)');
      if (searchSection) {
        const rect = searchSection.getBoundingClientRect();
        setShowSearchInHeader(rect.top < -100 && rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserRole(null);
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <Link to="/" className="logo-container">
        <CurrentIcon className={`logo-icon ${isAnimating ? 'animating' : ''}`} />
        <span>TrekRent</span>
      </Link>
      
      {/* Dodaj SearchBar w headerze */}
      <div className={`header-search ${showSearchInHeader ? 'visible' : ''}`}>
        <SearchSection 
          minimal={true} 
          equipmentTypes={equipmentTypes}
          onSearch={onSearch}
          searchValue={searchValue}
        />
      </div>

      <div className="right-section">
        <Link to="/cart" className="cart-button">
          <BiCartAlt className="nav-icon" />
          {cartItemsCount > 0 && (
            <span className="cart-counter">{cartItemsCount}</span>
          )}
        </Link>
        <div className="account-menu" ref={menuRef}>
          <button
            className="account-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <BiUser className="nav-icon" />
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

Header.propTypes = {
  onSearch: PropTypes.func.isRequired,
  searchValue: PropTypes.string,
  equipmentTypes: PropTypes.arrayOf(PropTypes.string)
};