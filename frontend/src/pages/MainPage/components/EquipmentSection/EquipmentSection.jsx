import PropTypes from "prop-types";
import "./EquipmentSection.css";
import EquipmentCard from "../EquipmentCard/EquipmentCard";

export default function EquipmentSection({ equipment }) {
  return (
    <section className="equipment-section">
      <div className="equipment-list">
        {Array.isArray(equipment) && equipment.length > 0 ? (
          equipment.map((item) => (
            <EquipmentCard
              key={item.id}
              id={item.id}
              image={item.image_path}
              name={item.name}
              price={`Cena: ${item.price} zł/dzień`}
            />
          ))
        ) : (
          <div className="no-equipment">Nie mamy takiego sprzętu, zmień filtry i spróbuj ponownie.</div>
        )}
      </div>
    </section>
  );
}

EquipmentSection.propTypes = {
  equipment: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.number.isRequired,
      image_path: PropTypes.string,
      name: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      description: PropTypes.string,
    })
  ),
};
