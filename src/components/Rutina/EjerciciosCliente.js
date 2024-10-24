import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import './RutinaAdminIndex.css';

const EjerciciosCliente = ({ cliente }) => {
  const navigate = useNavigate();
  const [rutina, setRutina] = useState([]);
  const [rutinaInicial, setRutinaInicial] = useState([]);
  const [clienteData, setClienteData] = useState(null);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

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
      { nombre: 'Remo con barra T', series: 3, repeticiones: 10, descanso: 60 }
      ],
      Mesomorfo: [
      { nombre: 'Peso muerto', series: 3, repeticiones: 5, descanso: 90 },
      { nombre: 'Press de banca inclinado', series: 3, repeticiones: 8, descanso: 90 },
      { nombre: 'Dominadas', series: 'Máximo de repeticiones', repeticiones: null, descanso: 120 },
      { nombre: 'Remo con barra', series: 3, repeticiones: 10, descanso: 60 },
      { nombre: 'Peso muerto rumano', series: 3, repeticiones: 8, descanso: 90 },
      { nombre: 'Press de banca declinado', series: 3, repeticiones: 8, descanso: 90 },
      { nombre: 'Dominadas con agarre ancho', series: 'Máximo de repeticiones', repeticiones: null, descanso: 120 },
      { nombre: 'Peso muerto sumo', series: 3, repeticiones: 6, descanso: 90 },
      { nombre: 'Press de banca cerrado', series: 3, repeticiones: 12, descanso: 90 },
      { nombre: 'Dominadas con agarre estrecho', series: 'Máximo de repeticiones', repeticiones: null, descanso: 120 },
      { nombre: 'Remo con barra con agarre invertido', series: 3, repeticiones: 10, descanso: 60 },
      { nombre: 'Peso muerto convencional', series: 3, repeticiones: 5, descanso: 90 },
      { nombre: 'Dominadas con peso añadido', series: 'Máximo de repeticiones', repeticiones: null, descanso: 120 },
      ],
      Ectomorfo: [
      { nombre: 'Elevaciones laterales', series: 3, repeticiones: 12, descanso: 30 },
      { nombre: 'Curl de bíceps con barra Z', series: 3, repeticiones: 15, descanso: 30 },
      { nombre: 'Extensión de tríceps por encima de la cabeza', series: 3, repeticiones: 12, descanso: 30 },
      { nombre: 'Zancadas bulgaras', series: 3, repeticiones: 15, descanso: 30 },
      { nombre: 'Elevaciones laterales con banda elástica', series: 3, repeticiones: 15, descanso: 30 },
      { nombre: 'Curl de bíceps con martillo', series: 3, repeticiones: 12, descanso: 30 },
      { nombre: 'Press francés con barra', series: 3, repeticiones: 12, descanso: 30 },
      { nombre: 'Zancadas con peso', series: 3, repeticiones: 12, descanso: 30 },
      { nombre: 'Remo al mentón con barra', series: 3, repeticiones: 12, descanso: 30 },
      { nombre: 'Curl de bíceps con barra W', series: 3, repeticiones: 15, descanso: 30 },
      { nombre: 'Press francés con mancuerna', series: 3, repeticiones: 12, descanso: 30 },
      { nombre: 'Zancadas con salto', series: 3, repeticiones: 10, descanso: 30 }
      ]
    };

    useEffect(() => {
      setError(null);
      if (cliente && cliente.id) {
        // Cambiar el puerto a 3005 para coincidir con tu servidor
        fetch(`http://localhost:3005/client/${cliente.id}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('No se pudo obtener los datos del cliente');
            }
            return response.json();
          })
          .then(data => {
            setClienteData(data);
            if (data.rutinas) {
              try {
                const rutinaParseada = JSON.parse(data.rutinas);
                setRutina(rutinaParseada);
                setRutinaInicial(JSON.parse(JSON.stringify(rutinaParseada)));
              } catch (e) {
                console.error('Error al parsear las rutinas:', e);
                setError('Error al cargar las rutinas del cliente');
              }
            } else if (data.tipoCuerpo && rutinasIniciales[data.tipoCuerpo]) {
              setRutina(rutinasIniciales[data.tipoCuerpo]);
              setRutinaInicial(JSON.parse(JSON.stringify(rutinasIniciales[data.tipoCuerpo])));
            } else {
              setError(`No se encontró una rutina asignada para ${cliente.nombre}`);
            }
          })
          .catch(error => {
            console.error('Error al obtener los datos del cliente:', error);
            setError(error.message);
          });
      }
    }, [cliente]);
  
    useEffect(() => {
      const cambios = JSON.stringify(rutina) !== JSON.stringify(rutinaInicial);
      setHasChanges(cambios);
    }, [rutina, rutinaInicial]);
  
    const handleInputChange = (index, field, value) => {
      if (field === 'series' || field === 'repeticiones' || field === 'descanso') {
        value = Math.max(0, parseInt(value) || 0);
      }
      const newRutina = [...rutina];
      newRutina[index] = { ...newRutina[index], [field]: value };
      setRutina(newRutina);
    };
  
    const handleActualizar = () => {
      if (clienteData) {
        const updatedClienteData = {
          tipoCuerpo: clienteData.tipoCuerpo,
          rutinas: JSON.stringify(rutina)
        };
  
        fetch(`http://localhost:3005/client/${clienteData.id}`, {
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
          setShowAlert(true);
          setIsEditing(false);
          setTimeout(() => {
            setShowAlert(false);
            setIsEditing(true);
            navigate('/adminEmpleadoIndex');
          }, 3000);
        })
        .catch(error => {
          console.error('Error al actualizar la rutina:', error);
          setError(error.message);
        });
      }
    };
  
    const handleBuscarVideo = (index) => {
      const url = rutina[index].videoUrl;
      if (!url) return;
      const videoId = extractYouTubeId(url);
      if (videoId) {
        const newRutina = [...rutina];
        newRutina[index].thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
        setRutina(newRutina);
      }
    };
  
    const extractYouTubeId = (url) => {
      if (!url) return null;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };
  
    if (error) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Alert severity="error" style={{ width: '20%' }}>
            {error}
          </Alert>
        </div>
      );
    }
  
    return (
      <div className="ejercicios-cliente" style={{ marginBottom: '20px' }}>
        <h2>Rutina de {cliente.nombre}</h2>
        <table className="ejercicios-table">
          <thead>
            <tr>
              <th>Ejercicio</th>
              <th>Video</th>
              <th colSpan="2">Series / Repeticiones</th>
              <th>Descanso (s)</th>
            </tr>
          </thead>
          <tbody>
            {rutina.map((ejercicio, index) => (
              <tr key={index}>
                <td>{ejercicio.nombre}</td>
                <td>
                  {ejercicio.thumbnailUrl && (
                    <img src={ejercicio.thumbnailUrl} alt="Video thumbnail" className="video-thumbnail" />
                  )}
                  <input
                    type="text"
                    value={ejercicio.videoUrl || ''}
                    onChange={(e) => handleInputChange(index, 'videoUrl', e.target.value)}
                    placeholder="Enlace de YouTube"
                    disabled={!isEditing}
                  />
                  <button onClick={() => handleBuscarVideo(index)} disabled={!isEditing || !ejercicio.videoUrl}>Buscar</button>
                </td>
                {ejercicio.series === 'Máximo de repeticiones' ? (
                  <td colSpan="2">Máximo de repeticiones</td>
                ) : (
                  <>
                    <td>
                      <input
                        type="number"
                        value={ejercicio.series}
                        onChange={(e) => handleInputChange(index, 'series', e.target.value)}
                        min="0"
                        disabled={!isEditing}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={ejercicio.repeticiones || ''}
                        onChange={(e) => handleInputChange(index, 'repeticiones', e.target.value)}
                        min="0"
                        disabled={!isEditing}
                      />
                    </td>
                  </>
                )}
                <td>
                  <input
                    type="number"
                    value={ejercicio.descanso}
                    onChange={(e) => handleInputChange(index, 'descanso', e.target.value)}
                    min="0"
                    disabled={!isEditing}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showAlert && (
          <Alert severity="success">Rutina actualizada con éxito</Alert>
        )}
        {!error && (
        <button 
          className="actualizar-btn" 
          onClick={handleActualizar} 
          disabled={!isEditing || !hasChanges}
        >
          Actualizar
        </button>
      )}
    </div>
    );
  };
  
  export default EjerciciosCliente;