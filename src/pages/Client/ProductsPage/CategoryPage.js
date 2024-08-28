import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ProductsContext } from '../../../context/ProductsContext';
import ProductCard from '../../../components/ProductCard/ProductCard';
import './CategoryPage.css';

const CategoryPage = () => {
    const { category } = useParams();
    const { products } = useContext(ProductsContext);
  
    const filteredProducts = products
      .filter(product => product.category.toLowerCase === category.toLowerCase())
      .slice(0, 9);
  
    return (
      <div className="category-page">
        <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
        <div className="products-grid">
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    );
};

export default CategoryPage;