import React, { useEffect, useState } from 'react';
import './PlanCard.css';
import { Snackbar, Alert } from '@mui/material'; // Importamos Snackbar y Alert de MUI
import { useAuth } from '../../context/RoleContext'; // Asumimos que tienes un contexto de autenticación

const PlanCard = ({ image, title, description, price, onClick }) => {
  const { user } = useAuth(); // Obtenemos el usuario autenticado desde el contexto
  const [hasActivePlan, setHasActivePlan] = useState(false); // Estado para verificar si el cliente ya tiene un plan
  const [openAlert, setOpenAlert] = useState(false); // Estado para mostrar el Snackbar

  // Este efecto comprueba si el cliente ya tiene un plan registrado en la base de datos
  useEffect(() => {
    const fetchClientPlans = async () => {
      try {
        const response = await fetch(`http://localhost:3005/client/${user.id}`);
        const clientData = await response.json();

        // Verificamos si el cliente tiene planes activos
        if (clientData.planes && clientData.planes.length > 0) {
          setHasActivePlan(true); // El cliente ya tiene un plan registrado
        }
      } catch (error) {
        console.error('Error fetching client plans:', error);
      }
    };

    fetchClientPlans();
  }, [user]);

  const handleClick = () => {
    // Si el cliente ya tiene un plan, mostramos la alerta
    if (hasActivePlan) {
      setOpenAlert(true); // Mostrar alerta de MUI
    } else {
      // Si no tiene plan, ejecutamos la función onClick pasada como prop
      onClick();
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false); // Cerrar la alerta de MUI
  };

  return (
    <div className="plan-card">
      <img src={image} alt={title} className="plan-image" />
      <h2>{title}</h2>
      <p>{description}</p>
      <p>Desde <strong>${price}</strong></p>
      <button onClick={handleClick} className="buy-link">Comprar</button>

      {/* Snackbar para mostrar la alerta cuando ya tiene un plan activo */}
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="warning">
          Ya tienes un plan asignado, para adquirir uno nuevo tienes que esperar a que se venza el actual.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PlanCard;
