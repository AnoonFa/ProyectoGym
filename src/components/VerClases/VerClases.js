import React, { useState, useEffect, useContext } from 'react'; 
import './VerClases.css';
import { useAuth } from '../../context/RoleContext'; 
import { useNavigate } from 'react-router-dom';
import { ClassesContext } from '../../context/ClasesContext';
import MisClases from '../../pages/Client/ClassesPage/MisClases';

const CalendarClases = () => {
  const { classes, setClasses } = useContext(ClassesContext); // Usar el contexto de clases
  const { user } = useAuth();  // Usamos el contexto de autenticación
  const navigate = useNavigate();


  // Estado para manejar los días de la semana
  const [days, setDays] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showMisClases, setShowMisClases] = useState(false); // Estado para controlar la visibilidad de MisClases
  const [employees, setEmployees] = useState([]); // Estado para almacenar la lista de entrenadores

  // Estado para manejar los datos del nuevo formulario de clase
  const [newClass, setNewClass] = useState({
    nombre: '',
    entrenador: '',
    hora: '',
    day: '',
    timeSlot: '',
    descripcion: '',
    totalCupos: '',   
  });

  // Cargar clases desde el servidor local usando json-server
  useEffect(() => {
    fetch('http://localhost:3001/clases')
      .then(response => response.json())
      .then(data => setClasses(data))
      .catch(error => console.error('Error cargando las clases:', error));
  }, [setClasses]);

  // Cargar entrenadores desde el servidor local usando json-server
  useEffect(() => {
    fetch('http://localhost:3001/employee')  // Asumiendo que los entrenadores están bajo el rol de employee
      .then(response => response.json())
      .then(data => setEmployees(data))
      .catch(error => console.error('Error cargando los entrenadores:', error));
  }, []);

  // useEffect para calcular los días de la semana que se muestran en el calendario
  useEffect(() => {
    const today = new Date(); 
    const daysOfWeek = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
    const updatedDays = [];

    // Calculamos los días de la semana para el día actual
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      updatedDays.push({
        day: daysOfWeek[date.getDay()],
        date: date.getDate()
      });
    }
    setDays(updatedDays);
  }, []);

  // Maneja el envío del formulario para agregar una nueva clase
  const handleAddClass = (e) => {
    e.preventDefault();
    // Agregamos la nueva clase al estado de las clases
    setClasses([...classes, newClass]);
    // Reseteamos el formulario
    setNewClass({
      nombre: '',
      entrenador: '',
      hora: '',
      day: '',
      timeSlot: '',
      descripcion: '',
      totalCupos: '',   
    });
    setShowForm(false); // Ocultar el formulario después de agregar la clase
  };
  
  // Maneja la eliminación de una clase existente
  const handleDeleteClass = (e, className) => {
    e.stopPropagation();
    // Filtramos las clases para eliminar la clase seleccionada
    if (window.confirm('¿Estás seguro de que deseas cancelar esta clase?')) {
      setClasses(classes.filter((classItem) => classItem.nombre !== className));
      alert(`La clase "${className}" ha sido cancelada.`);
    }
  };

  // Navega a la página de la clase al hacer clic
  const handleClassClick = (className) => {
    navigate(`/ClassDetail/${className}`);
  };

  const handleMisClasesClick = () => {
    setShowMisClases(!showMisClases); // Alterna la visibilidad de MisClases
  };


  return (
    <div className="calendar-container">
      <div className="header-container">
        <h2>Clases</h2>
        <div className="Filter">
          {(user.role === 'admin' || user.role === 'employee') && (
            <>
              <button onClick={() => setShowForm(!showForm)} className="AddButtonLink">
                {showForm ? 'Cancelar' : 'Añadir Clase'}
              </button>
              <button onClick={handleMisClasesClick} className="AddButtonLink">
                {showMisClases ? 'Cerrar' : 'Mis Clases'}
              </button>
            </>
          )}
          {user.role === 'client' && (
            <>
              <button onClick={handleMisClasesClick} className="AddButtonLink">
                {showMisClases ? 'Cerrar' : 'Mis Clases'}
              </button>
            </>
          )}
        </div>
      </div>
  
      <div className="header-description">
        <p>Aquí puedes encontrar una lista de todas las clases programadas. Usa el filtro para buscar clases específicas y inscríbete a nuestras clases. {user.role === 'admin' && <p>Verifica quién está inscrito en las clases, cancela y agrega nuevas.</p>}</p>
      </div>
  
      {showMisClases ? (
        <MisClases /> 
      ) : (
        <div className="calendar-wrapper">
          <table className="calendar-table">
            <thead className="calendar-header">
              <tr>
                <td></td>
                {days.map((day, index) => (
                  <th key={index} className='day-th'>
                    <div className={`containerDayCalendar ${index === 0 ? 'colorPrimCalendar' : 'colorSecuCalendar'}`}>
                      <span>{`${day.day} ${day.date}`}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='calendar-body'>
              {['05:00 AM', '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'].map((time, index) => (
                <tr key={index}>
                  <th className='time-th'>{time}</th>
                  {Array(7).fill(null).map((_, idx) => (
                    <td key={idx} style={{ position: 'relative' }}>
                      {classes
                        .filter((classItem) => classItem.timeSlot === time && classItem.day === idx)
                        .map((filteredClass, classIndex) => (
                          <div key={classIndex} className="itemCalendarLesson" onClick={() => handleClassClick(filteredClass.nombre)}>
                            <h5>{filteredClass.nombre}</h5>
                            <p className="coachItemLesson">{filteredClass.entrenador}</p>
                            <p className="typeItemLesson">{filteredClass.hora}</p>
                          </div>
                        ))}
                      {classes.filter((classItem) => classItem.timeSlot === time && classItem.day === idx).length === 0 && (
                        <div className="empty-slot"></div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
  
      {showForm && (
        <form onSubmit={handleAddClass} className="add-class-form">
          <input
            type="text"
            placeholder="Nombre de la clase"
            value={newClass.nombre}
            onChange={(e) => setNewClass({ ...newClass, nombre: e.target.value })}
            required
          />
          <select
            value={newClass.entrenador}
            onChange={(e) => setNewClass({ ...newClass, entrenador: e.target.value })}
            required
          >
            <option value="" disabled>Selecciona un entrenador</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.usuario}>
                {employee.usuario}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Franja horaria"
            value={newClass.hora}
            onChange={(e) => setNewClass({ ...newClass, hora: e.target.value })}
            required
          />  
          <select
            value={newClass.day}
            onChange={(e) => setNewClass({ ...newClass, day: parseInt(e.target.value) })}
            required
          >
            <option value="" disabled>Día</option>
            <option value="0">Domingo</option>
            <option value="1">Lunes</option>
            <option value="2">Martes</option>
            <option value="3">Miércoles</option>
            <option value="4">Jueves</option>
            <option value="5">Viernes</option>
            <option value="6">Sábado</option>
          </select>
          <select
            value={newClass.timeSlot}
            onChange={(e) => setNewClass({ ...newClass, timeSlot: e.target.value })}
            required
          >
            <option value="" disabled>Hora</option>
            {['05:00 AM', '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'].map((timeSlot, index) => (
              <option key={index} value={timeSlot}>{timeSlot}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Descripción"
            value={newClass.descripcion}
            onChange={(e) => setNewClass({ ...newClass, descripcion: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Total de Cupos"
            value={newClass.totalCupos}
            onChange={(e) => setNewClass({ ...newClass, totalCupos: e.target.value })}
            required
          />
          <button type="submit">Agregar Clase</button>
        </form>
      )}
    </div>
  );
}

export default CalendarClases;
