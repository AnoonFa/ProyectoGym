import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, onPriceRangeSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(''); // Estado para el rango de precios

  // Actualizar el término de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value); // Notificar al componente padre del cambio
  };

  // Actualizar el rango de precios
  const handlePriceRangeChange = (e) => {
    setPriceRange(e.target.value);
    onPriceRangeSelect(e.target.value); // Notificar al componente padre del cambio
  };

  return (
    <div className="filter-bar">
      <h2>Buscar Productos</h2>
     
      <hr />

      {/* Filtro por nombre */}
      <div className="filter-group"> <br/>
        <label>Buscar</label>
        <input
          type="text"
          placeholder="Buscar producto"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filtrar por rango de precios */}
      <div className="filter-group">
        <label>Rango de precios</label>
        <select value={priceRange} onChange={handlePriceRangeChange}>
          <option value="">Todos</option>
          <option value="0-5000">0 - 5,000</option>
          <option value="5001-20000">5,001 - 20,000</option>
          <option value="20001-50000">20,001 - 50,000</option>
          <option value="50001-100000">50,001 - 100,000</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
