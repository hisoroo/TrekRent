import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import MainPage from "./pages/MainPage/MainPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import CartPage from "./pages/CartPage/CartPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
// import ManageEquipmentPage from "./pages/ManageEquipmentPage/ManageEquipmentPage";
// import TrendsPage from "./pages/TrendsPage/TrendsPage";

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/equipment/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/manage-equipment" element={<ManageEquipmentPage />} /> */}
          {/* <Route path="/trends" element={<TrendsPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}