import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/RoleContext';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './MisPlanes.css';
import { format, add } from 'date-fns';

const MisPlanes = () => {
  const { user } = useAuth();
  const [planes, setPlanes] = useState([]);

  useEffect(() => {
    const fetchUserPlans = async () => {
      try {
        const response = await fetch(`http://localhost:3001/client/${user.id}`);
        const data = await response.json();

        if (data.planes) {
          setPlanes(data.planes);
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

  // Calcula la fecha de expiración del plan
  const calculateEndDate = (startDate, duration) => {
    const parsedStartDate = new Date(startDate);
    if (isNaN(parsedStartDate)) {
      console.error("Fecha de inicio inválida:", startDate);
      return 'Fecha de expiración desconocida';
    }

    switch (duration) {
      case '1 mes':
        return format(add(parsedStartDate, { months: 1 }), 'dd/MM/yyyy');
      case '3 meses':
        return format(add(parsedStartDate, { months: 3 }), 'dd/MM/yyyy');
      case '6 meses':
        return format(add(parsedStartDate, { months: 6 }), 'dd/MM/yyyy');
      case '1 año':
        return format(add(parsedStartDate, { years: 1 }), 'dd/MM/yyyy');
      default:
        return 'Fecha de expiración desconocida';
    }
  };

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
                  <p><strong>Fecha de expiración:</strong> {calculateEndDate(plan.startDate, plan.duration)}</p>
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
