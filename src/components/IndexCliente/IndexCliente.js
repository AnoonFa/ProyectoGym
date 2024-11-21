import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import ClientClass from '../../pages/Client/ClassesPage/ClassesPage';
import ProductsClient from '../../pages/Client/ProductsPage/ProductsPage';
import RutinesPage from '../../pages/Client/RoutinesPage/RoutinesPage'; 
import Carousel from '../Carousel/Carousel';
import SearchBar from '../Productos/SearchBar/SearchBar';
import ProductCard from '../Productos/ProductCard/ProductCard';
import Plans from '../Relleno/Relleno';
import CategoryCircles from '../Productos/CategoryCircles/CategoryCircles';
import RutinasCliente from '../Rutina/RutinasCliente';
import Planes from '../../pages/Planes/Planes';
import { ProductsContext } from '../../context/ProductsContext';
import Relleno from '../Relleno/Relleno';

function ClientePage() {
  const { filteredProducts, products, setFilteredProducts } = useContext(ProductsContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  // Actualizar productos filtrados cuando cambian los filtros
  useEffect(() => {
    let filtered = products;

    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceRange) {
      const [min, max] = priceRange;
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    setFilteredProducts(filtered);
  }, [categoryFilter, searchTerm, priceRange, products, setFilteredProducts]);

  const handlePriceRangeSelect = (min, max) => {
    setPriceRange([min, max]);
  };

  const handleClearFilters = () => {
    setCategoryFilter(null);
    setSearchTerm('');
    setPriceRange([0, 100000]);
  };

  const productsToShow = filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <>
      <Header />
      <Relleno/>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Carousel />
              <Planes />
              <CategoryCircles onCategorySelect={setCategoryFilter} />
              <div className="content-container">
                <div className="searchbar-container">
                  <SearchBar 
                    onSearch={setSearchTerm} 
                    onPriceRangeSelect={handlePriceRangeSelect} 
                    onCategorySelect={setCategoryFilter}
                    onClearFilters={handleClearFilters}
                  />
                </div>
                <div className="products-section">
                  <div className="products-grid">
                    {productsToShow.length > 0 ? (
                      productsToShow.map((product, index) => (
                        <ProductCard key={index} product={product} />
                      ))
                    ) : (
                      <p>No hay productos disponibles.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          }
        />
        <Route path="/" element={<h2>Bienvenido, Cliente</h2>} />
        <Route path='ClientClass' element={<ClientClass />} />
        <Route path='Planes' element={<Planes />} />
        <Route path='ProductsClient' element={<ProductsClient />} />
        <Route path='RutinesClient' element={<RutinesPage />} />
        <Route path="RutinasCliente" element={<RutinasCliente />} />
        {/* Otras rutas aquí */}
      </Routes>
      <Footer />
    </>
  );
}

export default ClientePage;
