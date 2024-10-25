import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import './ResetPassword.css';
import eyeIcon from '../../../assets/icons/OjoAbierto.png';
import eyeOffIcon from '../../../assets/icons/OjoBloqueado.png';

const ResetPassword = () => {
  const { userId } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const lengthValid = password.length >= 8 && password.length <= 20;

    return hasUpperCase && hasSpecialChar && hasNumber && lengthValid;
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('La contraseña debe tener entre 8 y 20 caracteres, incluir al menos una letra mayúscula, un carácter especial y un número.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/restablecer-contraseña', {
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

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(prevState => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prevState => !prevState);
  };

  return (
    <div className="blinking-container-reset">
      <h2 className="h2-flashing-reset">Restablecer Contraseña</h2>
      <form className="form-ninja-reset" onSubmit={handleReset}>
        <div>
          <input
            className="input-squid-reset"
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Nueva Contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <img
            src={showNewPassword ? eyeIcon : eyeOffIcon}
            alt="Toggle Password Visibility"
            className="password-toggle-icon-reset"
            onClick={toggleNewPasswordVisibility}
          />
        </div>
        <div>
          <input
            className="input-squid-reset"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <img
            src={showConfirmPassword ? eyeIcon : eyeOffIcon}
            alt="Toggle Password Visibility"
            className="password-toggle-icon-reset"
            onClick={toggleConfirmPasswordVisibility}
          />
        </div>
        <button className="button-frog-reset" type="submit">Restablecer Contraseña</button>
        {message && <Alert className="alert-magic-reset" severity="success">{message}</Alert>}
        {error && <Alert className="alert-magic-reset" severity="error">{error}</Alert>}
      </form>
    </div>
  );
};

export default ResetPassword;
