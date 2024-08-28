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

  const handleTicketera1Select = (ticketera) => {
    navigate('/ProductT1', {
      state: {
        purchaseType: 'ticketera',
        selectedPlan: ticketera,  // Usamos selectedPlan para reutilizar lógica
        ticketCount: 1,  // Si tienes un conteo específico, pásalo aquí
      }
    });
  };

  const handleTicketera2Select = (ticketera) => {
    navigate('/ProductT2', {
      state: {
        purchaseType: 'ticketera',
        selectedPlan: ticketera,  // Usamos selectedPlan para reutilizar lógica
        ticketCount: 1,  // Si tienes un conteo específico, pásalo aquí
      }
    });
  };

  const handleTicketera3Select = (ticketera) => {
    navigate('/ProductT3', {
      state: {
        purchaseType: 'ticketera',
        selectedPlan: ticketera,  // Usamos selectedPlan para reutilizar lógica
        ticketCount: 1,  // Si tienes un conteo específico, pásalo aquí
      }
    });
  };

  const handleTicketera4Select = (ticketera) => {
    navigate('/ProductT4', {
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
            price={50000}
            onClick={() => handleTicketera1Select({
              name: 'Ticketera 1',
              description: 'El plan más completo para alcanzar tus objetivos con prácticas libres y clases grupales.',
              price: 50000
            })}
          />
          <PlanCard
            image={planes2}
            title="Ticketera 2"
            price={130000}
            onClick={() => handleTicketera2Select({
              name: 'Ticketera 2',
              description: '11 prácticas libres en nuestros gimnasios para que puedas entrenar con la flexibilidad que necesites.',
              price: 130000
            })}
          />
          <PlanCard
            image={planes3}
            title="Ticketera 3"
            price={280000}
            onClick={() => handleTicketera3Select({
              name: 'Ticketera 3',
              description: 'Ejercítate junto a tu partner y logren juntos la meta esperada.',
              price: 280000
            })}
          />
          <PlanCard
            image={planes4}
            title="Ticketera 4"
            price={550000}
            onClick={() => handleTicketera4Select({
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
