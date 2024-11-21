import React, { useContext, useState, useEffect } from 'react';
import SearchBar from '../../../components/Productos/SearchBar/SearchBar';
import CategoryCircles from '../../../components/Productos/CategoryCircles/CategoryCircles';
import ProductCard from '../../../components/Productos/ProductCard/ProductCard';
import { ProductsContext } from '../../../context/ProductsContext';
import './ProdcutPage.css';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import BattleRopeImage from '../../../assets/images/1366_2000.jpeg';
import { Button, Modal } from '@mui/material';
import { useAuth } from '../../../context/RoleContext';
import Relleno from '../../../components/Relleno/Relleno';

const ProductPage = () => {
  const { products, filteredProducts, setFilteredProducts } = useContext(ProductsContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

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

  return (
    <>
      <Header />
      <Relleno/>
      <div className="album-page">
        <div className="banner-image">
          <img src={BattleRopeImage} alt="Fitness Image" className="full-width-image" />
        </div>

        <h2 className='nuestras-categorias'>Nuestras Categorías</h2>
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
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))
          ) : (
            <p>No hay productos disponibles.</p>
          )}
          {/* Placeholder para llenar el espacio si hay menos de 4 productos */}
          {[...Array(4 - Math.min(filteredProducts.length, 4))].map((_, index) => (
            <div className="product-placeholder" key={index}></div>
          ))}
        </div>
      </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
