import React, { useState, useEffect } from 'react';
import './Buscar.css';
// import Foto from '../../../assets/icons/userIcon.png';
import Alert from '@mui/material/Alert';

const Buscar = ({ clientInfo, onClose }) => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:3001/client');
        const data = await response.json();
        setClients(data);
        setFilteredClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
        showAlert('Error al obtener los clientes', 'error');
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    if (clientInfo) {
      setSearchTerm(`${clientInfo.nombre} ${clientInfo.apellido}`);
    } else {
      setSearchTerm('');
    }
  }, [clientInfo]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredClients(clients);
    } else {
      const [nombre, apellido] = searchTerm.split(' ');
      const filtered = clients.filter(client =>
        (nombre && apellido
          ? client.nombre.toLowerCase().includes(nombre.toLowerCase()) &&
            client.apellido.toLowerCase().includes(apellido.toLowerCase())
          : client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.usuario.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  const handleBackClick = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = async (id) => {
    try {
      const clientToUpdate = clients.find(client => client.id === id);
      const response = await fetch(`http://localhost:3001/client/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientToUpdate),
      });

      if (response.ok) {
        setEditingId(null);
        showAlert('Cliente actualizado correctamente', 'success');
        const updatedResponse = await fetch('http://localhost:3001/client');
        const updatedData = await updatedResponse.json();
        setClients(updatedData);
        setFilteredClients(updatedData);
      } else {
        showAlert('Error al actualizar el cliente', 'error');
      }
    } catch (error) {
      console.error('Error updating client:', error);
      showAlert('Error al actualizar el cliente', 'error');
    }
  };

  const handleDisable = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/client/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setClients(clients.filter(client => client.id !== id));
        showAlert('Cliente inhabilitado correctamente', 'success');
      } else {
        showAlert('Error al inhabilitar el cliente', 'error');
      }
    } catch (error) {
      console.error('Error disabling client:', error);
      showAlert('Error al inhabilitar el cliente', 'error');
    }
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
          placeholder="Nombre y Apellido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="table-container">
        <table className="client-table">
          <thead>
            <tr>
              {/* <th>Foto</th> }*/}
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
              {/*<th>Contraseña</th>
               <th>Clase</th>
              <th>Plan</th>
              <th>Tickets</th> */}
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(client => (
              <tr key={client.id}>
                {/* <td><img src={Foto} alt="User" className="client-photo" /></td>*/}
                <td>{editingId === client.id ? <input value={client.nombre} onChange={(e) => setClients(clients.map(c => c.id === client.id ? { ...c, nombre: e.target.value } : c))} /> : client.nombre}</td>
                <td>{editingId === client.id ? <input value={client.apellido} onChange={(e) => setClients(clients.map(c => c.id === client.id ? { ...c, apellido: e.target.value } : c))} /> : client.apellido}</td>
                <td>{client.tipoDocumento}</td>
                <td>{client.numeroDocumento}</td>
                <td>{client.correo}</td>
                <td>{client.telefono}</td>
                <td>{client.sexo}</td>
                <td>{client.tipoCuerpo}</td>
                <td>{editingId === client.id ? <input value={client.peso} onChange={(e) => setClients(clients.map(c => c.id === client.id ? { ...c, peso: e.target.value } : c))} /> : client.peso}</td>
                <td>{editingId === client.id ? <input value={client.altura} onChange={(e) => setClients(clients.map(c => c.id === client.id ? { ...c, altura: e.target.value } : c))} /> : client.altura}</td>
                <td>{editingId === client.id ? <input value={client.usuario} onChange={(e) => setClients(clients.map(c => c.id === client.id ? { ...c, usuario: e.target.value } : c))} /> : client.usuario}</td>
                {/*<td>{client.password}</td>
                 <td>{client.clase || 'N/A'}</td>
                <td>{client.planes || 'N/A'}</td>
                <td>{client.tickets || 0}</td>*/}
                <td>
                  {editingId === client.id ? (
                    <button onClick={() => handleSave(client.id)} className="save-button">Guardar</button>
                  ) : (
                    <button onClick={() => handleEdit(client.id)} className="edit-button">Editar</button>
                  )}
                  {/* <button onClick={() => handleDisable(client.id)} className="disable-button">Inhabilitar</button>*/}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleBackClick} className="volver-button-Buscar">Volver</button>
    </div>
  );
};


export default Buscar;