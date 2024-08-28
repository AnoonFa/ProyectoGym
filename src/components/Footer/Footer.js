import React from 'react';
import './Footer.css';
import logo from '../../assets/images/David&GoliatLogo.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <img src={logo} alt="Logo del gimnasio" className="footer-logo" />
        <hr className="footer-divider" />
        <div className="footer-section">
          <div className="footer-table">
            <div className="footer-table-cell">
              <h3>Misión</h3>
              <p>Nuestra misión es proporcionar un entorno motivador y accesible para que cada persona pueda alcanzar sus objetivos de fitness y bienestar. En David y Goliat, 
                nos dedicamos a ofrecer un entrenamiento personalizado, equipos de alta calidad y un servicio excepcional que inspire a nuestros miembros a superar 
                sus propios límites y adoptar un estilo de vida saludable.</p>
            </div>
            <div className="footer-table-cell">
              <h3>Visión</h3>
              <p>NNuestra visión es ser reconocidos como el gimnasio líder en la comunidad, destacándonos por nuestra capacidad para 
                transformar vidas a través del ejercicio y el compromiso con el bienestar integral. Aspiramos a crear un espacio inclusivo donde cada 
                miembro se sienta valorado y apoyado en su viaje hacia la mejor versión de sí mismo.</p>
            </div>
            <div className="footer-table-cell">
              <h3>Sobre Nosotros</h3>
              <p>En David y Goliat, somos más que un gimnasio; somos una comunidad apasionada por el fitness y el bienestar. 
                Nuestro objetivo es proporcionar un espacio 
                donde cada miembro pueda desafiar sus propios límites y alcanzar sus metas. Contamos con instalaciones modernas, 
                un equipo de entrenadores altamente capacitados y una amplia gama de programas y clases diseñadas </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
