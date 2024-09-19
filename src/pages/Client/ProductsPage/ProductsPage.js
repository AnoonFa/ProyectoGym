import React, { useContext, useState, useEffect } from 'react';
import SearchBar from '../../../components/SearchBar/SearchBar';
import CategoryCircles from '../../../components/CategoryCircles/CategoryCircles';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { ProductsContext } from '../../../context/ProductsContext';
import './ProdcutPage.css';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import BattleRopeImage from '../../../assets/images/1366_2000.jpeg'; // Asegúrate de que la ruta de la imagen sea correcta.
import ProductForm from '../../../components/ProductForm/ProductForm';
import { Button, Modal } from '@mui/material';
import { useAuth } from '../../../context/RoleContext';

const ProductPage = () => {
  const { products, filteredProducts, setFilteredProducts } = useContext(ProductsContext);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para la barra de búsqueda
  const [categoryFilter, setCategoryFilter] = useState(null); // Estado para la categoría seleccionada
  const [priceRange, setPriceRange] = useState(''); // Estado para el rango de precios
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal

  const { user, setUser } = useAuth(); // Usamos el contexto de autenticación


  // Lógica para aplicar los filtros de nombre, categoría y precio
  useEffect(() => {
    let filtered = products;

    // Filtrar por categoría si hay una seleccionada
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Filtrar por nombre si se ingresa un término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por rango de precio si se selecciona uno
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    setFilteredProducts(filtered); // Actualizar productos filtrados
  }, [categoryFilter, searchTerm, priceRange, products, setFilteredProducts]);

  

  // Funciones para abrir y cerrar el modal
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <Header />
      <div className="album-page">
        <div className="banner-image">
          <img src={BattleRopeImage} alt="Fitness Image" className="full-width-image" />
        </div>

        <br />
        <h2><center>Nuestras Categorías</center></h2>
        <CategoryCircles onCategorySelect={setCategoryFilter} />

        {/* Botón para abrir el modal */}


        {/* Modal que contiene el formulario */}
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
        <div className="content-container">
          <div className='filter-butoon'>
          <div className="searchbar-container">
            <SearchBar 
              onSearch={setSearchTerm} 
              onPriceRangeSelect={setPriceRange} 
            /></div>

          <div className="add-product-button-container">
          {user.role === 'admin' &&(
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Añadir Producto
          </Button>)
          }
        </div>
        </div>
          
          

          <div className="products-section">
            <div className="products-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))
              ) : (
                <p>No hay productos disponibles.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
