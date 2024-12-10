/* eslint-disable react/prop-types */
import './EquipmentCard.css';
import { Link } from "react-router-dom";

export default function EquipmentCard({ id, image, name, price }) {
  return (
    <div className="equipment-card">
      <img src={image} alt={name} />
      <h2 className="equipment-name">{name}</h2>
      <p className="equipment-price">{price}</p>
      <Link to={`/equipment/${id}`} className="rent-button">Wypożycz</Link>
    </div>
  );
}