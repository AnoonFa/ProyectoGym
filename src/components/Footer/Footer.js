import React from 'react';
import './Footer.css';
import MapComponent from "../Mapa/MapComponent"

function Footer() {
  return (
    <>
    <footer className="footer-container">
      <div className="footer-column footer-logo">
        <MapComponent />
      </div>
      <hr className="footer-divider" />
      <div className="footer-column footer-info">
        <div className="footer-section">
          <h3 className="footer-heading">Dirección</h3>
          <p>Tv. 14c Este #5489, Bogota</p>
        </div>
        <div className="footer-section">
          <h3 className="footer-heading">Teléfono </h3>
          <p>3115927446</p>
        </div>
      </div>
      <hr className="footer-divider" />
      <div className="footer-column footer-info">
        <div className="footer-section">
          <h3 className="footer-heading">Correo Electrónico</h3>
          <p>gimnasiodavidgoliat@gmail.com</p>
        </div>
        <div className="footer-section">
          <h3 className="footer-heading">Horario</h3>
          <p>Lunes a Viernes: 06:00 AM - 04:00 PM</p>
          <p>Sábados: 08:00 AM - 04:00 PM</p>
          <p>Domingos: 06:00 AM - 12:00 PM</p>
        </div>
      </div>
      <hr className="footer-divider" />
      <div className="footer-column footer-about">
        <h3 className="footer-heading">Sobre Nosotros</h3>
        <p>En David y Goliat, somos más que un gimnasio; somos una comunidad apasionada por el fitness 
          y el bienestar. Nuestro objetivo es proporcionar un espacio donde cada miembro pueda desafiar 
          sus propios límites y alcanzar sus metas. Contamos con instalaciones modernas, 
          un equipo de entrenadores altamente capacitados y una amplia gama de programas y clases diseñadas.</p>
        <div className="footer-links">
        <a href="/Terminos y Condiciones.pdf" className="footer-link" target="_blank" rel="noopener noreferrer">Términos y Condiciones</a>
        <span className="footer-separator">|</span>
        <a href="/Politica_de_Privacidad.pdf" className="footer-link" target="_blank" rel="noopener noreferrer">Políticas de Privacidad</a>
        </div>
      </div>
    </footer>
    </>
  );
}

export default Footer;