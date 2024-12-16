/* eslint-disable react/prop-types */
import "./ProductCard.css";

export default function ProductCard({ name, description, image }) {
  if (!name || !description) {
    return <div className="product-card">Ładowanie...</div>;
  }

  return (
    <div className="product-card">
      <h2 className="product-name">{name}</h2>
      <p className="product-description">{description}</p>
      <img 
        src={image} 
        alt={name} 
        className="product-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/placeholder.jpg';
        }}
      />
    </div>
  );
}
