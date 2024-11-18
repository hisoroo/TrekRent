import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
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
      </Link>
    </nav>
  );
}
