import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import PlanCard from '../../components/PlanCard/PlanCard';
import { useNavigate } from 'react-router-dom';
import './Planes.css';
import planes1 from '../../assets/images/planes1.jpg';
import planes2 from '../../assets/images/planes2.jpg';
import planes3 from '../../assets/images/planes3.jpg';
import planes4 from '../../assets/images/planes4.jpg';
import { Snackbar, Alert } from '@mui/material';
import { useAuth } from '../../context/RoleContext';

const Planes = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtén el usuario autenticado
  const [hasActivePlan, setHasActivePlan] = useState(false); // Estado para verificar si el cliente ya tiene un plan
  const [openAlert, setOpenAlert] = useState(false); // Estado para el Snackbar

  useEffect(() => {
    // Aquí deberías realizar una solicitud para verificar si el cliente tiene un plan activo.
    const fetchClientPlans = async () => {
      try {
        const response = await fetch(`http://localhost:3005/client/${user.id}`);
        const clientData = await response.json();

        // Verifica si el cliente ya tiene un plan activo
        if (clientData.planes && clientData.planes.length > 0) {
          setHasActivePlan(true); // El cliente ya tiene un plan
        }
      } catch (error) {
        console.error('Error fetching client plans:', error);
      }
    };

    fetchClientPlans();
  }, [user]);

  const handlePlanSelect = (planId) => {
    // Verifica si el cliente ya tiene un plan activo
    if (hasActivePlan) {
      setOpenAlert(true); // Muestra la alerta si ya tiene un plan activo
    } else {
      navigate(`/Productp1/${planId}`);
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false); // Cierra el Snackbar
  };

  return (
    <div>
      <Header />
      <div className="plans-container">

        {/* Mostrar botón solo si el usuario es client */}
        {user?.role === 'client' && (
          <button className="mis-planes-button" onClick={() => navigate('/MisPlanes')}>
            Mis Planes
          </button>
        )}

        <h1>Planes</h1>
        <div className="plans-grid">
          <PlanCard
            image={planes1}
            title="Mensualidad"
            price={50000}
            onClick={() => handlePlanSelect('p1')}
          />
          <PlanCard
            image={planes2}
            title="Trimestre"
            price={130000}
            onClick={() => handlePlanSelect('p2')}
          />
          <PlanCard
            image={planes3}
            title="Semestre"
            price={280000}
            onClick={() => handlePlanSelect('p3')}
          />
          <PlanCard
            image={planes4}
            title="Año"
            price={550000}
            onClick={() => handlePlanSelect('p4')}
          />
        </div>
      </div>

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

export default Planes;
