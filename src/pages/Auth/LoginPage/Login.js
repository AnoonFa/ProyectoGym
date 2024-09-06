import React, { useState } from 'react';
import './Login.css';
import { useAuth } from '../../../context/RoleContext';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import eyeIcon from '../../../assets/icons/OjoAbierto.png';
import eyeOffIcon from '../../../assets/icons/OjoBloqueado.png';
import Alert from '@mui/material/Alert';  // Importar Alert de Material-UI

const Login = () => {
  const { setUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const handleLogin = async () => {
    if (username && password) {
      try {
        const roles = ['admin', 'employee', 'client'];
        let userFound = null;
        let userExists = false;

        for (const role of roles) {
          const response = await fetch(`http://localhost:3001/${role}?usuario=${username}`);
          const data = await response.json();

          if (data.length > 0) {
            userExists = true;
            // Check if the provided password matches
            if (data.some(user => user.contraseña === password)) {
              userFound = {
                role,
                username: data[0].usuario,
                tipoCuerpo: data[0].tipoCuerpo,
                id: data[0].id
              };
              break;
            }
          }
        }

        if (userFound) {
          setUser({
            role: userFound.role,
            username: userFound.username,
            tipoCuerpo: userFound.tipoCuerpo,
            id: userFound.id
          });
          if (userFound.role === 'client') {
            navigate('/ClienteIndex');
          } else if (userFound.role === 'admin' || userFound.role === 'employee') {
            navigate('/adminEmpleadoIndex');
          }
        } else if (userExists) {
          setLoginError('Contraseña incorrecta.');
        } else {
          setLoginError('Usuario incorrecto.');
        }
      } catch (error) {
        console.error('Error:', error);
        setLoginError('Hubo un problema al autenticarte.');
      }
    } else {
      setLoginError('Por favor, completa todos los campos correctamente.');
    }
  };

  return (
    <div className="fondo-wrapper">
      <div className="fondo">
        <div className='contenedor-form login'>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <h2>Iniciar sesión</h2>
            <div className="contenedor-input">
              <input
                type="text"
                placeholder='Usuario'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            <div className="recordar">
              <label><input type="checkbox" /> Recordar sesión</label>
              <a href='#'>¿Olvido su contraseña?</a>
            </div>
            <button type="submit" className="btn">Iniciar sesión</button>
            {loginError && <Alert className='error-message' severity="error">{loginError}</Alert>} 
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
