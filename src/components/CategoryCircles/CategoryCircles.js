import React from 'react';
import './CategoryCircles.css';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Ropa Deportiva Mujer', icon: '👚', path: '/products/Ropa deportiva mujer' },
  { name: 'Ropa Deportiva Hombre', icon: '👕', path: '/products/Ropa deportiva hombre' },
  { name: 'Suplementos', icon: '💪', path: '/products/Suplementos' },
  { name: 'Bebidas', icon: '🥤', path: '/products/Bebidas' },
  { name: 'Accesorios', icon: '🧢', path: '/products/Accesorios' },
];

const CategoryCircles = () => {
  const navigate = useNavigate();

  return (
    <div className="category-circles">
      {categories.map((category, index) => (
        <div
          key={index}
          className="category-circle"
          onClick={() => navigate(category.path)}
        >
          <div className="category-icon">{category.icon}</div>
          <div className="category-name">{category.name}</div>
        </div>
      ))}
    </div>
  );
};

export default CategoryCircles;