import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import './RutinaAdminIndex.css';

function AñadirRutina() {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [cuerpoSeleccionado, setCuerpoSeleccionado] = useState('');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [error, setError] = useState('');
  const [postResponse, setPostResponse] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [coincidencias, setCoincidencias] = useState([]);
  const [showList, setShowList] = useState(false);

  const cuerpos = ['Endomorfo', 'Mesomorfo', 'Ectomorfo'];
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3005/client')
      .then(response => response.json())
      .then(data => {
        setClientes(data);
      })
      .catch(error => {
        console.error('Error al obtener los clientes:', error);
      });
  }, []);

  useEffect(() => {
    if (mostrarConfirmacion) {
      const timer = setTimeout(() => {
        navigate('/adminEmpleadoIndex');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mostrarConfirmacion, navigate]);

  useEffect(() => {
    if (numeroDocumento) {
      const matches = clientes.filter(cliente => cliente.numeroDocumento.includes(numeroDocumento));
      setCoincidencias(matches);
      setShowList(true);
    } else {
      setCoincidencias([]);
      setShowList(false);
    }
  }, [numeroDocumento, clientes]);

  const handleClienteChange = (event) => {
    const value = event.target.value.replace(/\D/g, ''); // Solo permite números
    setNumeroDocumento(value);
    setClienteSeleccionado('');
    if (value) {
      const matches = clientes.filter(cliente => cliente.numeroDocumento.includes(value));
      setCoincidencias(matches);
      setShowList(true);
    } else {
      setCoincidencias([]);
      setShowList(false);
    }
  };

  const handleSelectCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setNumeroDocumento(`${cliente.nombre} ${cliente.apellido}`);
    setShowList(false);
  };

  const handleCuerpoChange = (event) => {
    setCuerpoSeleccionado(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!clienteSeleccionado || !cuerpoSeleccionado) {
      setError('Por favor, complete todos los campos antes de asignar.');
      return;
    }

    setError('');
    setMostrarConfirmacion(true);

    const rutinasActualizadas = {
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
        { nombre: 'Dominadas con peso añadido', series: 'Máximo de repeticiones', repeticiones: null, descanso: 120 }
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

    const datosActualizados = {
      tipoCuerpo: cuerpoSeleccionado,
      rutinas: JSON.stringify(rutinasActualizadas[cuerpoSeleccionado] || [])
    };

    fetch(`http://localhost:3005/client/${clienteSeleccionado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosActualizados)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      return response.json();
    })
    .then(data => {
      console.log('Cliente actualizado exitosamente:', data);
      setPostResponse('Rutina asignada exitosamente');
    })
    .catch(error => {
      console.error('Error al actualizar el cliente:', error);
      setError('Hubo un error al asignar la rutina');
      setMostrarConfirmacion(false);
    });
  };

  return (
    <div className="form-container-Rutina">
      <div className="form-wrapper">
        <form className="form-content-Rutina" onSubmit={handleSubmit}>
          <label className="form-label">
            Ingrese número de documento del cliente:
            <input
              type="text"
              value={numeroDocumento}
              className="InputNumber"
              onChange={handleClienteChange}
              placeholder="Número de documento"
            />
            {showList && (
              <ul className="client-list-Rutina">
                {coincidencias.map(cliente => (
                  <li key={cliente.id} onClick={() => handleSelectCliente(cliente)}>
                    {`${cliente.nombre} ${cliente.apellido}`}
                  </li>
                ))}
              </ul>
            )}
          </label>
          <label className="form-label">
            Tipo de cuerpo:
            <select value={cuerpoSeleccionado} onChange={handleCuerpoChange}>
              <option value="">Seleccionar cuerpo</option>
              {cuerpos.map((cuerpo) => (
                <option key={cuerpo} value={cuerpo}>
                  {cuerpo}
                </option>
              ))}
            </select>
          </label>

          {error && <Alert severity="warning">{error}</Alert>}

          {postResponse && (
            <Alert severity="info" className="post-response-alert">
              {postResponse}
            </Alert>
          )}

          {!mostrarConfirmacion ? (
            <button type="submit" className="submit-button">Asignar</button>
          ) : (
            <Alert severity="success" className="confirmation-alert">
              La rutina de {cuerpoSeleccionado} fue asignada para {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
}

export default AñadirRutina;