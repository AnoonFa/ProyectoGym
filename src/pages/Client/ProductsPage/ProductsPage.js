import React, { useContext } from 'react';
import Carousel from '../../../components/Carusel/Carusel';
import SearchBar from '../../../components/SearchBar/SearchBar';
import CategoryCircles from '../../../components/CategoryCircles/CategoryCircles';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { ProductsContext } from '../../../context/ProductsContext';
import './ProdcutPage.css';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import ProductForm from '../../../components/ProductForm/ProductForm';

const ProductPage = () => {
  const { filteredProducts, products } = useContext(ProductsContext);

  const productsToShow = filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <>
      <Header />
      <div className="album-page">
        <Carousel />       
        <SearchBar />
        <CategoryCircles />

        <div className="products-container">
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
      <Footer />
    </>
  );
};

export default ProductPage;
