import React from "react";
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