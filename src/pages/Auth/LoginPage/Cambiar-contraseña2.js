import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';

const ResetPassword = () => {
  const { userId } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/restablecer-contraseña`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, password: newPassword }),
      });

      if (response.ok) {
        setMessage('Contraseña restablecida con éxito. Puedes iniciar sesión.');
      } else {
        setError('Hubo un problema al restablecer la contraseña.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error en la conexión.');
    }
  };

  return (
    <div>
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleReset}>
        <div>
          <input
            type="password"
            placeholder="Nueva Contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Restablecer Contraseña</button>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </form>
    </div>
  );
};

export default ResetPassword;
