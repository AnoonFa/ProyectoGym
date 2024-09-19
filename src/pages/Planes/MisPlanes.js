import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/RoleContext'; // Para obtener el usuario autenticado
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './MisPlanes.css'; // Asegúrate de tener un archivo CSS para estilos

const MisPlanes = () => {
  const { user } = useAuth(); // Obtener el usuario autenticado
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
      fetchUserPlans(); // Solo obtenemos los planes si el usuario está autenticado
    }
  }, [user]);

  // Función para cargar la imagen local con require basado en el plan
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
          return require('../../assets/images/planes5.jpg'); // Imagen por defecto
      }
    } catch (error) {
      console.error('Error cargando la imagen:', error);
      return require('../../assets/images/planes5.jpg'); // Imagen predeterminada en caso de error
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
                {/* Cargar la imagen con require basado en el id del plan */}
                <img src={loadImage(plan.id)} alt={plan.name} className="plan-image" />
                <div className="plan-info">
                  <h2>{plan.name}</h2>
                  <p>{plan.description}</p>
                  <p className="price"><strong>Precio:</strong> ${plan.price}</p>
                  <p className="duration"><strong>Duración:</strong> {plan.duration}</p>
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
