/* eslint-disable react/prop-types */
import "./ProductCard.css";

export default function ProductCard({ image, name, description }) {
  return (
    <div className="product-card">
      <h2 className="product-name">{name}</h2>
      <p className="product-description">{description}</p>
      <img src={image} alt={name} className="product-image"/>
    </div>
  );
}
