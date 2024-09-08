import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/RoleContext';
import { useNavigate } from 'react-router-dom';
import './RutinaAdminIndex.css';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

const RutinasCliente = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rutina, setRutina] = useState([]);

  useEffect(() => {
    console.log('useEffect se ejecuta');
    console.log('Valor de user en useEffect:', user);
    if (user && user.id) {
      console.log('Usuario tiene ID:', user.id);
      fetch(`http://localhost:3001/client/${user.id}`)
        .then(response => {
          console.log('Response status:', response.status);
          return response.json();
        })
        .then(data => {
          try {
            const rutinasParsed = data.rutinas ? JSON.parse(data.rutinas) : [];
            console.log('Rutinas parseadas:', rutinasParsed);
            setRutina(rutinasParsed);
          } catch (error) {
            console.error('Error al parsear rutinas:', error);
          }
        })
        .catch(error => {
          console.error('Error al obtener la rutina del cliente:', error);
        });
    } else {
      console.log('Usuario no está definido o no tiene ID');
    }
  }, [user]);

  const handleVolver = () => {
    navigate('/ClienteIndex');
  };

  return (
    <>
      <Header />
      <div className="container">
      <h1 className="title">Mi rutina</h1>
      <div className="grid">
        {rutina.length > 0 ? (
          rutina.map((ejercicio, index) => (
            <div key={index} className="card">
              <img
                aria-hidden="true"
                alt={ejercicio.nombre}
                src={`https://openui.fly.dev/openui/150x150.svg?text=${encodeURIComponent(ejercicio.nombre)}`}
                className="card-image"
              />
              <h2 className="card-title">{ejercicio.nombre}</h2>
              <p className="card-detail">Series: {ejercicio.series}</p>
              {ejercicio.series !== 'Máximo de repeticiones' && (
                <p className="card-detail">Repeticiones: {ejercicio.repeticiones || '-'}</p>
              )}
              <p className="card-detail">Descanso (s): {ejercicio.descanso}</p>
            </div>
          ))
        ) : (
          <p className='no-exercises'>No se encontraron ejercicios en tu rutina.</p>
        )}
      </div>
      <button className="return-btn" onClick={handleVolver}>Volver</button>
    </div>
      <Footer />
    </>
  );
};

export default RutinasCliente;
