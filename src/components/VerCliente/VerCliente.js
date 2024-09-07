import React, { useState, useEffect } from 'react';
import './VerCliente.css';
import ClienteForm from '../../Forms/ClienteForm/ClienteForm'; // Importamos el nuevo formulario
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Mostrar from './InformacionCliente/Buscar'; // Importamos el componente Mostrar
import Alert from '@mui/material/Alert';  // Importa correctamente el Alert

function VerCliente() {
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [clientInfo, setClientInfo] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null); // Estado para manejar el mensaje del Alert
  const [alertType, setAlertType] = useState(''); // Estado para manejar el tipo de Alert (success/error)

  useEffect(() => {
    // Obtener la lista de clientes desde el servidor
    fetch('http://localhost:3001/client')
      .then(response => response.json())
      .then(data => {
        const clientesList = data.map(c => ({
          id: c.id,
          nombre: c.usuario // Asegúrate de que 'usuario' es el campo correcto
        }));
        setClientes(clientesList);
      })
      .catch(error => {
        console.error('Error al obtener los clientes:', error);
      });
  }, []);

  useEffect(() => {
    // Filtrar clientes según el término de búsqueda
    setFilteredClientes(
      clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(userInput.toLowerCase())
      )
    );
    setShowDropdown(userInput.length > 0);
  }, [userInput, clientes]);

  const handleAddClientClick = (event) => {
    event.preventDefault(); // Evita que el formulario se envíe
    setShowForm(true);
  };

  const handleSelectCliente = async (cliente) => {
    setUserInput(cliente.nombre);
    try {
      const response = await fetch(`http://localhost:3001/client/${cliente.id}`);
      const data = await response.json();
      setClientInfo(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching client data:', error);
      setAlertMessage('Error al obtener la información del cliente');
      setAlertType('error');
    } 
    setShowDropdown(false);
  };

  const handleSearchClick = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/client?usuario=${userInput}`);
      const data = await response.json();
      if (data.length) {
        setClientInfo(data[0]);
        setShowModal(true);
      } else {
        setAlertMessage('Cliente no encontrado'); // Mostrar mensaje de cliente no encontrado
        setAlertType('error'); // Tipo de alerta error
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
      setAlertMessage('Error al buscar el cliente');
      setAlertType('error');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setClientInfo(null);
  };

  const handleCloseAlert = () => {
    setAlertMessage(null); // Limpiar el mensaje del alert al cerrarlo
  };

  return (
    <>
      <Header />
      <div className={`vkz-container ${showForm ? 'with-form' : ''}`}>
        {/* Contenedor del formulario Buscar Cliente */}
        <div className="vkz-form-container">
          {alertMessage && (  // Mostrar el Alert solo si hay un mensaje
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
                  Usuario
                </label>
                <input
                  id="Usuario"
                  placeholder="Ingrese el usuario"
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
                          {cliente.nombre}
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
                  <button onClick={handleSearchClick} className="vkz-button-Buscar">
                    Buscar
                  </button>
                  <button onClick={handleAddClientClick} className="vkz-button-Agregar">
                    Agregar Cliente
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Mostramos el formulario de agregar cliente si showForm es true */}
        {showForm && <ClienteForm />}

        {/* Ventana Modal usando el componente Mostrar */}
        {showModal && (
          <Mostrar clientInfo={clientInfo} onClose={handleCloseModal} />
        )}
      </div>
      <Footer />
    </>
  );
}

export default VerCliente;
