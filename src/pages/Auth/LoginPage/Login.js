import React, { useState } from 'react';
import './Login.css';
import { useAuth } from '../../../context/RoleContext';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import eyeIcon from '../../../assets/icons/OjoAbierto.png';
import eyeOffIcon from '../../../assets/icons/OjoBloqueado.png';
import logo from '../../../assets/images/David&GoliatLogo.png';
import Alert from '@mui/material/Alert';

const Login = () => {
  const { setUser } = useAuth();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const [userFound, setUserFound] = useState(null);

  const handleLogin = async () => {
    if (correo && password) {
        try {
            const response = await fetch('http://localhost:3005/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, password }),
            });

            if (response.ok) {
                const foundUser = await response.json();
                setUserFound(foundUser);

                if (!foundUser.habilitado) {
                    navigate('/terms', { state: { user: foundUser } });
                    return;
                }

                setUser(foundUser);
                localStorage.setItem('user', JSON.stringify(foundUser));

                // Redirección según el rol del usuario
                if (foundUser.role === 'client') {
                    navigate('/ClienteIndex');
                } else if (foundUser.role === 'admin' || foundUser.role === 'employee') {
                    navigate('/adminEmpleadoIndex');
                }
            } else {
                setLoginError('Usuario o contraseña incorrectos.');
            }
        } catch (error) {
            console.error('Error:', error);
            setLoginError('Hubo un problema al autenticarte.');
        }
    } else {
        setLoginError('Por favor, completa todos los campos correctamente.');
    }
};
  

  

  const handleVolverIndex = () => {
    navigate("/");
  };

  const handleForgotPassword = () => {
    navigate('/cambiar-contraseña');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const handleRegistroClick = () => {
    navigate('/ClienteForm/'); 
  };
  return (
    <div className="app-container-login">
      <div className="fondo-wrapper">
        <div className="fondo">
          <img onClick={handleVolverIndex} className='ImagenLogo-login' src={logo} alt="Logo" />
          <div className='contenedor-form-login'>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <h2>Iniciar sesión</h2>
              <div className="contenedor-input">
                <input
                  type="text"
                  placeholder='Correo'
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
                <FaUser className='icono' />
              </div>
              <div className="contenedor-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Contraseña'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <img
                  src={showPassword ? eyeIcon : eyeOffIcon}
                  alt="Toggle Password Visibility"
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility}
                />
              </div>
              <div className="links-container">
                  <p className="forgot-password" onClick={handleForgotPassword}>¿Olvidaste tu contraseña?</p>
                  <p className="register-link" onClick={handleRegistroClick}>Registrate</p>
              </div>
              <button type="submit" className="btn">Iniciar sesión</button>
              {loginError && <Alert className='error-message' severity="error">{loginError}</Alert>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;