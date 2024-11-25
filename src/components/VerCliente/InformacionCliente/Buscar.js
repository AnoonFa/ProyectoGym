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
  const API_URL = 'http://localhost:3005';

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
        <table className="client-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              {/* Más columnas según sea necesario */}
            </tr>
          </thead>
          <tbody>
            {currentClients.map(client => (
              <tr key={client.id}>
                <td>{client.nombre}</td>
                <td>{client.apellido}</td>
                <td>{client.correo}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
        <table className="employee-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Cargo</th>
              {/* Más columnas según sea necesario */}
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map(employee => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.cargo}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
};

export default Buscar;
