import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/RoleContext';
import { useNavigate } from 'react-router-dom';
import './RutinaAdminIndex.css';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import EjercicioModal from './Modal/EjercicioModal';

const RutinasCliente = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rutina, setRutina] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEjercicio, setSelectedEjercicio] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:3001/client/${user.id}`)
        .then(response => response.json())
        .then(data => {
          console.log("Rutina obtenida:", data); // Agregar log para verificar los datos
          const rutinasParsed = data.rutinas ? JSON.parse(data.rutinas) : [];
          setRutina(rutinasParsed);
        })
        .catch(error => {
          console.error('Error al obtener la rutina del cliente:', error);
        });
    }
  }, [user]);

  const handleVolver = () => {
    navigate('/ClienteIndex');
  };

  const openModal = (ejercicio) => {
    setSelectedEjercicio(ejercicio);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEjercicio(null);
  };

  return (
    <>
      <Header />
      <div className="container">
        <h1 className="title">Mi rutina</h1>
        <div className="exercise-grid">
          {rutina.length > 0 ? (
            rutina.map((ejercicio, index) => (
              <div key={index} className="exercise-card" onClick={() => openModal(ejercicio)}>
                <img
                  src={`ProyectoGym/src/assets/images/Ejercicios/${ejercicio.nombre.replace(/\s+/g, '_').toLowerCase()}.jpg`}
                  alt={ejercicio.nombre}
                  className="exercise-image"
                />
                <h2 className="exercise-title">{ejercicio.nombre}</h2>
              </div>
            ))
          ) : (
            <p className='no-exercises'>No se encontraron ejercicios en tu rutina.</p>
          )}
        </div>
        <button className="retuarn-btn-cliente" onClick={handleVolver}>Volver</button>
      </div>
      {modalOpen && selectedEjercicio && (
        <EjercicioModal
          ejercicio={selectedEjercicio}
          tipoCuerpo={user.tipoCuerpo}  // Pasa el tipo de cuerpo del usuario
          onClose={closeModal}
        />
      )}
      <Footer />
    </>
  );
};

export default RutinasCliente;
