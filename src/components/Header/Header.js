import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import './header.css';
import logo from '../../assets/images/David&GoliatLogo.png';
import logoutIcon from '../../assets/icons/LogOut.png';
import { useAuth } from '../../context/RoleContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserCircle, faUsers, faDumbbell, faBox, faTicketAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import FullScreenEditProfileModal from '../editProfile/PerfilEditarModal';


const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  console.log('Usuario en Header:', user);

  
  const getDisplayName = () => {
    return user?.username || 'Usuario';
  };


  useEffect(() => {
    // Log para verificar si el rol del usuario ha cambiado
    console.log('Rol del usuario actualizado:', user.role);
  }, [user]);

  const handleLoginClick = () => {
    navigate('/LoginP');
  };
  
  const handleLogoutClick = () => {
    setUser({ role: 'nolog' }); // Restablece el rol del usuario al valor predeterminado
    localStorage.removeItem('user'); // Borra los datos del usuario de localStorage
    navigate('/'); // Redirige a la página de inicio después de cerrar sesión
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
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const stringToColor = (str) => {
    if (!str) {  // Si la cadena es undefined, null, o vacía
      return '#000000'; // Devuelve un color por defecto
    }
  
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

  const handleEditProfileClick = () => {
    setShowModal(true); // Mostrar el modal
  };

  const handleModalClose = () => {
    setShowModal(false); // Cerrar el modal
  };

  const handleSaveProfile = (updatedData) => {
    // Aquí puedes hacer la lógica para actualizar los datos del usuario
    console.log('Datos actualizados:', updatedData);
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
              <button onClick={() => handleNavigation('/VerCliente')} className={`Profile ${isActive('/VerCliente')}`}>Buscador</button>
              <button onClick={() => handleNavigation('/ProductsPage')} className={`Profile ${isActive('/ProductsPage')}`}>Productos</button>
              <button onClick={() => handleNavigation('/AdminConfirmacion')} className={`Profile ${isActive('/Ticketera')}`}>Ticketera</button>
            </>
          )}
          {/* Enlaces para Empleado si esta autenticado */}
          {user.role === 'employee' && (
            <>
              <button onClick={() => handleNavigation('/ClasesPage/')} className={`Profile ${isActive('/ClasesPage/')}`}>Clases</button>
              <button onClick={() => handleNavigation('/planesPage')} className={`Profile ${isActive('/planesPage')}`}>Planes</button>
              <button onClick={() => handleNavigation('/RutinaAdminIndex')} className={`Profile ${isActive('/RutinaAdminIndex')}`}>Rutinas</button>
              <button onClick={() => handleNavigation('/ProductsPage')} className={`Profile ${isActive('/ProductsPage')}`}>Productos</button>
              <button onClick={() => handleNavigation('/AdminConfirmacion')} className={`Profile ${isActive('/Ticketera')}`}>Ticketera</button>
            </>
          )}
          {/* Enlaces para Cliente si esta autenticado */}
          {user.role === 'client' && (
            <>
              <button onClick={() => handleNavigation('/ClasesPage/')} className={`Profile ${isActive('/ClasesPage/')}`}>Clases</button>
              <button onClick={() => handleNavigation('/planesPage/')} className={`Profile ${isActive('/planesPage/')}`}>Planes</button>
              <button onClick={() => handleNavigation('/ProductsPage/')} className={`Profile ${isActive('/ProductsPage/')}`}>Productos</button>
              <button onClick={() => handleNavigation('/RutinasCliente/')} className={`Profile ${isActive('/RutinasCliente/')}`}>Rutinas</button>
              <button onClick={() => handleNavigation('/VerTicketera')} className={`Profile ${isActive('/VerTicketera')}`}>Ticketera</button>
            </>
          )}
          {user.role === 'nolog' && (
            <>
              <button onClick={() => handleNavigation('/ClasesPage/')} className={`Profile ${isActive('/ClasesPage/')}`}>Clases</button>
              <button onClick={() => handleNavigation('/planesPage/')} className={`Profile ${isActive('/planesPage/')}`}>Planes</button>
              <button onClick={() => handleNavigation('/ProductsPage/')} className={`Profile ${isActive('/ProductsPage/')}`}>Productos</button>
              {/* <button onClick={() => handleNavigation('/Ticketera')} className={`Profile ${isActive('/Ticketera')}`}>Ticketera</button> */}
            </>
          )}
        </div>

        <div className="login-container">
          {user.role !== 'nolog' ? (
            <div className="profile-section">
              <div
                className="profile-avatar"
                style={{ backgroundColor: stringToColor(getDisplayName()) }}
                onClick={handleProfileClick}
              >
                {getInitials(getDisplayName())}
              </div>

              {showProfileMenu && (
                <div className="profile-menu">
                  {/* Botón de cerrar (X) en la esquina superior derecha */}
                  <button className="close-menu-btn" 
                    onClick={handleProfileClick}
                    title='boton para cerrar perfil'
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>

                  {/* Correo del usuario justo encima de la foto de perfil */}
                  <p className="profile-email">{user.correo}</p>
                  
                  {/* Imagen o inicial del usuario */}
                  <div className="profile-avatar-large" 
                    style={{ backgroundColor: stringToColor(getDisplayName()) }}
                  >
                    {getInitials(getDisplayName())}
                  </div>

                  {/* Mensaje de bienvenida */}
                  <p className="welcome-message">¡Hola, {getDisplayName()}!</p>

                  {/* Botón de editar perfil centrado */}
                  {user.role === 'client' && (

                  <button className="edit-profile-btn" onClick={handleEditProfileClick}>
                    Editar Perfil
                  </button>
                  )}
                  {showModal && (
                    <FullScreenEditProfileModal 
                      user={user} 
                      onClose={handleModalClose} 
                      onSave={handleSaveProfile} 
                    />
                  )}

                  {/* Menú de opciones con íconos */}
                  {user.role === 'admin' && (
                    <>
                      
                    </>
                  )}

                  {user.role === 'client' && (
                    <>
                      
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

