import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RutinaAdminIndex.css'; // Importa el archivo CSS para estilos del formulario

function AñadirRutina() {
  const [clientes, setClientes] = useState([]); // Estado para la lista de clientes
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [cuerpoSeleccionado, setCuerpoSeleccionado] = useState('');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [error, setError] = useState('');

  const cuerpos = ['Endomorfo', 'Mesomorfo', 'Ectomorfo'];

  const navigate = useNavigate();

  useEffect(() => {
    // Obtener la lista de clientes al cargar el componente
    fetch('http://localhost:3001/client')
      .then(response => response.json())
      .then(data => {
        setClientes(data);
      })
      .catch(error => {
        console.error('Error al obtener los clientes:', error);
      });
  }, []);

  const handleClienteChange = (event) => {
    setClienteSeleccionado(event.target.value);
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

    // Si todo está completo, limpiamos el error y mostramos el mensaje de confirmación
    setError('');
    setMostrarConfirmacion(true);

    // Buscar el cliente seleccionado
    const clienteId = clientes.find(c => c.nombre === clienteSeleccionado).id;

    // Actualizar el tipo de cuerpo del cliente seleccionado
    fetch(`http://localhost:3001/client/${clienteId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tipoCuerpo: cuerpoSeleccionado
      })
    })
    .then(() => {
      console.log('Tipo de cuerpo actualizado');
    })
    .catch(error => {
      console.error('Error al actualizar el tipo de cuerpo:', error);
    });
  };

  const handleVolver = () => {
    navigate('/adminEmpleadoIndex');
  };

  return (
    <div className="rutina-container">
      {!mostrarConfirmacion ? (
        <div className="form-wrapper">
          <form className="form-content" onSubmit={handleSubmit}>
            <label className="form-label">
              Seleccione cliente:
              <select value={clienteSeleccionado} onChange={handleClienteChange}>
                <option value="">Cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.nombre}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
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
            {error && <p className="error-text">{error}</p>}
            <button type="submit" className="submit-button">Asignar</button>
          </form>
        </div>
      ) : (
        <div className="confirmation-wrapper">
          <div className="confirmation-checkmark">✓</div>
          <p className="confirmation-message">
            La rutina de {cuerpoSeleccionado} fue asignada para {clienteSeleccionado}.
          </p>
          <button className='return-button' onClick={handleVolver}>Volver</button>
        </div>
      )}
    </div>
  );
}

export default AñadirRutina;
