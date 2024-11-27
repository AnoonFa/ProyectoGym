import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/RoleContext';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Ticketera.css';
import Alert from '@mui/material/Alert';
import Relleno from '../Relleno/Relleno';

function VerTicketera() {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(12000);
  const [userName, setUserName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [availableTickets, setAvailableTickets] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    fetchUserInfo();
    fetchAvailableTickets();
  }, [user.id]); // Add dependency on user.id

  useEffect(() => {
    setPrice(12000 * quantity);
  }, [quantity]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`http://localhost:3005/client/${user.id}`);
      if (!response.ok) {
        throw new Error('Error fetching user info');
      }
      const data = await response.json();
      
      if (data.nombre && data.apellido) {
        setUserName(`${data.nombre} ${data.apellido}`);
      } else {
        console.error('Nombre o apellido faltantes en los datos');
        setUserName('Nombre no disponible');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      setAlertMessage('Error al cargar la información del usuario');
      setAlertSeverity('error');
      setShowAlert(true);
    }
  };

  const fetchAvailableTickets = async () => {
    try {
      const response = await fetch(`http://localhost:3005/client/${user.id}`);
      if (!response.ok) {
        throw new Error('Error fetching tickets');
      }
      const data = await response.json();
      setAvailableTickets(data.tickets || 0);
    } catch (error) {
      console.error('Error fetching available tickets:', error);
    }
  };

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleBuy = (e) => {
    e.preventDefault();
    setOpenModal(true);
  };

  const handleConfirmPurchase = async () => {
    try {
      const purchaseData = {
        clientId: user.id,
        nombre: userName,
        quantity: quantity,
        totalPrice: price,
        status: 'No Pagado'
      };
  
      const response = await fetch('http://localhost:3005/ticketera', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      });
  
      if (response.ok) {
        const data = await response.json();
        setOpenModal(false);
        setAlertMessage('Tickets comprados exitosamente. Por favor, pague en el gimnasio para confirmar su compra.');
        setAlertSeverity('success');
        setShowAlert(true);
        setQuantity(1);
        setPrice(12000);
        
        // Actualizar los tickets disponibles
        fetchAvailableTickets();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrar la compra');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setAlertMessage('Error al procesar la compra. Por favor, intente nuevamente.');
      setAlertSeverity('error');
      setShowAlert(true);
    }
  };

  const handleCancelPurchase = () => {
    setOpenModal(false);
    setQuantity(1);
    setPrice(12000);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <>  
      <Header />
      <Relleno/>
      <div className="ver-ticketera-container">
        <div className="ver-ticketera-grid">
          <div className="ver-ticketera-tickets">
            <h2 className="ver-ticketera-title">Mis Tickets</h2>
            <p className="ver-ticketera-text">Tienes {availableTickets} tickets disponibles</p>
          </div>

          <div className="ver-ticketera-compra">
            <h2 className="ver-ticketera-title ver-ticketera-center">Comprar Tickets</h2>
            <form className="ver-ticketera-form" onSubmit={handleBuy}>
              <div>
                <label htmlFor="name" className="ver-ticketera-label">Nombre</label>
                <input id="name" value={userName} readOnly className="ver-ticketera-input" />
              </div>
              <div>
                <label htmlFor="quantity" className="ver-ticketera-label">Cantidad</label>
                <div className="ver-ticketera-quantity">
                  <button 
                    type="button" 
                    onClick={handleDecrement} 
                    className="ver-ticketera-button"
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="ver-ticketera-input ver-ticketera-input-number"
                  />
                  <button 
                    type="button" 
                    onClick={handleIncrement} 
                    className="ver-ticketera-button"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="price" className="ver-ticketera-label">Precio</label>
                <input id="price" value={`$${price}`} readOnly className="ver-ticketera-input" />
              </div>
              <button type="submit" className="ver-ticketera-submit">Comprar</button>
            </form>
          </div>
        </div>
      </div>

      {openModal && (
        <div className={`modal-Ticket ${openModal ? '' : 'exiting'}`}>
          <div className="modal-content-Ticket">
            <h2>Confirmación de compra</h2>
            <p>
              ¿Estás seguro de comprar {quantity} tickets por un total de ${price}?
              Recuerda pagar en el gimnasio dentro de un plazo de 1 día.
            </p>
            <div className="modal-buttons">
              <button className="cancel-button" onClick={handleCancelPurchase}>Cancelar</button>
              <button className="confirm-button" onClick={handleConfirmPurchase}>Comprar</button>
            </div>
          </div>
        </div>
      )}

      {showAlert && (
        <Alert 
          severity={alertSeverity}
          className="alert-Ticket"
          action={
            <button className="alert-close-button" onClick={handleCloseAlert}>
              &times;
            </button>
          }
        >
          {alertMessage}
        </Alert>
      )}

      <Footer />
    </>
  );
}

export default VerTicketera;