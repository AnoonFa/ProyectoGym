import React from 'react';
import './MapComponent.css';

const MapComponent = () => {
  return (
    <div className="map-container">
      {/* Mapa embebido como iframe */}
      <div className="iframe-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.338320911942!2d-74.09018952501106!3d4.5329572430888945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3fa302b84fae75%3A0x80ff3fbaa187af3c!2sGym%20step%20libertadores.!5e0!3m2!1ses!2sco!4v1723068872309!5m2!1ses!2sco"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Sección de texto adicional */}
      <div className="text-container">
        <h2 className="main-text">Gimnasio David & Goliat</h2>
        <p>Equipado con lo último en maquinaria para lograr tu objetivo y entrenadores de calidad</p>
        <div className="icon-text">
          <i className="fas fa-map-marker-alt icon"></i>
          <p className="text">Tv. 14c Este #5489, Bogota</p>
        </div>
        <div className="icon-text">
          <i className="far fa-clock icon"></i>
          <div className="text">
            <p>Lunes a Viernes: 06:00 AM - 04:00 PM</p>
            <p>Sábados: 08:00 AM - 04:00 PM</p>
            <p>Domingos: 06:00 AM - 12:00 PM</p>
          </div>
        </div>
        <div className="icon-text">
          <i className="fas fa-phone icon"></i>
          <p className="text">+57 (601) 456-7890</p>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;

