import React from 'react';
import Header from '../../components/Header/Header';
import PlanCard from '../../components/PlanCard/PlanCard';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import './Planes.css';
import planes1 from '../../assets/images/planes1.jpg';
import planes2 from '../../assets/images/planes2.jpg';
import planes3 from '../../assets/images/planes3.jpg';
import planes4 from '../../assets/images/planes4.jpg';

const Planes = () => {
  const navigate = useNavigate();

  // Función para navegar al plan seleccionado
  const handlePlanSelect = (planId) => {
    navigate(`/Productp1/${planId}`);
  };

  return (
    <div>
      <Header /> {/* Asegúrate de tener este componente implementado */}
      <div className="plans-container">
        <button 
          className="mis-planes-button" 
          onClick={() => navigate('/MisPlanes')}
        >
          Mis Planes
        </button>
        
        <h1>Planes</h1>
        
        <div className="plans-grid">
          {/* Cada plan tiene una tarjeta con un ID único y descripción */}
          <PlanCard
            image={planes1}
            title="Mensualidad"
            price={50000}
            onClick={() => handlePlanSelect('p1')} // ID 'p1'
          />
          <PlanCard
            image={planes2}
            title="Trimestre"
            price={130000}
            onClick={() => handlePlanSelect('p2')} // ID 'p2'
          />
          <PlanCard
            image={planes3}
            title="Semestre"
            price={280000}
            onClick={() => handlePlanSelect('p3')} // ID 'p3'
          />
          <PlanCard
            image={planes4}
            title="Año"
            price={550000}
            onClick={() => handlePlanSelect('p4')} // ID 'p4'
          />
        </div>
      </div>
    </div>
  );
};

export default Planes;
