import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Product.css';
import { useAuth } from '../../context/RoleContext';
import { Alert } from '@mui/material';

const Productp1 = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [price, setPrice] = useState(0);
  const [userName, setUserName] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(`http://localhost:3005/planes/${planId}`);
        if (!response.ok) {
          throw new Error('Error al obtener los datos del plan');
        }
        const data = await response.json();
        setPlan(data);
        setPrice(data.price);
      } catch (error) {
        console.error('Error fetching plan data:', error);
      }
    };

    fetchPlan();
  }, [planId]);

  useEffect(() => {
    if (user) {
      setUserName(`${user.nombre} ${user.apellido}`);
    }
  }, [user]);

  const handleCheckout = (e) => {
    e.preventDefault();
    setOpenModal(true);
  };

  const handleConfirmPurchase = async () => {
    try {
      const clientResponse = await fetch(`http://localhost:3001/client/${user.id}`);
      const clientData = await clientResponse.json();
  
      const startDate = new Date().toISOString(); // Fecha de inicio en formato ISO
  
      const newPlan = {
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        duration: plan.duration || '1 mes',
        image: plan.image,
        startDate // Agregamos la fecha de inicio
      };
  
      const updatedClient = {
        ...clientData,
        planes: [...clientData.planes, newPlan]
      };
  
      const updateResponse = await fetch(`http://localhost:3001/client/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedClient)
      });
  
      if (updateResponse.ok) {
        setOpenModal(false);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          navigate('/MisPlanes');
        }, 3000);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };
  

  const loadImage = (imagePath) => {
    try {
      return require(`../../assets/images/${imagePath}`);
    } catch (error) {
      return require('../../assets/images/planes5.jpg');
    }
  };

  if (!plan) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <Header />
      {showAlert && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
          <Alert severity="success" onClose={() => setShowAlert(false)}>
            Compra realizada con éxito. Por favor, paga en el gimnasio para confirmar.
          </Alert>
        </div>
      )}
      <div className="product-page">
        <div className="product-details">
          <img src={loadImage(plan.image)} alt={plan.name} className="product-image" />
          <div className="product-info">
            <h1>{plan.name}</h1>
            <p>{plan.description}</p>
            <h2>Beneficios Incluidos:</h2>
            <ul>
              {plan.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
            <p className="price">Desde <strong>${price}</strong></p>
            <p className="note"> No se realizan reembolsos.</p>
            <button className="cta-button" onClick={handleCheckout}>Comprar</button>
          </div>
        </div>
      </div>

      {openModal && (
        <div className={`modal-Ticket ${openModal ? '' : 'exiting'}`}>
          <div className="modal-content-Ticket">
            <h2>Confirmación de compra</h2>
            <p>
              ¿Estás seguro de comprar este plan por un total de ${price}?
              Recuerda pagar en el gimnasio dentro de un plazo de 1 día.
            </p>
            <div className="modal-buttons">
              <button className="cancel-button" onClick={() => setOpenModal(false)}>Cancelar</button>
              <button className="confirm-button" onClick={handleConfirmPurchase}>Comprar</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Productp1;
