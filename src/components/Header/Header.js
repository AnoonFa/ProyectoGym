import React, { useState } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import './header.css';
import logo from '../../assets/images/David&GoliatLogo.png';
import logoutIcon from '../../assets/icons/LogOut.png';
import { useAuth } from '../../context/RoleContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserCircle, faUsers, faDumbbell, faBox, faTicketAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


const Header = () => {
  const { user, setUser } = useAuth(); // Usamos el contexto de autenticación
  const navigate = useNavigate();
  const location = useLocation(); // Obtiene la ruta actual
  const [showProfileMenu, setShowProfileMenu] = useState(false); // Estado para el menú del perfil



  const handleLoginClick = () => {
    navigate('/LoginP');
  };

  const handleLogoutClick = () => {
    setUser({ role: 'nolog' }); // Restablecer el rol del usuario al rol por defecto
    navigate('/'); // Redirigir al usuario a la página de inicio después de cerrar sesión
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  
  const handleProfileClick = () => {
    setShowProfileMenu((prev) => !prev); // Alterna el estado del menú
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).slice(-2);
    }
    return color;
  };

  return (
    // Header con logo, botón de inicio de sesión, enlaces a las páginas y botón de logout
    <nav className="header">
      <div className="Rectangle100">
        <div className="DavidGoliat">
          {user.role === 'admin' && (
            <a href="#" className="logout" onClick={() => handleNavigation('/adminEmpleadoIndex')}>
              <img src={logo} alt="Logo" className="LogoImage" />
            </a>
          )}
          {user.role === 'employee' && (
            <a href="#" className="logout" onClick={() => handleNavigation('/adminEmpleadoIndex')}>
              <img src={logo} alt="Logo" className="LogoImage" />
            </a>

          )}

          {user.role === 'client' && (
            <a href="#" className="logout" onClick={() => handleNavigation('/ClienteIndex')}>
              <img src={logo} alt="Logo" className="LogoImage" />
            </a>
          )}


          {user.role === 'nolog' && (
            <a href="#" className="logout" onClick={() => handleNavigation('/')}>
              <img src={logo} alt="Logo" className="LogoImage" />
            </a>
          )}
        </div>

        <div className="nav-links">

          {/* Enlaces para administrador si esta autenticado */}
          {user.role === 'admin' && (
            <>
              <button onClick={() => handleNavigation('/ClasesPage/')} className={`Profile ${isActive('/ClasesPage/')}`}>Clases</button>
              <button onClick={() => handleNavigation('/planesPage')} className={`Profile ${isActive('/planesPage')}`}>Planes</button>
              <button onClick={() => handleNavigation('/RutinaAdminIndex')} className={`Profile ${isActive('/RutinaAdminIndex')}`}>Rutinas</button>
              <button onClick={() => handleNavigation('/VerCliente')} className={`Profile ${isActive('/VerCliente')}`}>Cliente</button>
              <button onClick={() => handleNavigation('/ProductsPage')} className={`Profile ${isActive('/ProductsPage')}`}>Productos</button>
              <button onClick={() => handleNavigation('/Ticketera')} className={`Profile ${isActive('/Ticketera')}`}>Ticketera</button>
            </>
          )}
          {/* Enlaces para Empleado si esta autenticado */}
          {user.role === 'employee' && (
            <>
              <button onClick={() => handleNavigation('/ClasesPage/')} className={`Profile ${isActive('/ClasesPage/')}`}>Clases</button>
              <button onClick={() => handleNavigation('/planesPage')} className={`Profile ${isActive('/planesPage')}`}>Planes</button>
              <button onClick={() => handleNavigation('/RutinaAdminIndex')} className={`Profile ${isActive('/RutinaAdminIndex')}`}>Rutinas</button>
              <button onClick={() => handleNavigation('/ProductsPage')} className={`Profile ${isActive('/ProductsPage')}`}>Productos</button>
              <button onClick={() => handleNavigation('/Ticketera')} className={`Profile ${isActive('/Ticketera')}`}>Ticketera</button>
            </>
          )}
          {/* Enlaces para Cliente si esta autenticado */}
          {user.role === 'client' && (
            <>
              <button onClick={() => handleNavigation('/ClasesPage/')} className={`Profile ${isActive('/ClasesPage/')}`}>Clases</button>
              <button onClick={() => handleNavigation('/planesPage/')} className={`Profile ${isActive('/planesPage/')}`}>Planes</button>
              <button onClick={() => handleNavigation('/ProductsPage/')} className={`Profile ${isActive('/ProductsPage/')}`}>Productos</button>
              <button onClick={() => handleNavigation('/RutinasCliente/')} className={`Profile ${isActive('/RutinasCliente/')}`}>Rutinas</button>
              <button onClick={() => handleNavigation('/Ticketera')} className={`Profile ${isActive('/Ticketera')}`}>Ticketera</button>
            </>
          )}
          {user.role === 'nolog' && (
            <>
              <button onClick={() => handleNavigation('/ClasesPage/')} className={`Profile ${isActive('/ClasesPage/')}`}>Clases</button>
              <button onClick={() => handleNavigation('/planesPage/')} className={`Profile ${isActive('/planesPage/')}`}>Planes</button>
              <button onClick={() => handleNavigation('/ProductsPage/')} className={`Profile ${isActive('/ProductsPage/')}`}>Productos</button>
              <button onClick={() => handleNavigation('/Ticketera')} className={`Profile ${isActive('/Ticketera')}`}>Ticketera</button>
            </>
          )}
        </div>

        <div className="login-container">
          {user.role !== 'nolog' ? (
            <div className="profile-section">
              <div
                className="profile-avatar"
                style={{ backgroundColor: stringToColor(user.username) }}
                onClick={handleProfileClick}
              >
                {getInitials(user.username)} {/* Muestra la inicial */}
              </div>

              {showProfileMenu && (
                <div className="profile-menu">
                  {/* Botón de cerrar (X) en la esquina superior derecha */}
                  <button className="close-menu-btn" onClick={handleProfileClick}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>

                  {/* Correo del usuario justo encima de la foto de perfil */}
                  <p className="profile-email">{user.email}</p>
                  
                  {/* Imagen o inicial del usuario */}
                  <div className="profile-avatar-large" style={{ backgroundColor: stringToColor(user.username) }}>
                    {getInitials(user.username)}
                  </div>

                  {/* Mensaje de bienvenida */}
                  <p className="welcome-message">¡Hola, {user.username}!</p>

                  {/* Botón de editar perfil centrado */}
                  <button className="edit-profile-btn" onClick={() => navigate('/edit-profile')}>
                    Editar Perfil
                  </button>

                  {/* Menú de opciones con íconos */}
                  {user.role === 'admin' && (
                    <>
                      <button onClick={() => navigate('/ver-clases')} className="menu-option">
                        <FontAwesomeIcon icon={faUsers} className="menu-icon" /> Ver Clases de Usuarios
                      </button>
                      <button onClick={() => navigate('/gestion-clientes')} className="menu-option">
                        <FontAwesomeIcon icon={faUserCircle} className="menu-icon" /> Gestión de Clientes
                      </button>
                      <button onClick={() => navigate('/gestion-rutinas')} className="menu-option">
                        <FontAwesomeIcon icon={faDumbbell} className="menu-icon" /> Gestión de Rutinas
                      </button>
                      <button onClick={() => navigate('/gestion-productos')} className="menu-option">
                        <FontAwesomeIcon icon={faBox} className="menu-icon" /> Gestión de Productos
                      </button>
                      <button onClick={() => navigate('/Ticketera')} className="menu-option">
                        <FontAwesomeIcon icon={faTicketAlt} className="menu-icon" /> Ticketera
                      </button>
                    </>
                  )}

                  {user.role !== 'admin' && (
                    <>
                      <button onClick={() => navigate('/ClasesPage/')} className="menu-option">
                        <FontAwesomeIcon icon={faDumbbell} className="menu-icon" /> Mis Clases
                      </button>
                      <button onClick={() => navigate('/RutinasCliente/')} className="menu-option">
                        <FontAwesomeIcon icon={faDumbbell} className="menu-icon" /> Mis Rutinas
                      </button>
                      <button onClick={() => navigate('/Ticketera')} className="menu-option">
                        <FontAwesomeIcon icon={faTicketAlt} className="menu-icon" /> Mi Ticketera
                      </button>
                      <button onClick={() => navigate('/Plan')} className="menu-option">
                        <FontAwesomeIcon icon={faBox} className="menu-icon" /> Mi Plan
                      </button>
                    </>
                  )}

                  {/* Botón de cerrar sesión */}
                  <button className="logout-btn" onClick={handleLogoutClick}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={handleLoginClick} className="LoginButtonLink">
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;

