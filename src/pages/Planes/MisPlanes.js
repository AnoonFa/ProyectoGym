import React, { useEffect, useState } from 'react'; 
import { useAuth } from '../../context/RoleContext';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './MisPlanes.css';
import { format, add } from 'date-fns';

const MisPlanes = () => {
  const { user } = useAuth();
  const [planes, setPlanes] = useState([]);

  // Calcula la fecha de expiración del plan y retorna en formato ISO y visualización
  const calculateEndDate = (startDate, duration) => {
    const parsedStartDate = new Date(startDate);

    if (isNaN(parsedStartDate)) {
      console.error("Fecha de inicio inválida:", startDate);
      return { formatted: 'Fecha de expiración desconocida', iso: null };
    }

    const durationMonths = parseInt(duration, 10);
    if (isNaN(durationMonths)) {
      console.error("Duración inválida:", duration);
      return { formatted: 'Fecha de expiración desconocida', iso: null };
    }

    // Calcular la fecha de expiración
    const endDate = add(parsedStartDate, { months: durationMonths });
    const formattedEndDate = format(endDate, 'dd/MM/yyyy');

    return {
      formatted: formattedEndDate,
      iso: endDate.toISOString(),
    };
  };

  // Actualiza la fecha de expiración en el db.json
  const updatePlanEndDate = async (planId, endDate) => {
    try {
      await fetch(`http://localhost:3005/planes/${planId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endDate }),
      });
      console.log(`Fecha de expiración actualizada para el plan ${planId}`);
    } catch (error) {
      console.error(`Error al actualizar la fecha de expiración del plan ${planId}:`, error);
    }
  };

  useEffect(() => {
    const fetchUserPlans = async () => {
      try {
        const response = await fetch(`http://localhost:3001/client/${user.id}`);
        const data = await response.json();

        if (data.planes) {
          // Actualizar endDate si no está registrado
          const updatedPlans = await Promise.all(
            data.planes.map(async (plan) => {
              const { formatted, iso } = calculateEndDate(plan.startDate, plan.duration);
              
              // Si el campo endDate está vacío, lo actualizamos
              if (!plan.endDate) {
                await updatePlanEndDate(plan.id, iso);
              }

              return { ...plan, endDate: iso, formattedEndDate: formatted };
            })
          );
          
          setPlanes(updatedPlans);
        } else {
          console.error("El usuario no tiene planes asignados.");
        }
      } catch (error) {
        console.error('Error al obtener los planes del usuario:', error);
      }
    };

    if (user) {
      fetchUserPlans();
    }
  }, [user]);

  // Cargar la imagen del plan
  const loadImage = (planId) => {
    try {
      switch (planId) {
        case 'p1':
          return require('../../assets/images/planes1.jpg');
        case 'p2':
          return require('../../assets/images/planes2.jpg');
        case 'p3':
          return require('../../assets/images/planes3.jpg');
        case 'p4':
          return require('../../assets/images/planes4.jpg');
        default:
          return require('../../assets/images/planes5.jpg');
      }
    } catch (error) {
      console.error('Error cargando la imagen:', error);
      return require('../../assets/images/planes5.jpg');
    }
  };

  return (
    <div>
      <Header />
      <div className="mis-planes-container">
        <h1>Mis Planes</h1>
        {planes.length > 0 ? (
          <div className="mis-planes-grid">
            {planes.map((plan) => (
              <div key={plan.id} className="plan-card">
                <img src={loadImage(plan.id)} alt={plan.name} className="plan-image" />
                <div className="plan-info">
                  <h2>{plan.name}</h2>
                  <p>{plan.description}</p>
                  <p className="price"><strong>Precio:</strong> ${plan.price}</p>
                  <p><strong>Fecha de expiración:</strong> {plan.formattedEndDate}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-planes-message">No tienes planes activos.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MisPlanes;
