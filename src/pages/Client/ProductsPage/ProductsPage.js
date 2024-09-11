import React, { useContext } from 'react';
import SearchBar from '../../../components/SearchBar/SearchBar';
import CategoryCircles from '../../../components/CategoryCircles/CategoryCircles';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { ProductsContext } from '../../../context/ProductsContext';
import './ProdcutPage.css';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import ProductForm from '../../../components/ProductForm/ProductForm';
import BattleRopeImage from '../../../assets/images/1366_2000.jpeg'; // Ensure you import the image

const ProductPage = () => {
  const { filteredProducts, products } = useContext(ProductsContext);
  const productsToShow = filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <>
      <Header />
      <div className="album-page">
        {/* Replace the Carousel with an image */}
        <div className="banner-image">
          <img src={BattleRopeImage} alt="Fitness Image" className="full-width-image" />
        </div>

        {/* Category Circles */}
        <CategoryCircles />

        {/* Sidebar and Product Grid */}
        <div className="content-container">
          <div className="searchbar-container">
            <SearchBar /> {/* Filter Sidebar */}
          </div>

          <div className="products-section">
            <h2>Productos</h2>
            <ProductForm />
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
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
