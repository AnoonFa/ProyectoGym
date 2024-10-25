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
        // Realiza la solicitud al backend buscando por correo
        const response = await fetch(`http://localhost:3001/client?correo=${correo}`);
        
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        const data = await response.json();

        // Verificamos si el resultado es un array vacío
        if (data.length === 0) {
            setError('Usuario no encontrado.');
            return;
        }

        const user = data[0];

        if (user.correo) {
            const resetLink = `http://localhost:3000/restablecer-contraseña/${user.id}`;
            
            const emailDetails = {
                to_name: user.nombre,
                to_email: user.correo,
                from_name: 'Gimnasio David & Goliat',
                from_email: 'gimnasiodavidgoliat@gmail.com',
                reply_to: 'gimnasiodavidgoliat@gmail.com',
                to_link: resetLink,
            };

            emailjs.send('service_pvx889u', 'template_fccbx4i', emailDetails, 'rncnnJK5UsTDQ-RqW')
                .then(() => {
                    setMessage(`Se ha enviado un correo a: ${user.correo}`);
                })
                .catch(() => {
                    setError('Error al enviar el correo. Intenta nuevamente.');
                });
        } else {
            setError('El usuario no tiene un correo asociado.');
        }
    } catch (error) {
        console.error('Error:', error);
        setError('Hubo un problema al buscar el usuario.');
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
