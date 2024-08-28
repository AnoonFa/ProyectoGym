import React, { useState, useEffect } from 'react';
import './RutinaAdminIndex.css';

const FormularioCliente = ({ onClienteSeleccionado }) => {
  const [cliente, setCliente] = useState(''); 
  const [searchTerm, setSearchTerm] = useState('');
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Obtener la lista de clientes desde el servidor
    fetch('http://localhost:3001/client')
      .then(response => response.json())
      .then(data => {
        // Mapear datos para adecuarlos al formato requerido
        const clientesList = data.map(c => ({
          id: c.id,  // Asegúrate de incluir el ID
          nombre: `${c.nombre} ${c.apellido}`,
          tipo: c.tipoCuerpo || 'Desconocido'
        }));
        setClientes(clientesList);
      })
      .catch(error => {
        console.error('Error al obtener los clientes:', error);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectCliente = (id) => {
    setCliente(id);
    setSearchTerm(''); // Limpiar el término de búsqueda al seleccionar un cliente
    onClienteSeleccionado(clientes.find(c => c.id === id));
  };

  // Filtrar clientes según el término de búsqueda
  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="formularioXD">
      <label>Seleccione Cliente:</label>
      <div className="input-container">
        <input
          type="text"
          placeholder="Buscar cliente..."
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
