import React from 'react';
import { useNavigate } from 'react-router-dom';
import './header.css';
import logo from '../../assets/images/David&GoliatLogo.png';
import logoutIcon from '../../assets/icons/LogOut.png';
import { useAuth } from '../../context/RoleContext';

const Header = () => {
  const { user, setUser } = useAuth(); // Usamos el contexto de autenticación
  const navigate = useNavigate();

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
              <button onClick={() => handleNavigation('/ClasesPage/')} className="Profile">Clases</button>
              <button onClick={() => handleNavigation('/planesPage')} className="Profile">Planes</button>
              <button onClick={() => handleNavigation('/RutinaAdminIndex')} className="Profile">Rutinas</button>
              <button onClick={() => handleNavigation('/VerCliente')} className="Profile">Cliente</button>
              <button onClick={() => handleNavigation('/ProductsPage')} className="Profile">Productos</button>
              <button onClick={() => handleNavigation('/Ticketera')} className="Profile">Ticketera</button>
            </>
          )}
          {/* Enlaces para Empleado si esta autenticado */}
          {user.role === 'employee' && (
            <>
              <button onClick={() => handleNavigation('/ClasesPage/')} className="Profile">Clases</button>
              <button onClick={() => handleNavigation('/planesPage')} className="Profile">Planes</button>
              <button onClick={() => handleNavigation('/RutinaAdminIndex')} className="Profile">Rutinas</button>
              <button onClick={() => handleNavigation('/ProductsPage')} className="Profile">Productos</button>
              <button onClick={() => handleNavigation('/Ticketera')} className="Profile">Ticketera</button>
            </>
          )}
          {/* Enlaces para Cliente si esta autenticado */}
          {user.role === 'client' && (
            <>
              <button onClick={() => handleNavigation('/ClasesPage/')} className="Profile">Clases</button>
              <button onClick={() => handleNavigation('/planesPage/')} className="Profile">Planes</button>
              <button onClick={() => handleNavigation('/ProductsPage/')} className="Profile">Productos</button>
              <button onClick={() => handleNavigation('/RutinasCliente/')} className="Profile">Rutinas</button>
              <button onClick={() => handleNavigation('/Ticketera')} className="Profile">Ticketera</button>
            </>
          )}
          {user.role === 'nolog' && (
            <>
              <button onClick={() => handleNavigation('/ClasesPage/')} className="Profile">Clases</button>
              <button onClick={() => handleNavigation('/planesPage/')} className="Profile">Planes</button>
              <button onClick={() => handleNavigation('/ProductsPage/')} className="Profile">Productos</button>
              <button onClick={() => handleNavigation('/Ticketera')} className="Profile">Ticketera</button>
            </>
          )}
        </div>

        <div className="login-container">
          {/* Botón de login/logout basado en si el usuario está autenticado o no */}
          {user.role === 'nolog' ? (
            <button onClick={handleLoginClick} className="LoginButtonLink">Iniciar Sesión</button>
          ) : (
            <button onClick={handleLogoutClick} className="LogoutButtonLink">
              <img src={logoutIcon} alt="Logout" className="LogoutIcon" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;

