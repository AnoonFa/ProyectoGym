import React, { useState, useContext, useEffect } from 'react';
import { ProductsContext } from '../../context/ProductsContext';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const { setFilteredProducts, products } = useContext(ProductsContext);

  useEffect(() => {
    // Filtrar productos en tiempo real mientras el usuario escribe
    setFilteredProducts(
      products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, products, setFilteredProducts]);

  return ( 
    <>
      <center><h2>Buscar Productos</h2></center>
      <br/>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Ingrese que producto quiere buscar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={() => setFilteredProducts(
          products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
          )
        )}>
          Buscar
        </button>
      </div>
    </>
  );
};

export default SearchBar;
