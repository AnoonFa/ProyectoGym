import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Buscar.css';
import Alert from '@mui/material/Alert';

const Buscar = ({ clientInfo, onClose }) => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTermClients, setSearchTermClients] = useState('');
  const [searchTermEmployees, setSearchTermEmployees] = useState('');
  const [currentPageClients, setCurrentPageClients] = useState(1);
  const [currentPageEmployees, setCurrentPageEmployees] = useState(1);
  const clientsPerPage = 7;
  const employeesPerPage = 7;
  const API_URL = 'https://gimnasio-david-goliat-018399150974.herokuapp.com';

  // Cargar datos de clientes y empleados
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${API_URL}/client`);
        setClients(response.data);
        setFilteredClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${API_URL}/employee`);
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchClients();
    fetchEmployees();
  }, []);

  // Filtrar clientes
  useEffect(() => {
    const filtered = clients.filter(client =>
      `${client.nombre} ${client.apellido}`
        .toLowerCase()
        .includes(searchTermClients.toLowerCase())
    );
    setFilteredClients(filtered);
    setCurrentPageClients(1);
  }, [searchTermClients, clients]);

  // Filtrar empleados
  useEffect(() => {
    const filtered = employees.filter(employee =>
      `${employee.nombre} ${employee.apellido}`
        .toLowerCase()
        .includes(searchTermEmployees.toLowerCase())
    );
    setFilteredEmployees(filtered);
    setCurrentPageEmployees(1);
  }, [searchTermEmployees, employees]);

  // Paginación para clientes
  const indexOfLastClient = currentPageClients * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  // Paginación para empleados
  const indexOfLastEmployee = currentPageEmployees * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  return (
    <div className="buscar-container">
      {/* Tabla de Clientes */}
      <div className="table-section">
        <h2>Clientes</h2>
        <input
          type="text"
          placeholder="Buscar clientes..."
          value={searchTermClients}
          onChange={(e) => setSearchTermClients(e.target.value)}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-select"
        >
          <option value="">Ordenar por...</option>
          <option value="asc">Nombre (A-Z)</option>
          <option value="desc">Nombre (Z-A)</option>
        </select>
      </div>
      <div className="table-container">
        <table className="client-table">
          <thead>
          <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Tipo Doc.</th>
              <th>Número Doc.</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Género</th>
              <th>Tipo Cuerpo</th>
              <th>Peso</th>
              <th>Altura</th>
              <th>Usuario</th>
              <th>Tickets</th>
              {/* <th>Fecha Creación</th>
              <th>Estado</th> */}
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {currentClients.map(client => (
              <tr key={client.id}>
                <td>{client.nombre}</td>
                <td>{client.apellido}</td>
                <td>{client.tipoDocumento}</td>
                <td>{client.numeroDocumento}</td>
                <td>{client.correo}</td>
                <td>{client.telefono}</td>
                <td>{client.sexo}</td>
                <td>{client.tipoCuerpo}</td>
                <td>{client.peso}</td>
                <td>{client.altura}</td>
                <td>{client.usuario}</td>
                <td>{client.tickets || 0}</td>
                <td>
                  <button onClick={() => handleToggleStatus(client)} className={client.habilitado ? "disable-button" : "enable-button"}>
                    {client.habilitado ? 'Inhabilitar' : 'Habilitar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <div className="pagination">
          <button onClick={() => setCurrentPageClients(prev => Math.max(prev - 1, 1))}>
            Anterior
          </button>
          
          <button
            onClick={() =>
              setCurrentPageClients(prev =>
                Math.min(prev + 1, Math.ceil(filteredClients.length / clientsPerPage))
              )
            }
          >
            Siguiente
          </button>
        </div>


      {/* Tabla de Empleados */}
      <div className="table-section">
        <h2>Empleados</h2>
        <input
          type="text"
          placeholder="Buscar empleados..."
          value={searchTermEmployees}
          onChange={(e) => setSearchTermEmployees(e.target.value)}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-select"
        >
          <option value="">Ordenar por...</option>
          <option value="asc">Nombre (A-Z)</option>
          <option value="desc">Nombre (Z-A)</option>
        </select>
      </div>
      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Cargo</th>
              <th>Correo</th>
              <th>Creado por</th>
              <th>Estado</th>
              {/* Más columnas según sea necesario */}
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map(employee => (
              <tr key={employee.id}>
                <td>{employee.usuario}</td>
                <td>{employee.cargo}</td>
                <td>{employee.correo}</td>
                <td>{employee.createdBy}</td>
                <td>
                  <button onClick={() => handleToggleStatus(employee)} className={employee.habilitado ? "disable-button" : "enable-button"}>
                    {employee.habilitado ? 'Inhabilitar' : 'Habilitar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <div className="pagination">
          <button onClick={() => setCurrentPageEmployees(prev => Math.max(prev - 1, 1))}>
            Anterior
          </button>
          <button
            onClick={() =>
              setCurrentPageEmployees(prev =>
                Math.min(prev + 1, Math.ceil(filteredEmployees.length / employeesPerPage))
              )
            }
          >
            Siguiente
          </button>
        </div>
      </div>
  );
};

export default Buscar;
