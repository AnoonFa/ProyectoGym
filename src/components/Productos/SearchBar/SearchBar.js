import React, { useState } from 'react';
import ReactSlider from 'react-slider';
import './SearchBar.css';
import { Button, Modal } from '@mui/material';
import ProductForm from '../ProductForm/ProductForm';
import { useAuth } from '../../../context/RoleContext';

const SearchBar = ({ onSearch, onPriceRangeSelect, onClearFilters }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([2500, 100000]); // Rango de precios inicial [min, max]
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal de añadir productos
  const { user } = useAuth(); // Usamos el contexto de autenticación

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handlePriceChange = (values) => {
    setPriceRange(values);
    onPriceRangeSelect(values[0], values[1]);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setPriceRange([2500, 100000]); // Reiniciar al rango predeterminado
    onSearch('');
    onPriceRangeSelect(2500, 100000);
    onClearFilters(); // Llamar para limpiar todos los filtros
  };

  // Funciones para abrir y cerrar el modal de añadir productos
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="filter-bar">
      <h2 className='filtrarr-'>Filtrar por</h2>
      <div className="filter-group-search">
        <label>Buscar</label>
        <input
          type="text"
          placeholder="Buscar producto"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="filter-group-search">
        <label>Precio</label>
        <ReactSlider
          className="price-slider"
          thumbClassName="price-thumb"
          trackClassName="price-track"
          min={2500}
          max={100000}
          value={priceRange}
          onChange={handlePriceChange}
          ariaLabel={['Min price', 'Max price']}
          pearling
          minDistance={1000}
        />
        <div className="price-values">
          <span>{`$${priceRange[0].toLocaleString()}`}</span>
          <span>{`$${priceRange[1].toLocaleString()}`}</span>
        </div>
      </div>
      <div className="butotnss">
      <button className="clear-filters-btn" onClick={handleClearFilters}>
        Limpiar Filtros
      </button>

      {/* Botón para abrir el modal de añadir productos */}
      {user.role === 'admin' && (
        <div className="add-product-button-container">
          <button className='add-filters-btn' onClick={handleOpenModal}>
            Añadir Producto
          </button>
        </div>
      )}
</div>
      {/* Modal que contiene el formulario para añadir productos */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal-container">
          <ProductForm
            initialProduct={null} // Como es añadir, no hay producto inicial
            onSubmit={() => {
              handleCloseModal(); // Cerrar modal tras enviar el formulario
            }}
            onCancel={handleCloseModal} // Cerrar modal si se cancela
          />
        </div>
      </Modal>
    </div>
  );
};

export default SearchBar;
