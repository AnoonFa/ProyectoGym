import React from 'react';
import './CategoryCircles.css';
import RopaDeportivaMujerImg from '../../../assets/images/mujerdeportiva_-removebg-preview.png';
import RopaDeportivaHombreImg from '../../../assets/images/hombredeportiva-removebg-preview.png';
import SuplementosImg from '../../../assets/images/suplementos.png';
import BebidasImg from '../../../assets/images/aguas.png';
import AccesoriosImg from '../../../assets/images/accesorios-removebg-preview.png';

const categories = [
  { name: 'Ropa Deportiva Mujer', img: RopaDeportivaMujerImg, category: 'ropa deportiva mujer' },
  { name: 'Ropa Deportiva Hombre', img: RopaDeportivaHombreImg, category: 'ropa deportiva hombre' },
  { name: 'Suplementos', img: SuplementosImg, category: 'suplementos' },
  { name: 'Bebidas', img: BebidasImg, category: 'bebidas' },

];

const CategoryCircles = ({ onCategorySelect }) => {
  return (
    <div className="category-circles">
      {categories.map((category, index) => (
        <div
          key={index}
          className="category-circle"
          onClick={() => onCategorySelect(category.category)}
        >
          <div className={`category-image-container ${category.name === 'Bebidas' ? 'large' : ''}`}>
            <img src={category.img} alt={category.name} className="category-image" />
          </div>
          <div className="category-name">{category.name}</div>
        </div>
      ))}
    </div>
  );
};

export default CategoryCircles;
