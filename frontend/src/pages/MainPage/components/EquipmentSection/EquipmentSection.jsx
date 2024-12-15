import PropTypes from "prop-types";
import "./EquipmentSection.css";
import EquipmentCard from "../EquipmentCard/EquipmentCard";

export default function EquipmentSection({ equipment }) {
  return (
    <section className="equipment-section">
      <div className="equipment-list">
        {equipment.map((item) => (
          <EquipmentCard
            key={item.id}
            id={item.id}
            image={item.image}
            name={item.name}
            price={`Cena: ${item.price} zł/dzień`}
          />
        ))}
      </div>
    </section>
  );
}

EquipmentSection.propTypes = {
  equipment: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
};
