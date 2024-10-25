import React from 'react';
import './Product.css';

const ProductPage = () => {
    return (
        <div className="product-page">
            <div className="breadcrumb">
                <a href="/">Inicio</a> / <a href="/tiqueteras">Tiqueteras</a> / Tiquetera práctica libre gimnasio
            </div>
            <div className="product-details">
                <img src="/product-image.jpg" alt="Tiquetera práctica libre gimnasio" className="product-image" />
                <div className="product-info">
                    <h1>Tiquetera práctica libre gimnasio</h1>
                    <p>Entrena y sé todo lo imparable que quieras con tu tiquetera.</p>
                    <p className="price">Desde <strong>$72.000</strong></p>
                    <p className="note">* Estos precios son de referencia y pueden variar dependiendo la modalidad del servicio, número de horas, sedes y horarios.</p>
                    <button className="cta-button">Selecciona la opción de tu preferencia</button>
                </div>
            </div>
        </div>
    );
}

export default ProductPage;
