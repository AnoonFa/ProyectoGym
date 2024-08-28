import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ClasesDetailsPage.css';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import CalendarClases from '../../../components/VerClases/VerClases';
import clasesImg from '../../../assets/images/iaClases.jpg';
import { useAuth } from '../../../context/RoleContext';
import { ClassesContext } from '../../../context/ClasesContext';

const ClassDetail = () => {
  const { className } = useParams();
  const [classDetail, setClassDetail] = useState(null);
  const [showInscritos, setShowInscritos] = useState(false);
  const { user } = useAuth();
  const { updateClass } = useContext(ClassesContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/clases?nombre=${className}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          setClassDetail(data[0]);
        }
      })
      .catch(error => console.error('Error cargando los detalles de la clase:', error));
  }, [className]);

  // Verificar si el usuario está inscrito en la clase
  const isUserEnrolled = classDetail?.inscritos?.some(inscrito => 
    inscrito?.email?.trim().toLowerCase() === user?.email?.trim().toLowerCase()
  );

  const handleReservation = () => {
    if (classDetail.cuposDisponibles > 0) {
      navigate('/Checkout', {
        state: {
          purchaseType: 'class',
          selectedClass: classDetail
        }
      });
    } else {
      alert('No hay cupos disponibles');
    }
  };

  const handleCancelarInscripcion = () => {
    if (window.confirm('¿Estás seguro de que deseas cancelar tu inscripción?')) {
      const updatedClass = {
        ...classDetail,
        cuposDisponibles: classDetail.cuposDisponibles + 1,
        inscritos: classDetail.inscritos.filter(inscrito => 
          inscrito?.email?.trim().toLowerCase() !== user?.email?.trim().toLowerCase()
        )
      };

      fetch(`http://localhost:3001/clases/${classDetail.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedClass)
      })
        .then(() => {
          setClassDetail(updatedClass);
          updateClass(updatedClass);  // Actualizar el contexto
          alert('Tu inscripción ha sido cancelada');
        })
        .catch(error => console.error('Error cancelando la inscripción:', error));
    }
  };

  const handleCancelarClase = () => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta clase?')) {
      fetch(`http://localhost:3001/clases/${classDetail.id}`, {
        method: 'DELETE',
      })
        .then(() => {
          alert(`La clase "${className}" ha sido cancelada.`);
          navigate('/');
        })
        .catch(error => console.error('Error cancelando la clase:', error));
    }
  };

  if (!classDetail) {
    return (
      <>
        <Header />
        <div className='no-encontrada'>
          <div className='container'>
            <h2>Clase no encontrada</h2>
            <p>La clase {className} no se encuentra en nuestra base de datos.</p>
          </div>
        </div>
        <CalendarClases />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="class-detail">
        <div className="class-content">
          <img src={clasesImg} alt="Imagen de clases" className="class-image" />
          <div className="class-info">
            <h1>{classDetail.nombre}</h1>
            <p><strong>Coach:</strong> {classDetail.entrenador}</p>
            <p><strong>Hora:</strong> {classDetail.hora}</p>
            <p><strong>Día:</strong> {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][classDetail.day]}</p>
            <p><strong>Franja horaria:</strong> {classDetail.timeSlot}</p>
            <p><strong>Descripción:</strong> {classDetail.descripcion}</p>
            <p><strong>Precio:</strong> ${classDetail.precio}</p>
            {user.role === 'admin' && (
              <>
                <button className="cancelar-button" onClick={handleCancelarClase}>Cancelar Clase</button>
                <button className="buy-button" onClick={() => setShowInscritos(!showInscritos)}>
                  {showInscritos ? 'Ocultar Inscritos' : 'Ver Inscritos'}
                </button>
              </>
            )}
          </div>
          <div className="class-reservations">
            <h1>Reservaciones</h1>
            <p><strong>Cupos Totales:</strong> {classDetail.totalCupos}</p>
            <p><strong>Cupos Disponibles:</strong> {classDetail.cuposDisponibles}</p>
            {user.role === 'client' && (
              <div className="reservation-buttons">
                {!isUserEnrolled ? (
                  <button className="buy-button" onClick={handleReservation}>Reservar</button>
                ) : (
                  <button className="cancelar-button" onClick={handleCancelarInscripcion}>Cancelar Inscripción</button>
                )}
              </div>
            )}
          </div>
        </div>
        {showInscritos && (
          <div className="inscritos-list">
            <h2>Clientes Inscritos:</h2>
            <ul>
              {classDetail.inscritos && classDetail.inscritos.length > 0 ? (
                classDetail.inscritos.map((inscrito, index) => (
                  <li key={index}>
                    <p><strong>Nombre:</strong> {inscrito.nombre}</p>
                    <p><strong>Correo:</strong> {inscrito.email}</p>
                    <p><strong>Fecha de inscripción:</strong> {inscrito.fechaInscripcion}</p>
                  </li>
                ))
              ) : (
                <p>No hay inscritos para esta clase.</p>
              )}
            </ul>
          </div>
        )}
      </div>
      <CalendarClases />
      <Footer />
    </>
  );
};

export default ClassDetail;
