import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [selectedClient, setSelectedClient] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const API_URL = 'http://localhost:3005';

  // Función para mostrar alertas
  const showAlertMessage = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  // Cargar lista inicial de clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(`${API_URL}/client`);
        const clientesList = response.data.map(c => ({
          id: c.id,
          numeroDocumento: c.numeroDocumento,
          nombreCompleto: `${c.nombre} ${c.apellido}`
        }));
        setClientes(clientesList);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
        showAlertMessage('Error al cargar la lista de clientes', 'error');
      }
    };
    fetchClientes();
  }, []);

  // Filtrar clientes basado en el input
  useEffect(() => {
    setFilteredClientes(
      clientes.filter(cliente =>
        cliente.numeroDocumento.includes(userInput)
      )
    );
    setShowDropdown(userInput.length > 0);
  }, [userInput, clientes]);

  // Actualizar cliente seleccionado
  useEffect(() => {
    setSelectedClient(
      filteredClientes.find(cliente => cliente.numeroDocumento === userInput) || null
    );
  }, [userInput, filteredClientes]);

  const handleAddClientClick = (event) => {
    event.preventDefault();
    setShowForm(true);
    setShowSearch(true);
    setShowModal(false);
  };

  const handleSelectCliente = async (cliente) => {
    setUserInput(cliente.numeroDocumento);
    setSelectedClient(cliente);
    try {
      const response = await axios.get(`${API_URL}/client/${cliente.id}`);
      setClientInfo(response.data);
      setShowModal(true);
      setShowForm(false);
    } catch (error) {
      console.error('Error fetching client data:', error);
      showAlertMessage('Error al obtener la información del cliente', 'error');
    }
    setShowDropdown(false);
  };

  const handleSearchClick = async (event) => {
    event.preventDefault();

    if (!userInput.trim()) {
      showAlertMessage('Por favor, ingrese un número de documento.', 'warning');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/client`, {
        params: { numeroDocumento: userInput }
      });
      
      if (response.data.length) {
        setClientInfo(response.data[0]);
        setShowModal(true);
        setShowForm(false);
      } else {
        showAlertMessage('Cliente no encontrado', 'warning');
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
      showAlertMessage('Error al buscar el cliente', 'error');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setClientInfo(null);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setUserInput(value);
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
                      Número de Documento
                    </label>
                    <input
                      id="Usuario"
                      placeholder="Ingrese el Número de Documento"
                      className="vkz-input-field"
                      value={userInput}
                      onChange={handleInputChange}
                      onFocus={() => setShowDropdown(true)}
                      type="text"
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
                              {cliente.nombreCompleto}
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