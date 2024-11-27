import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Cargar productos desde la API al montar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3005/productos');
        console.log('Productos obtenidos:', response.data); // Debug: Verifica si los datos llegan
        setProducts(response.data);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProducts();
  }, []);

  // Función para agregar un producto a la API
  const addProduct = async (product) => {
    try {
      const response = await axios.post('http://localhost:3005/productos', product);
      setProducts([...products, response.data]); // Agregar el nuevo producto al estado local
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
  };

  // Eliminar un producto de la API y actualizar el estado
  const deleteProduct = async (productId) => {
    try {
        // Eliminar de la base de datos usando el ID
        await axios.delete(`http://localhost:3005/productos/${productId}`);
        
        // Actualizar el estado local eliminando el producto
        setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }
  };

  return (
    <ProductsContext.Provider value={{ products, filteredProducts, setFilteredProducts, addProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};
