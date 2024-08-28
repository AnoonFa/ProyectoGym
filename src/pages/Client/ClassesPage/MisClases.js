import React, { useContext, useState, useEffect } from 'react';
import { useAuth } from '../../../context/RoleContext';
import { ClassesContext } from '../../../context/ClasesContext';
import { useNavigate } from 'react-router-dom';
import './MisClases.css';

const MisClases = () => {
  const { classes } = useContext(ClassesContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const currentDate = new Date();

  // Filtrar clases según si el usuario está inscrito en ellas
  useEffect(() => {
    if (user.role === 'client') {
      const userClasses = classes.filter(clase =>
        clase.inscritos && clase.inscritos.some(inscrito => inscrito.email === user.email)
      );
      setFilteredClasses(userClasses);
    }
  }, [classes, user]);

  // Clases futuras (actuales)
  const currentClasses = filteredClasses.filter(clase => new Date(clase.fecha) >= currentDate);

  // Clases pasadas (historial)
  const pastClasses = filteredClasses.filter(clase => new Date(clase.fecha) < currentDate);

  // Controlar la visualización de clases pasadas
  const classesToShow = showMore ? pastClasses : pastClasses.slice(0, 3);

  return (
    <div className="mis-clases">
      <h1>Mis Clases</h1>

      <h2>Clases Actuales</h2>
      {currentClasses.length > 0 ? (
        currentClasses.map(clase => (
          <div key={clase.id} className="class-item current-class">
            <h2>{clase.nombre}</h2>
            <p><strong>Coach:</strong> {clase.entrenador}</p>
            <p><strong>Hora:</strong> {clase.hora}</p>
            <p><strong>Día:</strong> {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][clase.day]}</p>
            <button onClick={() => navigate(`/ClassDetail/${clase.nombre}`)}>Ver Detalles</button>
          </div>
        ))
      ) : (
        <p className='no-current-classes'>No tienes clases actuales.</p>
      )}

      <h2>Historial de Clases</h2>
      {classesToShow.length > 0 ? (
        <>
          {classesToShow.map(clase => (
            <div key={clase.id} className="class-item past-class">
              <h2>{clase.nombre}</h2>
              <p><strong>Coach:</strong> {clase.entrenador}</p>
              <p><strong>Hora:</strong> {clase.hora}</p>
              <p><strong>Día:</strong> {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][clase.day]}</p>
              <button onClick={() => navigate(`/ClassDetail/${clase.nombre}`)}>Ver Detalles</button>
            </div>
          ))}
          {pastClasses.length > 3 && (
            <button className="show-more-button" onClick={() => setShowMore(!showMore)}>
              {showMore ? 'Mostrar Menos' : 'Mostrar Más'}
            </button>
          )}
        </>
      ) : (
        <p className='no-past-classes'>No tienes clases en tu historial.</p>
      )}
    </div>
  );
};

export default MisClases;
