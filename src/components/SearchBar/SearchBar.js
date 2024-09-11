import React, { useState, useContext } from 'react';
import './SearchBar.css';
import { ProductsContext } from '../../context/ProductsContext';

const FilterBar = () => {
  const { setFilteredProducts, products } = useContext(ProductsContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const handleFilter = () => {
    let filtered = products;

    // Filtrar por nombre
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (category) {
      filtered = filtered.filter(product => product.categoria === category);
    }

    // Filtrar por rango de precio
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    setFilteredProducts(filtered); // Aplicar los filtros a los productos
  };

  return (
    <div className="filter-bar">
      <h2>Filtrado por</h2>
      <hr />

      {/* Buscar por nombre */}
      <div className="filter-group">
        <label>Buscar</label>
        <input
          type="text"
          placeholder="Buscar producto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filtrar por categoría */}
      <div className="filter-group">
        <label>Categoría</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Todas</option>
          <option value="Ropa Deportiva Mujer">Ropa Deportiva Mujer</option>
          <option value="Ropa Deportiva Hombre">Ropa Deportiva Hombre</option>
          <option value="Bebidas">Bebidas</option>
          <option value="Suplementos">Suplementos</option>
          <option value="Accesorios">Accesorios</option>
        </select>
      </div>

      {/* Filtrar por rango de precios */}
      <div className="filter-group">
        <label>Rango de precios</label>
        <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
          <option value="">Todos</option>
          <option value="0-5000">0 - 5,000</option>
          <option value="5001-20000">5,001 - 20,000</option>
          <option value="20001-50000">20,001 - 50,000</option>
          <option value="50001-100000">50,001 - 100,000</option>
        </select>
      </div>

      <button className="filter-button" onClick={handleFilter}>
        Aplicar Filtros
      </button>
    </div>
  );
};

export default FilterBar;
