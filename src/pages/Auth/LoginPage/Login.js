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

  const handleLogin = async () => {
    if (correo && password) {
      try {
        const roles = ['admin', 'employee', 'client'];
        let userFound = null;

        for (const role of roles) {
          const response = await fetch(`http://localhost:3001/${role}?correo=${correo}`);
          const data = await response.json();

          if (Array.isArray(data) && data.length > 0) {
            if (data.some(user => user.password === password)) {
              userFound = {
                role,
                username: data[0].usuario,
                tipoCuerpo: data[0].tipoCuerpo,
                id: data[0].id,
                nombre: data[0].nombre,
                apellido: data[0].apellido,
                correo: data[0].correo,
                tickets: data[0].tickets || 0 // Asumiendo que los tickets se guardan en la base de datos
              };
              break;
            }
          }
        }

        if (userFound) {
          setUser(userFound);
          localStorage.setItem('user', JSON.stringify(userFound)); // Guardar en localStorage
          if (userFound.role === 'client') {
            navigate('/ClienteIndex');
          } else if (userFound.role === 'admin' || userFound.role === 'employee') {
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
    navigate("/"); // Limpiar el mensaje del alert al cerrarlo
  };

  // Define la función togglePasswordVisibility
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
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
                  onClick={togglePasswordVisibility} // Usa la función definida
                />
              </div>
              {/*<div className="recordar">
                <label><input type="checkbox" /> Recordar sesión</label>
                <a href='#'>¿Olvido su contraseña?</a>
              </div>*/}
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
