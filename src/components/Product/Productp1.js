import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';  // Asegúrate de que useParams está importado aquí
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Product.css';
import { useAuth } from '../../context/RoleContext'; // Asegúrate de tener este contexto implementado

const Product = () => {
  const { planId } = useParams(); // Extrae el ID del plan de la URL
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtiene el usuario autenticado
  const [plan, setPlan] = useState(null); // Estado para el plan seleccionado
  const [openModal, setOpenModal] = useState(false); // Control para el modal de confirmación
  const [price, setPrice] = useState(0); // Precio del plan seleccionado
  const [userName, setUserName] = useState(''); // Nombre del usuario autenticado

  // Obtener los detalles del plan desde la API
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(`http://localhost:3001/planes/${planId}`);
        if (!response.ok) {
          throw new Error('Error al obtener los datos del plan');
        }
        const data = await response.json();
        setPlan(data); // Establece los datos del plan
        setPrice(data.price); // Establece el precio del plan
      } catch (error) {
        console.error('Error fetching plan data:', error);
      }
    };
  
    fetchPlan();
  }, [planId]);

  // Establecer el nombre del usuario autenticado
  useEffect(() => {
    if (user) {
      setUserName(`${user.nombre} ${user.apellido}`);
    }
  }, [user]);

  // Lógica para abrir el modal de confirmación
  const handleCheckout = (e) => {
    e.preventDefault();
    setOpenModal(true); // Abre el modal de confirmación
  };

  // Confirmar la compra y registrar el plan en el cliente
  const handleConfirmPurchase = async () => {
    try {
      // Obtener los datos del cliente
      const clientResponse = await fetch(`http://localhost:3001/client/${user.id}`);
      const clientData = await clientResponse.json();

      // Crear el nuevo plan a añadir al cliente
      const newPlan = {
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        duration: plan.duration || '1 mes', // Puedes agregar la duración del plan
        image: plan.image,
      };

      // Actualizar los planes del cliente
      const updatedClient = {
        ...clientData,
        planes: [...clientData.planes, newPlan], // Añadir el nuevo plan
      };

      // Hacer un PUT request para actualizar el cliente en el db.json
      const updateResponse = await fetch(`http://localhost:3001/client/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedClient),
      });

      if (updateResponse.ok) {
        const data = await updateResponse.json();
        console.log('Plan añadido al cliente:', data);
        setOpenModal(false);
        alert('Compra realizada con éxito. Por favor, paga en el gimnasio para confirmar.');
        navigate('/MisPlanes'); // Redirigir a la página "Mis Planes"
      } else {
        const errorData = await updateResponse.json();
        console.error('Error al actualizar el cliente:', errorData);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  // Función para cargar la imagen usando require
  const loadImage = (imagePath) => {
    try {
      return require(`../../assets/images/${imagePath}`);
    } catch (error) {
      return require('../../assets/images/planes5.jpg'); // Imagen predeterminada si no encuentra la imagen
    }
  };

  // Mientras se está cargando el plan, mostrar un mensaje
  if (!plan) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <Header />
      <div className="product-page">
        <div className="product-details">
          {/* Cargar la imagen con require */}
          <img 
            src={loadImage(plan.image)} 
            alt={plan.name} 
            className="product-image" 
          />
          <div className="product-info">
            <h1>{plan.name}</h1>
            <p>{plan.description}</p>
            <p className="price">Desde <strong>${price}</strong></p>
            <p className="note"> No se realizan reembolsos.</p>
            <button className="cta-button" onClick={handleCheckout}>Comprar</button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
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

export default Product;
