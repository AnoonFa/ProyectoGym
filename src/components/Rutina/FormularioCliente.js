import React, { useState, useEffect } from 'react';
import './RutinaAdminIndex.css';

const FormularioCliente = ({ onClienteSeleccionado }) => {
  const [cliente, setCliente] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3005/client')
      .then(response => response.json())
      .then(data => {
        const clientesList = data.map(c => ({
          id: c.id,
          nombre: `${c.nombre} ${c.apellido}`,
          numeroDocumento: c.numeroDocumento,
          tipoCuerpo: c.tipoCuerpo,
          rutinas: c.rutinas
        }));
        setClientes(clientesList);
      })
      .catch(error => {
        console.error('Error al obtener los clientes:', error);
      });
  }, []);

  const handleSearchChange = (e) => {
    const input = e.target.value;
    if (!isNaN(input)) {
      setSearchTerm(input);
    }
  };

  const handleSelectCliente = (id) => {
    const clienteSeleccionado = clientes.find(c => c.id === id);
    setCliente(id);
    setSearchTerm('');
    onClienteSeleccionado(clienteSeleccionado);
    setClienteSeleccionado(true);
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.numeroDocumento.includes(searchTerm)
  );

  return (
    <div className={`formularioXD ${clienteSeleccionado ? 'no-margin' : ''}`}>
      <label>Buscar Cliente:</label>
      <div className="input-container">
        <input
          type="text"
          placeholder="Ingrese número de documento"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        {searchTerm && (
          <ul className="dropdown-list">
            {filteredClientes.length > 0 ? (
              filteredClientes.map((cliente) => (
                <li
                  key={cliente.id}
                  onClick={() => handleSelectCliente(cliente.id)}
                  className="dropdown-list-item"
                >
                  {cliente.nombre}
                </li>
              ))
            ) : (
              <li className="dropdown-list-item no-results">
                No se encontraron resultados
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FormularioCliente;