import React, { useContext, useState } from "react";
import { ProductsContext } from "../../context/ProductsContext";
import ProductCard from "./ProductCard";

const Productos = () => {
    const { filteredProducts, products } = useContext(ProductsContext);
    const [expandedProductId, setExpandedProductId] = useState(null);

    const productsToShow = filteredProducts.length > 0 ? filteredProducts : products;

    const handleExpandClick = (productId) => {
        setExpandedProductId(prevId => prevId === productId ? null : productId);
    };

    return (
        <div className="products-container">
            <h2>Productos</h2>
            <div className="products-grid">
                {productsToShow.length > 0 ? (
                    productsToShow.map((product) => (
                        <ProductCard 
                            key={product.id} // Asegúrate de que `id` sea único para cada producto
                            product={product} 
                            isExpanded={expandedProductId === product.id} 
                            onExpandClick={() => handleExpandClick(product.id)} 
                        />
                    ))
                ) : (
                    <p>No hay productos disponibles.</p>
                )}
            </div>
        </div>
    );
};

export default Productos;