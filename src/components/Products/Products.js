import React from "react";
import "./Products.css";
import image1 from "../../assets/images/conjunto-vector-coleccion-ropa-deportiva_18591-19994.avif";
import image2 from "../../assets/images/B09J2LB8SZ.jpg";
import image3 from "../../assets/images/images (1).jfif";
import image4 from "../../assets/images/images (2).jfif";

const products = [
    { name: "Ropa deportiva", image: image1 },
    { name: "Guantes", image: image2 },
    { name: "Botellas de agua", image: image3 },
    { name: "Proteínas en polvo", image: image4 },
];

function Products() {
    return (
        <div className="products-container">
            <h2>Explora Nuestros Productos</h2>
            <div className="products-grid">
                {products.map((product, index) => (
                    <div key={index} className="product-card">
                        <img src={product.image} alt={product.name} className="product-image" />
                        <div className="product-name">{product.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;

