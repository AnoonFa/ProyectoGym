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
      <div className="ejercicios-cliente-cliente">
        <h2>Mi rutina</h2>
        <div className="ejercicios-list-cliente">
          {rutina.length > 0 ? (
            rutina.map((ejercicio, index) => (
              <div key={index} className="ejercicio-card-cliente">
                <div className="televisor-screen-cliente"></div>
                <div className="ejercicio-info-cliente">
                  <h3>{ejercicio.nombre}</h3>
                  <div className="input-container-cliente">
                    <label>Series:</label>
                    {ejercicio.series === 'Máximo de repeticiones' ? (
                      <span>{ejercicio.series}</span>
                    ) : (
                      <input
                        type="number"
                        id={`series-${index}`}
                        name={`series-${index}`}
                        value={ejercicio.series}
                        readOnly
                        style={{
                          border: 'none',
                          outline: 'none',
                          backgroundColor: 'transparent',
                          marginLeft: '50px'
                        }}
                      />
                    )}
                  </div>
                  {ejercicio.series !== 'Máximo de repeticiones' && (
                    <div className="input-container-cliente">
                      <label>Repeticiones:</label>
                      <input
                        type="number"
                        id={`repeticiones-${index}`}
                        name={`repeticiones-${index}`}
                        value={ejercicio.repeticiones || ''}
                        readOnly
                        style={{
                          border: 'none',
                          outline: 'none',
                          backgroundColor: 'transparent'
                        }}
                      />
                    </div>
                  )}
                  <div className="input-container-cliente">
                    <label>Descanso (s):</label>
                    <input
                      type="number"
                      id={`descanso-${index}`}
                      name={`descanso-${index}`}
                      value={ejercicio.descanso}
                      readOnly
                      style={{
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className='nose'>No se encontraron ejercicios en tu rutina.</p>
          )}
        </div>
        <button className="return-btn-cliente" onClick={handleVolver}>Volver</button>
      </div>
      <Footer />
    </>
  );
};

export default RutinasCliente;
