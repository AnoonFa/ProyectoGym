import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RutinaAdminIndex.css';

const EjerciciosCliente = ({ cliente }) => {
  const navigate = useNavigate();
  const [rutina, setRutina] = useState([]);
  const [clienteData, setClienteData] = useState(null);
  const [error, setError] = useState(null);

  // Definición de rutinasIniciales
  const rutinasIniciales = {
    Endomorfo: [
        { nombre: 'Sentadillas', series: 3, repeticiones: 12, descanso: 60 },
        { nombre: 'Flexiones', series: 3, repeticiones: 15, descanso: 45 },
        { nombre: 'Fondos en paralelas', series: 3, repeticiones: 10, descanso: 60 },
        { nombre: 'Remo con mancuerna', series: 3, repeticiones: 12, descanso: 60 },
        { nombre: 'Fondos en paralelas con peso', series: 3, repeticiones: 10, descanso: 60 },
        { nombre: 'Remo con mancuerna a una mano', series: 3, repeticiones: 12, descanso: 60 },
        { nombre: 'Elevaciones laterales con mancuerna', series: 3, repeticiones: 12, descanso: 30 },
        { nombre: 'Sentadillas frontales', series: 3, repeticiones: 12, descanso: 60 },
        { nombre: 'Flexiones con pies elevados', series: 3, repeticiones: 15, descanso: 45 },
        { nombre: 'Fondos en paralelas con peso', series: 3, repeticiones: 10, descanso: 60 },
        { nombre: 'Remo con mancuerna a una mano', series: 3, repeticiones: 12, descanso: 60 }
      ],
      Mesomorfo: [
        { nombre: 'Peso muerto', series: 3, repeticiones: 5, descanso: 90 },
        { nombre: 'Press de banca inclinado', series: 3, repeticiones: 8, descanso: 90 },
        { nombre: 'Dominadas', series: 'Máximo de repeticiones', repeticiones: null, descanso: 120 },
        { nombre: 'Remo con barra', series: 3, repeticiones: 10, descanso: 60 },
        { nombre: 'Peso muerto rumano', series: 3, repeticiones: 8, descanso: 90 },
        { nombre: 'Press de banca declinado', series: 3, repeticiones: 8, descanso: 90 },
        { nombre: 'Dominadas con agarre ancho', series: 'Máximo de repeticiones', repeticiones: null, descanso: 120 },
        { nombre: 'Remo con barra T', series: 3, repeticiones: 10, descanso: 60 },
        { nombre: 'Peso muerto sumo', series: 3, repeticiones: 6, descanso: 90 },
        { nombre: 'Press de banca cerrado', series: 3, repeticiones: 12, descanso: 90 },
        { nombre: 'Dominadas con agarre estrecho', series: 'Máximo de repeticiones', repeticiones: null, descanso: 120 },
        { nombre: 'Remo con barra con agarre invertido', series: 3, repeticiones: 10, descanso: 60 },
        { nombre: 'Peso muerto convencional', series: 3, repeticiones: 5, descanso: 90 },
        { nombre: 'Press de banca inclinado', series: 3, repeticiones: 8, descanso: 90 },
        { nombre: 'Dominadas con peso añadido', series: 'Máximo de repeticiones', repeticiones: null, descanso: 120 },
        { nombre: 'Remo con barra con agarre ancho', series: 3, repeticiones: 10, descanso: 60 }
      ],
      Ectomorfo: [
        { nombre: 'Elevaciones laterales', series: 3, repeticiones: 12, descanso: 30 },
        { nombre: 'Curl de bíceps con barra Z', series: 3, repeticiones: 15, descanso: 30 },
        { nombre: 'Press francés con mancuernas', series: 3, repeticiones: 12, descanso: 30 },
        { nombre: 'Zancadas bulgaras', series: 3, repeticiones: 15, descanso: 30 },
        { nombre: 'Elevaciones laterales con banda elástica', series: 3, repeticiones: 15, descanso: 30 },
        { nombre: 'Curl de bíceps con martillo', series: 3, repeticiones: 12, descanso: 30 },
        { nombre: 'Press francés con barra', series: 3, repeticiones: 12, descanso: 30 },
        { nombre: 'Zancadas con peso', series: 3, repeticiones: 12, descanso: 30 },
        { nombre: 'Elevaciones laterales con mancuerna', series: 3, repeticiones: 12, descanso: 30 },
        { nombre: 'Curl de bíceps con barra W', series: 3, repeticiones: 15, descanso: 30 },
        { nombre: 'Press francés con mancuerna', series: 3, repeticiones: 12, descanso: 30 },
        { nombre: 'Zancadas con salto', series: 3, repeticiones: 10, descanso: 30 }
      ]
    };

  useEffect(() => {
    if (cliente && cliente.id) {
      fetch(`http://localhost:3001/client/${cliente.id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('No se pudo obtener los datos del cliente');
          }
          return response.json();
        })
        .then(data => {
          setClienteData(data);
          if (data.rutinas) {
            setRutina(JSON.parse(data.rutinas));
          } else if (data.tipoCuerpo && rutinasIniciales[data.tipoCuerpo]) {
            setRutina(rutinasIniciales[data.tipoCuerpo]);
          } else {
            setError('No se encontró una rutina para este tipo de cuerpo');
          }
        })
        .catch(error => {
          console.error('Error al obtener los datos del cliente:', error);
          setError(error.message);
        });
    }
  }, [cliente]);

  const handleInputChange = (index, field, value) => {
    const newRutina = [...rutina];
    newRutina[index] = { ...newRutina[index], [field]: value };
    setRutina(newRutina);
  };

  const handleActualizar = () => {
    if (clienteData) {
      const updatedClienteData = {
        ...clienteData,
        rutinas: JSON.stringify(rutina)
      };

      fetch(`http://localhost:3001/client/${clienteData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedClienteData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo actualizar la rutina');
        }
        return response.json();
      })
      .then(data => {
        console.log('Rutina actualizada con éxito:', data);
        alert('Rutina actualizada con éxito'); // Agregar alert aquí
        navigate('/adminEmpleadoIndex');
      })
      .catch(error => {
        console.error('Error al actualizar la rutina:', error);
        setError(error.message);
      });
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="ejercicios-cliente">
      <h2>Rutina de {cliente.nombre}</h2>
      <div className="ejercicios-list">
        {rutina.map((ejercicio, index) => (
          <div key={index} className="ejercicio-card">
            <div className="televisor-screen"></div>
            <div className="ejercicio-info">
              <h3>{ejercicio.nombre}</h3>
              <div className="input-container">
                <label>Series:</label>
                {ejercicio.series === 'Máximo de repeticiones' ? (
                  <span>{ejercicio.series}</span>
                ) : (
                  <input
                    type="number"
                    value={ejercicio.series}
                    onChange={(e) => handleInputChange(index, 'series', e.target.value)}
                  />
                )}
              </div>
              {ejercicio.series !== 'Máximo de repeticiones' && (
                <div className="input-container">
                  <label>Repeticiones:</label>
                  <input
                    type="number"
                    value={ejercicio.repeticiones || ''}
                    onChange={(e) => handleInputChange(index, 'repeticiones', e.target.value)}
                  />
                </div>
              )}
              <div className="input-container">
                <label>Descanso (s):</label>
                <input
                  type="number"
                  value={ejercicio.descanso}
                  onChange={(e) => handleInputChange(index, 'descanso', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="actualizar-btn" onClick={handleActualizar}>Actualizar</button>
    </div>
  );
};

export default EjerciciosCliente;