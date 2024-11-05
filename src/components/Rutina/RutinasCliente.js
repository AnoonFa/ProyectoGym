import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/RoleContext';
import { useNavigate } from 'react-router-dom';
import './RutinaAdminIndex.css';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import EjercicioModal from './Modal/EjercicioModal';
import Relleno from '../Relleno/Relleno';

/* Images for Exercise Types */

// Ectomorfo
import curlBicepsBarraZImg from '../../assets/images/Ejercicios/Ectomorfo/curl-de-biceps-con-barra-en-z-y-w.png';
import curlBicepsMartilloImg from '../../assets/images/Ejercicios/Ectomorfo/curl-de-biceps-martillo.png';
import elevacionesLateralesImg from '../../assets/images/Ejercicios/Ectomorfo/elevacion-lateral.png';
import elevacionesLateralesconBandaElástica from '../../assets/images/Ejercicios/Ectomorfo/Elevaciones-Laterales-con-Banda-Elástica.png';
import extensióndetrícepsporencimadelacabeza from '../../assets/images/Ejercicios/Ectomorfo/Extensión-de-tríceps-por-encima-de-la-cabeza.jpg'; 
import pressfrances from '../../assets/images/Ejercicios/Ectomorfo/press-frances-mancuernas.jpg';
import pressFrancésconBarra from '../../assets/images/Ejercicios/Ectomorfo/Press-Francés-con-Barra.png';
import remoalmentón from '../../assets/images/Ejercicios/Ectomorfo/Remo-al-mentón-con-barra.png';
import zancadasconmancuernas from '../../assets/images/Ejercicios/Ectomorfo/zancadas-con-mancuernas.png';
import zancadasconSalto from '../../assets/images/Ejercicios/Ectomorfo/Zancadas-con-Salto.png';
import zancadas from '../../assets/images/Ejercicios/Ectomorfo/Zancadas.png';
import curldebícepsconbarraW from '../../assets/images/Ejercicios/Ectomorfo/Curl-de-bíceps-con-barra-W.png';

// Mesomorfo
import dominadasconAgarreAnchoyEstrecho from '../../assets/images/Ejercicios/Mesomorfo/dominadas-con-Agarre-Ancho-y-Estrecho.png';
import dominadasconPesoAñadido from '../../assets/images/Ejercicios/Mesomorfo/Dominadas-con-Peso-Añadido.png';
import dominadas from '../../assets/images/Ejercicios/Mesomorfo/dominadas.jpg';
import pesomuertoconbarraconvencional from '../../assets/images/Ejercicios/Mesomorfo/peso-muerto-con-barra-convencional.png';
import pesomuertosumo from '../../assets/images/Ejercicios/Mesomorfo/peso-muerto-sumo.png';
import pesomuerto from '../../assets/images/Ejercicios/Mesomorfo/peso-muerto.png';
import pressdebancainclinado from '../../assets/images/Ejercicios/Mesomorfo/press-de-banca-inclinado.png';
import presspectoraldeclinado from '../../assets/images/Ejercicios/Mesomorfo/press-pectoral-declinado.png';
import pressbancaagarrecerrado from '../../assets/images/Ejercicios/Mesomorfo/pressbanca-agarre-cerrado.png';
import RemoconBarraconAgarreInvertido from '../../assets/images/Ejercicios/Mesomorfo/Remo-con-Barra-con-Agarre-Invertido.jpg';
import remoconbarradepie from '../../assets/images/Ejercicios/Mesomorfo/remo-con-barra-de-pie.png';

// Endomorfo
import flexionesConPiesElevados from '../../assets/images/Ejercicios/Endomorfo/flexiones-con-pies-elevados.png';
import flexiones from '../../assets/images/Ejercicios/Endomorfo/flexiones.png';
import fondosEnParalelas from '../../assets/images/Ejercicios/Endomorfo/fondos-en-paralelas.png';
import remoConMacuerna from '../../assets/images/Ejercicios/Endomorfo/Remo con mancuerna.png';
import remoConBarraT from '../../assets/images/Ejercicios/Endomorfo/remo-con-barra-t.png';
import remoConMancuernaUnaMano from '../../assets/images/Ejercicios/Endomorfo/remo-con-mancuerna-una-mano.png';
import sentadilla from '../../assets/images/Ejercicios/Endomorfo/Sentadilla.png';
import sentadillaFrontales from '../../assets/images/Ejercicios/Endomorfo/Sentadillas-frontales.jpg';
import fondosenparalelasconpeso from '../../assets/images/Ejercicios/Endomorfo/Fondos-en-paralelas-con-peso.png';

// Mapping of exercises to images
const ejerciciosImagenes = {
  'Elevaciones laterales': elevacionesLateralesImg,
  'Curl de bíceps con barra Z': curlBicepsBarraZImg,
  'Curl de bíceps con martillo': curlBicepsMartilloImg,
  'Elevaciones laterales con banda elástica': elevacionesLateralesconBandaElástica,
  'Extensión de tríceps por encima de la cabeza': extensióndetrícepsporencimadelacabeza,
  'Press francés con mancuerna': pressfrances,
  'Press francés con barra': pressFrancésconBarra,
  'Remo al mentón con barra': remoalmentón,
  'Zancadas bulgaras': zancadas,
  'Zancadas con salto': zancadasconSalto,
  'Zancadas con peso': zancadasconmancuernas,
  'Curl de bíceps con barra W': curldebícepsconbarraW,
  'Peso muerto': pesomuerto,
  'Press de banca inclinado': pressdebancainclinado,
  'Dominadas': dominadas,
  'Remo con barra': remoconbarradepie,
  'Peso muerto rumano': pesomuerto,
  'Press de banca declinado': presspectoraldeclinado,
  'Dominadas con agarre ancho': dominadasconAgarreAnchoyEstrecho,
  'Peso muerto sumo': pesomuertosumo,
  'Press de banca cerrado': pressbancaagarrecerrado,
  'Dominadas con agarre estrecho': dominadasconAgarreAnchoyEstrecho,
  'Remo con barra con agarre invertido': RemoconBarraconAgarreInvertido,
  'Peso muerto convencional': pesomuertoconbarraconvencional,
  'Dominadas con peso añadido': dominadasconPesoAñadido,
  'Sentadillas': sentadilla,
  'Flexiones': flexiones,
  'Fondos en paralelas': fondosEnParalelas,
  'Remo con mancuerna': remoConMacuerna,
  'Fondos en paralelas con peso': fondosenparalelasconpeso,
  'Remo con mancuerna a una mano': remoConMancuernaUnaMano,
  'Elevaciones laterales con mancuerna': elevacionesLateralesImg,
  'Sentadillas frontales': sentadillaFrontales,
  'Flexiones con pies elevados': flexionesConPiesElevados,
  'Remo con barra T': remoConBarraT
};

const RutinasCliente = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rutina, setRutina] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEjercicio, setSelectedEjercicio] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:3005/client/${user.id}`)
        .then(response => response.json())
        .then(data => {
          setUserData(data); // Store fetched user data, including tipoCuerpo
          const rutinasParsed = data.rutinas ? JSON.parse(data.rutinas) : [];
          setRutina(rutinasParsed);
        })
        .catch(error => {
          console.error('Error fetching client routine:', error);
        });
    }
  }, [user]);

  const openModal = (ejercicio) => {
    setSelectedEjercicio(ejercicio);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEjercicio(null);
  };

  return (
    <>
      <Header />
      <Relleno />
      <div className="container">
        <h1 className="title">Mi rutina</h1>
        <div className="exercise-grid">
          {rutina.length > 0 ? (
            rutina.map((ejercicio, index) => (
              <div key={index} className="exercise-card" onClick={() => openModal(ejercicio)}>
                <img
                  src={ejerciciosImagenes[ejercicio.nombre] || '/src/assets/images/placeholder.png'}
                  alt={ejercicio.nombre}
                  className="exercise-image"
                />
                <h2 className="exercise-title">{ejercicio.nombre}</h2>
              </div>
            ))
          ) : (
            <p className='no-exercises'>No se encontraron ejercicios en tu rutina.</p>
          )}
        </div>
        <button className="return-btn-cliente" onClick={() => navigate('/ClienteIndex')}>Volver</button>
      </div>
      {modalOpen && selectedEjercicio && userData?.tipoCuerpo && (
        <EjercicioModal
          ejercicio={selectedEjercicio}
          tipoCuerpo={userData.tipoCuerpo}
          onClose={closeModal}
        />
      )}
      <Footer />
    </>
  );
};

export default RutinasCliente;