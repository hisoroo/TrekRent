/* eslint-disable react/prop-types */
import "./CartCard.css";

const CartCard = ({ item, onRemove }) => {
  return (
    <div className="cart-card">
      <button
        onClick={() => onRemove(item.id)}
        className="cart-card-remove-button"
        title="Usuń z koszyka"
      ></button>
      <div className="cart-card-left">
        <h2 className="cart-card-name">{item.name}</h2>
        <img src={item.image} alt={item.name} className="cart-card-image" />
      </div>
    </div>
  );
};

export default CartCard;