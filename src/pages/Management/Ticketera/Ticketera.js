import React from 'react';
import Header from '../../../components/Header/Header';
import PlanCard from '../../../components/PlanCard/PlanCard';
import Footer from '../../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import './Ticketera.css';
import planes1 from '../../../assets/images/planes1.jpg';
import planes2 from '../../../assets/images/planes2.jpg';
import planes3 from '../../../assets/images/planes3.jpg';
import planes4 from '../../../assets/images/planes4.jpg';

const Ticketera = () => {
  const navigate = useNavigate();

  const handleTicketeraSelect = (ticketera) => {
    navigate('/checkout', {
      state: {
        purchaseType: 'ticketera',
        selectedPlan: ticketera,  // Usamos selectedPlan para reutilizar lógica
        ticketCount: 1,  // Si tienes un conteo específico, pásalo aquí
      }
    });
  };

  return (
    <div>
      <Header />
      <div className="plans-container">
        <h1>Ticketeras</h1>
        <div className="plans-grid">
          <PlanCard
            image={planes1}
            title="Ticketera 1"
            description="El plan más completo para alcanzar tus objetivos con prácticas libres y clases grupales."
            price={50000}
            onClick={() => handleTicketeraSelect({
              name: 'Ticketera 1',
              description: 'El plan más completo para alcanzar tus objetivos con prácticas libres y clases grupales.',
              price: 50000
            })}
          />
          <PlanCard
            image={planes2}
            title="Ticketera 2"
            description="11 prácticas libres en nuestros gimnasios para que puedas entrenar con la flexibilidad que necesites."
            price={130000}
            onClick={() => handleTicketeraSelect({
              name: 'Ticketera 2',
              description: '11 prácticas libres en nuestros gimnasios para que puedas entrenar con la flexibilidad que necesites.',
              price: 130000
            })}
          />
          <PlanCard
            image={planes3}
            title="Ticketera 3"
            description="Ejercítate junto a tu partner y logren juntos la meta esperada."
            price={280000}
            onClick={() => handleTicketeraSelect({
              name: 'Ticketera 3',
              description: 'Ejercítate junto a tu partner y logren juntos la meta esperada.',
              price: 280000
            })}
          />
          <PlanCard
            image={planes4}
            title="Ticketera 4"
            description="El plan más completo para alcanzar tus objetivos con prácticas libres y clases grupales."
            price={550000}
            onClick={() => handleTicketeraSelect({
              name: 'Ticketera 4',
              description: 'El plan más completo para alcanzar tus objetivos con prácticas libres y clases grupales.',
              price: 550000
            })}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Ticketera;
