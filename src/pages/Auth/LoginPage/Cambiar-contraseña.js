import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import emailjs from 'emailjs-com';
import './ChangePassword.css'; // Importa el CSS

const ChangePassword = () => {
  const [correo, setCorreo] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3005/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo }),
    });
    

      if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || 'Error desconocido');
          return;
      }

      const data = await response.json();
      setMessage(data.message);
  } catch (error) {
      console.error('Error:', error);
      setError('Error en la conexión con el servidor.');
  }
};


  
  return (
    <div className="blinking-container"> {/* Contenedor blanco centrado */}
      <h2 className="h2-flashing">Cambiar Contraseña</h2>
      <form className="form-ninja" onSubmit={handleSubmit}>
        <div>
          <input
            className="input-squid" // Estilo para el input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <button className="button-frog" type="submit">Enviar</button>
        {message && <Alert className="alert-magic" severity="success">{message}</Alert>}
        {error && <Alert className="alert-magic" severity="error">{error}</Alert>}
      </form>
    </div>
  );
};

export default ChangePassword;
