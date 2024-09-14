import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/RoleContext';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Ticketera.css';
import Alert from '@mui/material/Alert';

function VerTicketera() {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(12000);
  const [userName, setUserName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [availableTickets, setAvailableTickets] = useState(0);

  useEffect(() => {
    fetchUserInfo();
    fetchAvailableTickets();
  }, []);

  useEffect(() => {
    setPrice(12000 * quantity);
  }, [quantity]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`http://localhost:3001/${user.role}/${user.id}`);
      const data = await response.json();
      
      // Debug para ver los datos devueltos por la API
      console.log('Datos de usuario:', data);
      
      // Verifica si nombre y apellido existen, si no, muestra un error.
      if (data.nombre && data.apellido) {
        setUserName(`${data.nombre} ${data.apellido}`);
      } else {
        console.error('Nombre o apellido faltantes en los datos devueltos por la API.');
        setUserName('Nombre no disponible');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
};

  const fetchAvailableTickets = async () => {
    try {
      const response = await fetch(`http://localhost:3001/${user.role}/${user.id}`);
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
      const currentDate = new Date();
      const purchaseData = {
        clientId: user.id,
        nombre: userName,  // Aquí usamos la variable userName
        quantity: quantity,
        totalPrice: price,
        date: currentDate.toISOString().split('T')[0],
        time: currentDate.toTimeString().split(' ')[0],
        status: 'No Pagado'
      };
  
      const response = await fetch('http://localhost:3001/ticketera', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setOpenModal(false);
        setShowAlert(true);
        setQuantity(1);
        setPrice(12000);
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        const errorData = await response.json();
        console.error('Error al registrar la compra de tickets:', errorData);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
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
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
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
          severity="success" 
          className="alert-Ticket"
          action={
            <button className="alert-close-button" onClick={handleCloseAlert}>
              &times;
            </button>
          }
        >
          Tickets comprados exitosamente. Por favor, pague en el gimnasio para confirmar su compra.
        </Alert>
      )}

      <Footer />
    </>
  );
}

export default VerTicketera;