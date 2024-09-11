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

    // Filter by product name
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter(product => product.category === category);
    }

    // Filter by price range
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    setFilteredProducts(filtered); // Set the filtered products
  };

  return (
    <div className="filter-bar">
      <h2>Filtrado por</h2>
      <hr />

      {/* Search by Product Name */}
      <div className="filter-group">
        <label>Buscar</label>
        <input
          type="text"
          placeholder="Buscar producto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter by Category */}
      <div className="filter-group">
        <label>Categoría</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Todas</option>
          <option value="ropa deportiva mujer">Ropa Deportiva Mujer</option>
          <option value="ropa deportiva hombre">Ropa Deportiva Hombre</option>
          <option value="bebidas">Bebidas</option>
          <option value="suplementos">Suplementos</option>
          <option value="accesorios">Accesorios</option>
        </select>
      </div>

      {/* Filter by Price Range */}
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
