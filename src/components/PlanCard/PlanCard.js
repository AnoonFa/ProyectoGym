import React from 'react';
import './PlanCard.css';

const PlanCard = ({ image, title, description, price, onClick }) => {
  return (
    <div className="plan-card">
      <img src={image} alt={title} className="plan-image" />
      <h2>{title}</h2>
      <p>{description}</p>
      <p>Desde <strong>${price}</strong></p>
      <button onClick={onClick} className="buy-link">Comprar</button>
    </div>
  );
};

export default PlanCard;
