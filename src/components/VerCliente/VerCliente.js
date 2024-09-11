import React, { useState, useEffect } from 'react';
import './VerCliente.css';
import ClienteForm from '../../Forms/ClienteForm/ClienteForm'; 
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Mostrar from './InformacionCliente/Buscar'; 
import Alert from '@mui/material/Alert'; 

function VerCliente() {
  const [showForm, setShowForm] = useState(false); 
  const [showSearch, setShowSearch] = useState(true); 
  const [showModal, setShowModal] = useState(false); 
  const [clientInfo, setClientInfo] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null); // Nuevo estado para el cliente seleccionado
  const [alertMessage, setAlertMessage] = useState(null); 
  const [alertType, setAlertType] = useState('');
  const [showAlert, setShowAlert] = useState(false); // Nuevo estado para controlar la visibilidad del Alert

  useEffect(() => {
    fetch('http://localhost:3001/client')
      .then(response => response.json())
      .then(data => {
        const clientesList = data.map(c => ({
          id: c.id,
          nombreCompleto: `${c.nombre} ${c.apellido}`,
          usuario: c.usuario
        }));
        setClientes(clientesList);
      })
      .catch(error => {
        console.error('Error al obtener los clientes:', error);
      });
  }, []);

  useEffect(() => {
    setFilteredClientes(
      clientes.filter(cliente =>
        cliente.nombreCompleto.toLowerCase().includes(userInput.toLowerCase()) ||
        cliente.usuario.toLowerCase().includes(userInput.toLowerCase())
      )
    );
    setShowDropdown(userInput.length > 0);
  }, [userInput, clientes]);

  useEffect(() => {
    // Habilitar/Deshabilitar el botón Buscar en función del estado de entrada y cliente seleccionado
    setSelectedClient(filteredClientes.find(cliente => cliente.nombreCompleto === userInput) || null);
  }, [userInput, filteredClientes]);

  const handleAddClientClick = (event) => {
    event.preventDefault();
    setShowForm(true); 
    setShowSearch(true); // Muestra la búsqueda si el formulario está visible
    setShowModal(false); 
  };

  const handleSelectCliente = async (cliente) => {
    setUserInput(cliente.nombreCompleto);
    setSelectedClient(cliente); // Actualiza el cliente seleccionado
    try {
      const response = await fetch(`http://localhost:3001/client/${cliente.id}`);
      const data = await response.json();
      setClientInfo(data);
      setShowModal(true);
      setShowForm(false); 
    } catch (error) {
      console.error('Error fetching client data:', error);
      setAlertMessage('Error al obtener la información del cliente');
      setAlertType('error');
    }
    setShowDropdown(false);
  };

  const handleSearchClick = async (event) => {
    event.preventDefault();

    // Mostrar el alert si no hay entrada de usuario y no se ha seleccionado un cliente
    if (!userInput.trim() && !selectedClient) {
      setAlertMessage('Por favor, ingrese un nombre o seleccione un cliente.');
      setAlertType('warning');
      setShowAlert(true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/client?usuario=${userInput}`);
      const data = await response.json();
      if (data.length) {
        setClientInfo(data[0]);
        setShowModal(true);
        setShowForm(false);
      } else {
        setAlertMessage('Cliente no encontrado'); 
        setAlertType('error'); 
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
      setAlertMessage('Error al buscar el cliente');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setClientInfo(null);
  };

  const handleCloseAlert = () => {
    setShowAlert(false); 
  };

  return (
    <>
      <Header />
      <div className={`vkz-container ${showForm ? 'with-form' : ''}`}>
        <div className="vkz-search-form-container">
          {showSearch && !showModal && (
            <div className="vkz-form-container">
              {showAlert && (
                <div className="alert-container">
                  <Alert severity={alertType} onClose={handleCloseAlert}>
                    {alertMessage}
                  </Alert>
                </div>
              )}
              <form className='vkz-form'>
                <div className="vkz-form-content">
                  <h1 className="vkz-form-title">Buscar cliente</h1>
                  <div className="vkz-input-group">
                    <label htmlFor="Usuario" className="vkz-input-label">
                      Nombre y Apellido
                    </label>
                    <input
                      id="Usuario"
                      placeholder="Ingrese el nombre y apellido"
                      className="vkz-input-field"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onFocus={() => setShowDropdown(true)}
                    />
                    {showDropdown && userInput && (
                      <ul className="dropdown-list-Cliente">
                        {filteredClientes.length > 0 ? (
                          filteredClientes.map(cliente => (
                            <li
                              key={cliente.id}
                              onClick={() => handleSelectCliente(cliente)}
                              className="dropdown-list-item-Cliente"
                            >
                              {cliente.nombreCompleto} ({cliente.usuario})
                            </li>
                          ))
                        ) : (
                          <li className="dropdown-list-item no-results-Cliente">
                            No se encontraron resultados
                          </li>
                        )}
                      </ul>
                    )}
                    <div className="vkz-button-group">
                      <button 
                        onClick={handleSearchClick} 
                        className="vkz-button-Buscar"
                      >
                        Buscar
                      </button>
                      <button 
                        onClick={handleAddClientClick} 
                        className="vkz-button-Agregar"
                      >
                        Agregar Cliente
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {showModal && (
            <Mostrar clientInfo={clientInfo} onClose={handleCloseModal} />
          )}
        </div>

        {showForm && (
          <div className="vkz-form-right-container">
            <ClienteForm />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default VerCliente;
