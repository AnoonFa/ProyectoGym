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

  const handlePlanSelect = (plan) => {
    navigate('/checkout', {
      state: {
        purchaseType: 'plan',
        selectedPlan: plan
      }
    });
  };

  return (
    <div>

      <div className="plans-container">
        <h1>Planes</h1>
        <div className="plans-grid">
          <PlanCard
            image={planes1}
            title="Mensualidad"
            description="El plan más completo para alcanzar tus objetivos con prácticas libres y clases grupales."
            price={50000}
            onClick={() => handlePlanSelect({
              name: 'Mensualidad',
              description: 'El plan más completo para alcanzar tus objetivos con prácticas libres y clases grupales.',
              price: 50000,
              duration: 1 // Duración en meses
            })}
          />
          <PlanCard
            image={planes2}
            title="Trimestre"
            description="11 prácticas libres en nuestros gimnasios para que puedas entrenar con la flexibilidad que necesites."
            price={130000}
            onClick={() => handlePlanSelect({
              name: 'Trimestre',
              description: '11 prácticas libres en nuestros gimnasios para que puedas entrenar con la flexibilidad que necesites.',
              price: 130000,
              duration: 3
            })}
          />
          <PlanCard
            image={planes3}
            title="Semestre"
            description="Ejercítate junto a tu partner y logren juntos la meta esperada."
            price={280000}
            onClick={() => handlePlanSelect({
              name: 'Semestre',
              description: 'Ejercítate junto a tu partner y logren juntos la meta esperada.',
              price: 280000,
              duration: 6
            })}
          />
          <PlanCard
            image={planes4}
            title="Año"
            description="El plan más completo para alcanzar tus objetivos con prácticas libres y clases grupales."
            price={550000}
            onClick={() => handlePlanSelect({
              name: 'Año',
              description: 'El plan más completo para alcanzar tus objetivos con prácticas libres y clases grupales.',
              price: 550000,
              duration: 12
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default Planes;
