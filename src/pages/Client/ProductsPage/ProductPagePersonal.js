import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ProductsContext } from '../../../context/ProductsContext';
import ProductCard from '../../../components/Productos/ProductCard/ProductCard';
import './ProductPagePersonal.css';
import Footer from '../../../components/Footer/Footer';
import Header from '../../../components/Header/Header';
import ProductForm from '../../../components/Productos/ProductForm/ProductForm';
import Relleno from '../../../components/Relleno/Relleno';

const ProductPagePersonal = () => {
  const { category } = useParams();
  const { products } = useContext(ProductsContext);
  const [expandedProductId, setExpandedProductId] = useState(null); // Estado para rastrear la tarjeta expandida

  const filteredProducts = products.filter(product =>
    product.category.toLowerCase() === category.toLowerCase()
  );

  const handleExpandClick = (productId) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  return (
    <>
      <Header />
      <Relleno/>
      <div className="product-page">
        <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
        <ProductForm />
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <ProductCard
                key={index}
                product={product}
                isExpanded={expandedProductId === product.id} // Pasar si está expandido o no
                onExpandClick={() => handleExpandClick(product.id)} // Manejar clic para expandir
              />
            ))
          ) : (
            <p>No hay productos disponibles en esta categoría.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPagePersonal;
