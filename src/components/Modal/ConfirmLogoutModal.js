// ConfirmLogoutModal.js
import React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import './Modal.css'; // Estilos opcionales

const ConfirmLogoutModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-fondo-gris">
      <div className="contenido-modal">
        <h2 className='titulocierre'>Confirmar Cierre de Sesión</h2>
        <br/>
        <p className='mensajecerrar'>Para poder editar el perfil es necesario que cierres sesion.</p>
        <p className='mensajecerrar'>¿Estás seguro de que deseas cerrar sesión después de editar tu perfil?</p>
        <br/>
        <div className="form-button">
          <button className="vkz-button-l" onClick={onCancel}>Cancelar</button>
          <button className="vkz-button" onClick={onConfirm}>Cerrar Sesión</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogoutModal;
