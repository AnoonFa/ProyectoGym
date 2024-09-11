import React, { useContext } from 'react';
import './CategoryCircles.css';
import { ProductsContext } from '../../context/ProductsContext';

// Imágenes de categorías
import RopaDeportivaMujerImg from '../../assets/images/mujerdeportiva_.jpg';
import RopaDeportivaHombreImg from '../../assets/images/hombredeportiva.jpg';
import SuplementosImg from '../../assets/images/suplementos.png';
import BebidasImg from '../../assets/images/bebidas-energeticas.jpg';
import AccesoriosImg from '../../assets/images/263.webp';

// Definir las categorías
const categories = [
  { name: 'Ropa Deportiva Mujer', img: RopaDeportivaMujerImg, categoria: 'Ropa Deportiva Mujer' },
  { name: 'Ropa Deportiva Hombre', img: RopaDeportivaHombreImg, categoria: 'Ropa Deportiva Hombre' },
  { name: 'Suplementos', img: SuplementosImg, categoria: 'Suplementos' },
  { name: 'Bebidas', img: BebidasImg, categoria: 'Bebidas' },
  { name: 'Accesorios', img: AccesoriosImg, categoria: 'Accesorios' },
];

const CategoryCircles = ({ onCategorySelect }) => {
  return (
    <div className="category-circles">
      {categories.map((category, index) => (
        <div
          key={index}
          className="category-circle"
          onClick={() => onCategorySelect(category.categoria)} // Usar la función callback
        >
          <img src={category.img} alt={category.name} className="category-image" />
          <div className="category-name">{category.name}</div>
        </div>
      ))}
    </div>
  );
};

export default CategoryCircles;
