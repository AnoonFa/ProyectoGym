import React, { useState, useEffect } from 'react';
import './RutinaAdminIndex.css';

const FormularioCliente = ({ onClienteSeleccionado }) => {
  const [cliente, setCliente] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(false);

  useEffect(() => {
    // Obtener la lista de clientes desde el servidor
    fetch('http://localhost:3001/client')
      .then(response => response.json())
      .then(data => {
        const clientesList = data.map(c => ({
          id: c.id,
          nombre: `${c.nombre} ${c.apellido}`,
          numeroDocumento: c.numeroDocumento // Agregar numeroDocumento
        }));
        setClientes(clientesList);
      })
      .catch(error => {
        console.error('Error al obtener los clientes:', error);
      });
  }, []);

  const handleSearchChange = (e) => {
    // Aceptar solo números
    const input = e.target.value;
    if (!isNaN(input)) {
      setSearchTerm(input);
    }
  };

  const handleSelectCliente = (id) => {
    setCliente(id);
    setSearchTerm(''); // Limpiar el término de búsqueda al seleccionar un cliente
    onClienteSeleccionado(clientes.find(c => c.id === id));
    setClienteSeleccionado(true); // Cliente seleccionado, cambiar el estado
  };

  // Filtrar clientes por numeroDocumento
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
                  key={cliente.id}  // Usa el ID como clave
                  onClick={() => handleSelectCliente(cliente.id)}
                  className="dropdown-list-item"
                >
                  {cliente.nombre} {/* Mostrar nombre y apellido */}
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
