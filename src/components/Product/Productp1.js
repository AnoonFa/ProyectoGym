import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Product.css';

const Product = () => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/Checkout', {
      state: {
        plan: {
          title: 'Plan Mensual de Gimnasio',
          description: 'En este plan te ofrecemos nuestros servicios de máquinas, asesorías y rutinas personalizadas durante un mes',
          price: 50000
        }
      }
    });
  };

  return (
    <div>
      <Header />
      <div className="product-page">
        <div className="product-details">
          <img src={require('../../assets/images/planes5.jpg')} alt="Tiquetera práctica libre gimnasio" className="product-image" />
          <div className="product-info">
            <h1>Plan Mensual de Gimnasio</h1>
            <p>En este plan te ofrecemos nuestros servicios de máquinas, asesorías y rutinas personalizadas durante un mes</p>
            <p className="price">Desde <strong>$50.000</strong></p>
            <p className="note"> No se realizan reembolsos.</p>
            <button className="cta-button" onClick={handleCheckout}>Comprar</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Product;
