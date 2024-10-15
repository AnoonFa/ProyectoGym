import React, { useState, useEffect } from 'react';
import './Buscar.css';
import Alert from '@mui/material/Alert';

const Buscar = ({ clientInfo, onClose }) => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const clientsPerPage = 7;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsResponse, classesResponse] = await Promise.all([
          fetch('http://localhost:3001/client'),
          fetch('http://localhost:3001/clases')
        ]);
        const clientsData = await clientsResponse.json();
        const classesData = await classesResponse.json();
        setClients(clientsData);
        setFilteredClients(clientsData);
        setClasses(classesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        showAlert('Error al obtener los datos', 'error');
      }
    };
    fetchData();
  }, []);

  const getClientClass = (clientId) => {
    for (let clase of classes) {
      const inscrito = clase.inscritos.find(i => i.idCliente === clientId);
      if (inscrito) {
        return clase.nombre;
      }
    }
    return 'N/A';
  };

  useEffect(() => {
    if (clientInfo) {
      setSearchTerm(`${clientInfo.nombre} ${clientInfo.apellido}`);
    } else {
      setSearchTerm('');
    }
  }, [clientInfo]);

  useEffect(() => {
    let filtered = [...clients];
    if (searchTerm !== '') {
      const terms = searchTerm.trim().split(' ');
      filtered = clients.filter(client => {
        const clientName = client.nombre.toLowerCase();
        const clientLastName = client.apellido.toLowerCase();
        const userName = client.usuario.toLowerCase();
        return terms.every(term =>
          clientName.includes(term.toLowerCase()) ||
          clientLastName.includes(term.toLowerCase()) ||
          userName.includes(term.toLowerCase())
        );
      });
    }
    
    // Ordenar por nombre solo si se ha seleccionado una opción
    if (sortOrder !== '') {
      filtered.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.nombre.localeCompare(b.nombre);
        } else {
          return b.nombre.localeCompare(a.nombre);
        }
      });
    }

    setFilteredClients(filtered);
    setCurrentPage(1);
  }, [searchTerm, clients, sortOrder]);

  const handleToggleStatus = (client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  const handleBackClick = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const confirmToggleStatus = async () => {
    try {
      const updatedClient = { ...selectedClient, habilitado: !selectedClient.habilitado };
      const response = await fetch(`http://localhost:3001/client/${selectedClient.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedClient),
      });

      if (response.ok) {
        showAlert(`Se ha ${selectedClient.habilitado ? 'Inhabilitado' : 'Habilitado'} a ${selectedClient.nombre} ${selectedClient.apellido} con exito`, 'success');
        const updatedClients = clients.map(c => c.id === selectedClient.id ? updatedClient : c);
        setClients(updatedClients);
        setFilteredClients(updatedClients);
      } else {
        showAlert(`Error al ${selectedClient.habilitado ? 'inhabilitar' : 'habilitar'} el cliente`, 'error');
      }
    } catch (error) {
      console.error('Error updating client:', error);
      showAlert(`Error al ${selectedClient.habilitado ? 'inhabilitar' : 'habilitar'} el cliente`, 'error');
    }
    setModalOpen(false);
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
    setTimeout(() => setAlertVisible(false), 3000); // Hide alert after 3 seconds
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
          <Alert severity={alertType} onClose={() => setAlertVisible(false)}>
            {alertMessage}
          </Alert>
        </div>
      )}
      <div className="search-box">
        <input
          type="text"
          placeholder="Nombre y Apellido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-select"
        >
          <option value="">Selecciona la forma  </option>
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
              <th>Tipo de Documento</th>
              <th>Número de Documento</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Género</th>
              <th>Tipo de cuerpo</th>
              <th>Peso</th>
              <th>Altura</th>
              <th>Usuario</th>
              <th>Clase</th>
              <th>Plan</th>
              <th>Tickets</th>
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
                <td>{getClientClass(client.id)}</td>
                <td>{client.planes && client.planes.length > 0 ? client.planes[0].name : 'N/A'}</td>
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
            <p>¿Está seguro de {selectedClient?.habilitado ? 'inhabilitar' : 'habilitar'} a {selectedClient?.nombre} {selectedClient?.apellido}?</p>
            <div className="modal-buttons-buscar">
              <button onClick={() => setModalOpen(false)} className="modal-cancel-buscar">Cancelar</button>
              <button onClick={confirmToggleStatus} className="modal-confirm-buscar">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buscar;