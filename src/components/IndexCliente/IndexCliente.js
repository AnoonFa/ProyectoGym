import React, { useContext } from 'react';
import { Routes, Route } from "react-router-dom";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import ClientClass from '../../pages/Client/ClassesPage/ClassesPage';
import ProductsClient from '../../pages/Client/ProductsPage/ProductsPage';
import RutinesPage from '../../pages/Client/RoutinesPage/RoutinesPage'; 
import Carousel from '../../components/Carusel/Carusel';
import SearchBar from '../../components/SearchBar/SearchBar';
import ProductCard from '../../components/ProductCard/ProductCard';
import Plans from '../Plans/Plans';
import CategoryCircles from '../CategoryCircles/CategoryCircles';
import RutinasCliente from '../Rutina/RutinasCliente';
import Planes from '../../pages/Planes/Planes';
import { ProductsContext } from '../../context/ProductsContext';


function ClientePage() {
  const { filteredProducts, products } = useContext(ProductsContext);

const productsToShow = filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <>
      <Header />

      <Routes>

        <Route
          path="/"
          element={
            <>

              <Carousel />
              
              <Planes /> 
              <SearchBar />
              <CategoryCircles />
             
              <div className="products-container">
          <h2>Productos</h2>
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
