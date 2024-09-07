import React, { useState } from 'react';
import './Buscar.css'; 
import Foto from '../../../assets/icons/userIcon.png';
import Alert from '@mui/material/Alert'; 

const Mostrar = ({ clientInfo, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    nombre: clientInfo.nombre,
    apellido: clientInfo.apellido,
    peso: clientInfo.peso,
    altura: clientInfo.altura,
    usuario: clientInfo.usuario
  });
  const [alertVisible, setAlertVisible] = useState(false);  // Estado para controlar la visibilidad del Alert

  if (!clientInfo) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3001/client/${clientInfo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedInfo),
      });

      if (response.ok) {
        const updatedClient = await response.json();
        if (typeof onUpdate === 'function') {
          onUpdate(updatedClient); // Asegurarse de que onUpdate sea una función
        }
        setIsEditing(false);  // Deshabilitar la edición
        setAlertVisible(true);  // Mostrar el Alert
        setTimeout(() => setAlertVisible(false), 3000);  // Ocultar el Alert después de 3 segundos
      } else {
        console.error('Failed to update client');
      }
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  return (
    <>
      {alertVisible && (  // Mostrar el Alert si alertVisible es true
        <div className="alert-container">
          <Alert severity="success" onClose={() => setAlertVisible(false)}>
            Datos del cliente actualizados correctamente
          </Alert>
        </div>
      )}
      <div className="overlay" onClick={onClose}>
        <div className="content" onClick={(e) => e.stopPropagation()}>
          <h2>Información del Cliente</h2>
          <div className="client-info-container">
            <div className="image-container-client">
              <img src={Foto} alt="LogoPersona" className='Imagen-Logo' />
            </div>
            <div className="text-container">
              <p>
                <strong>Nombre: </strong> 
                {isEditing ? (
                  <input 
                    name="nombre" 
                    value={editedInfo.nombre} 
                    onChange={handleInputChange}
                  />
                ) : clientInfo.nombre}
              </p>
              <p>
                <strong>Apellido: </strong> 
                {isEditing ? (
                  <input 
                    name="apellido" 
                    value={editedInfo.apellido} 
                    onChange={handleInputChange}
                  />
                ) : clientInfo.apellido}
              </p>
              <p><strong>Genero:</strong> {clientInfo.sexo}</p>
              <p><strong>Tipo de Cuerpo:</strong> {clientInfo.tipoCuerpo}</p>
              <p>
                <strong>Peso: </strong> 
                {isEditing ? (
                  <input 
                    name="peso" 
                    value={editedInfo.peso} 
                    onChange={handleInputChange}
                  />
                ) : clientInfo.peso}
              </p>
              <p>
                <strong>Altura: </strong> 
                {isEditing ? (
                  <input 
                    name="altura" 
                    value={editedInfo.altura} 
                    onChange={handleInputChange}
                  />
                ) : clientInfo.altura}
              </p>
              <p>
                <strong>Usuario: </strong> 
                {isEditing ? (
                  <input 
                    name="usuario" 
                    value={editedInfo.usuario} 
                    onChange={handleInputChange}
                  />
                ) : clientInfo.usuario}
              </p>
              <p><strong>Password:</strong> {clientInfo.password}</p>
              <p><strong>Clase:</strong> {clientInfo.clase || 'N/A'}</p>
              <p><strong>Plan:</strong> {clientInfo.planes || 'N/A'}</p>
              <p><strong>Ticketera:</strong> {clientInfo.ticketera || 'N/A'}</p>
            </div>
          </div>
          <div className="modal-button-container">
            <button onClick={onClose} className="modal-close-button">Cerrar</button>
            {isEditing ? (
              <button onClick={handleSubmit} className="modal-save-button">Actualizar</button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="modal-edit-button">Editar</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Mostrar;
