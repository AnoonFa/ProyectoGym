import React, { useContext, useState } from 'react';
import SearchBar from '../../../components/SearchBar/SearchBar';
import CategoryCircles from '../../../components/CategoryCircles/CategoryCircles';
import ProductCard from '../../../components/ProductCard/ProductCard';
import { ProductsContext } from '../../../context/ProductsContext';
import './ProdcutPage.css';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import ProductForm from '../../../components/ProductForm/ProductForm'
import BattleRopeImage from '../../../assets/images/1366_2000.jpeg'; // Asegúrate de que la ruta de la imagen sea correcta.

const ProductPage = () => {
  const { filteredProducts, products, setFilteredProducts } = useContext(ProductsContext); // Añadimos setFilteredProducts aquí
  const [categoryFilter, setCategoryFilter] = useState(null); // Estado para manejar la categoría seleccionada

  // Filtrar productos según la categoría seleccionada
  const handleCategorySelect = (selectedCategory) => {
    setCategoryFilter(selectedCategory);
    if (selectedCategory) {
      const filtered = products.filter(product => product.categoria === selectedCategory);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // Si no hay categoría seleccionada, mostrar todos los productos
    }
  };

  const productsToShow = filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <>
      <Header />
      <div className="album-page">
        {/* Imagen banner */}
        <div className="banner-image">
          <img src={BattleRopeImage} alt="Fitness Image" className="full-width-image" />
        </div>

        {/* Círculos de Categorías */}
        <br/>
        <h2><center>Nuestras Categorias</center></h2>
        <CategoryCircles onCategorySelect={handleCategorySelect} /> {/* Pasar el callback */}

        {/* Barra lateral y productos */}
        <div className="content-container">
          <div className="searchbar-container">
            <SearchBar /> {/* Filtro de búsqueda */}
          </div>

          <div className="products-section">
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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
