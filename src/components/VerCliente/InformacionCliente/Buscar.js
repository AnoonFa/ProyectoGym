import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Buscar.css';
import Alert from '@mui/material/Alert';

const Buscar = ({ clientInfo, onClose }) => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const clientsPerPage = 7;

  const API_URL = 'http://localhost:3005'; // Asegúrate de que este puerto coincida con tu servidor

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/client`);
        const clientsData = response.data;
        setClients(clientsData);
        setFilteredClients(clientsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        showAlert('Error al obtener los datos', 'error');
      }
    };
    fetchData();
  }, []);

  // Actualizar búsqueda cuando cambia clientInfo
  useEffect(() => {
    if (clientInfo) {
      setSearchTerm(`${clientInfo.nombre} ${clientInfo.apellido}`);
    } else {
      setSearchTerm('');
    }
  }, [clientInfo]);

  // Filtrar y ordenar clientes
  useEffect(() => {
    let filtered = [...clients];
    if (searchTerm !== '') {
      const terms = searchTerm.trim().toLowerCase().split(' ');
      filtered = clients.filter(client => {
        const clientName = (client.nombre || '').toLowerCase();
        const clientLastName = (client.apellido || '').toLowerCase();
        const clientDocument = (client.numeroDocumento || '').toLowerCase();
        return terms.every(term =>
          clientName.includes(term) ||
          clientLastName.includes(term) ||
          clientDocument.includes(term)
        );
      });
    }
    
    if (sortOrder !== '') {
      filtered.sort((a, b) => {
        if (sortOrder === 'asc') {
          return (a.nombre || '').localeCompare(b.nombre || '');
        } else {
          return (b.nombre || '').localeCompare(a.nombre || '');
        }
      });
    }

    setFilteredClients(filtered);
    setCurrentPage(1);
  }, [searchTerm, clients, sortOrder]);

  // Manejar cambio de estado (habilitar/inhabilitar)
  const handleToggleStatus = (client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  // Confirmar cambio de estado
  const confirmToggleStatus = async () => {
    try {
      const updatedClient = { 
        ...selectedClient, 
        habilitado: !selectedClient.habilitado 
      };

      const response = await axios.patch(
        `${API_URL}/client/${selectedClient.id}`,
        updatedClient
      );

      if (response.status === 200) {
        showAlert(
          `Cliente ${selectedClient.habilitado ? 'inhabilitado' : 'habilitado'} exitosamente`,
          'success'
        );
        
        const updatedClients = clients.map(c => 
          c.id === selectedClient.id ? {...c, habilitado: !c.habilitado} : c
        );
        setClients(updatedClients);
        setFilteredClients(updatedClients);
      } else {
        showAlert('Error al actualizar el estado del cliente', 'error');
      }
    } catch (error) {
      console.error('Error updating client:', error);
      showAlert('Error al actualizar el estado del cliente', 'error');
    }
    setModalOpen(false);
  };

  // Funciones auxiliares
  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3000);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  const handleBackClick = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  // Paginación
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const pageCount = Math.ceil(filteredClients.length / clientsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <span
          key={i}
          onClick={() => setCurrentPage(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </span>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="buscar-container">
      {alertVisible && (
        <div className="alert-container">
          <Alert severity={alertType} onClose={handleCloseAlert}>
            {alertMessage}
          </Alert>
        </div>
      )}
      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o documento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
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
                <td>{client.tickets}</td>
                {/* <td>{new Date(client.fechaCreacion).toLocaleDateString()}</td>
                <td>{client.habilitado ? 'Activo' : 'Inactivo'}</td> */}
                <td>
                  <button 
                    onClick={() => handleToggleStatus(client)} 
                    className={client.habilitado ? "disable-button" : "enable-button"}
                  >
                    {client.habilitado ? 'Inhabilitar' : 'Habilitar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        {renderPageNumbers()}
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
          disabled={currentPage === pageCount}
        >
          Siguiente
        </button>
      </div>
      <button onClick={handleBackClick} className="back-button">Volver</button>
      
      {modalOpen && (
        <div className="modal-overlay-buscar">
          <div className="modal-content-buscar">
            <h2>Confirmar acción</h2>
            <p>
              ¿Está seguro de {selectedClient?.habilitado ? 'inhabilitar' : 'habilitar'} a{' '}
              {selectedClient?.nombre} {selectedClient?.apellido}?
            </p>
            <div className="modal-buttons-buscar">
              <button onClick={() => setModalOpen(false)} className="modal-cancel-buscar">
                Cancelar
              </button>
              <button onClick={confirmToggleStatus} className="modal-confirm-buscar">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buscar;