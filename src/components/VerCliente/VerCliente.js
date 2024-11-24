import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VerCliente.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Mostrar from './InformacionCliente/Buscar'; 
import Alert from '@mui/material/Alert'; 
import Relleno from '../Relleno/Relleno';

// Componente principal para ver y buscar clientes
function VerCliente() {
  // Estados para controlar la visibilidad y la información del cliente
  const [showForm, setShowForm] = useState(false); // Controla si se muestra el formulario
  const [showSearch, setShowSearch] = useState(true); // Controla si se muestra la búsqueda
  const [showModal, setShowModal] = useState(false); // Controla si se muestra el modal con información del cliente
  const [clientInfo, setClientInfo] = useState(null); // Almacena la información del cliente seleccionado
  const [userInput, setUserInput] = useState(''); // Almacena el input del usuario
  const [clientes, setClientes] = useState([]); // Lista de clientes
  const [filteredClientes, setFilteredClientes] = useState([]); // Lista filtrada de clientes
  const [showDropdown, setShowDropdown] = useState(false); // Controla si se muestra el dropdown de clientes filtrados
  const [selectedClient, setSelectedClient] = useState(null); // Cliente seleccionado
  const [alertMessage, setAlertMessage] = useState(null); // Mensaje de alerta
  const [alertType, setAlertType] = useState(''); // Tipo de alerta (error, warning, etc.)
  const [showAlert, setShowAlert] = useState(false); // Controla si se muestra la alerta

  const API_URL = 'http://localhost:3005'; // URL de la API

  // Función para mostrar alertas
  const showAlertMessage = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  // Efecto para cargar la lista inicial de clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(`${API_URL}/client`);
        const clientesList = response.data.map(c => ({
          id: c.id,
          numeroDocumento: c.numeroDocumento,
          nombreCompleto: `${c.nombre} ${c.apellido}` // Combina nombre y apellido
        }));
        setClientes(clientesList);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
        showAlertMessage('Error al cargar la lista de clientes', 'error');
      }
    };
    fetchClientes();
  }, []); // Ejecuta solo una vez al montar el componente

  // Efecto para filtrar clientes basado en el input
  useEffect(() => {
    setFilteredClientes(
      clientes.filter(cliente =>
        cliente.numeroDocumento.includes(userInput) // Filtra por número de documento
      )
    );
    setShowDropdown(userInput.length > 0); // Muestra el dropdown si hay input
  }, [userInput, clientes]);

  // Efecto para actualizar el cliente seleccionado
  useEffect(() => {
    setSelectedClient(
      filteredClientes.find(cliente => cliente.numeroDocumento === userInput) || null
    );
  }, [userInput, filteredClientes]);

  // Función para manejar la selección de un cliente del dropdown
  const handleSelectCliente = async (cliente) => {
    setUserInput(cliente.numeroDocumento); // Establece el input con el número de documento
    setSelectedClient(cliente); // Establece el cliente seleccionado
    try {
      const response = await axios.get(`${API_URL}/client/${cliente.id}`); // Obtiene la información del cliente
      setClientInfo(response.data);
      setShowModal(true); // Muestra el modal con la información
      setShowForm(false); // Oculta el formulario
    } catch (error) {
      console.error('Error fetching client data:', error);
      showAlertMessage('Error al obtener la información del cliente', 'error');
    }
    setShowDropdown(false); // Oculta el dropdown
  };

  // Función para manejar la búsqueda del cliente
  const handleSearchClick = async (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario

    if (!userInput.trim()) {
      showAlertMessage('Por favor, ingrese un número de documento.', 'warning');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/client`, {
        params: { numeroDocumento: userInput }
      });
      
      if (response.data.length) {
        setClientInfo(response.data[0]); // Establece la información del cliente encontrado
        setShowModal(true); // Muestra el modal
        setShowForm(false); // Oculta el formulario
      } else {
        showAlertMessage('Cliente no encontrado', 'warning'); // Mensaje si no se encuentra el cliente
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
      showAlertMessage('Error al buscar el cliente', 'error');
    }
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setClientInfo(null);
  };

  // Función para cerrar la alerta
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  // Función para manejar el cambio en el input del número de documento
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Permite solo dígitos
    setUserInput(value);
  };

  return (
    <>
      <Header />
      <Relleno/>
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
                  <h1 className="vkz-form-title">Buscar</h1>
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
                      onFocus={() => setShowDropdown(true)} // Muestra el dropdown al enfocar
                      type="text"
                    />
                    {showDropdown && userInput && (
                      <ul className="dropdown-list-Cliente">
                        {filteredClientes.length > 0 ? (
                          filteredClientes.map(cliente => (
                            <li
                              key={cliente.id}
                              onClick={() => handleSelectCliente(cliente)} // Maneja la selección del cliente
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
                      <button 
                        onClick={handleSearchClick} 
                        className="vkz-button-Buscar"
                      >
                        Buscar
                      </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {showModal && (
            <Mostrar clientInfo={clientInfo} onClose={handleCloseModal} /> // Muestra el modal con la información del cliente
          )}
        </div>

        {showForm && (
          <div className="vkz-form-right-container">
            <ClienteForm /> // Componente para agregar un nuevo cliente
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default VerCliente;