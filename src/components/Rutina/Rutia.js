import React from 'react';
import './Rutina.css';

function RutinaC () {
  return (
    <div className="container">
      <h1>Nombre</h1>
      <div className="data-sections">
        <div className="data-card">
          <h2>Mis Datos</h2>
          <ul>
            <li>Peso: <span>_________</span></li>
            <li>Altura: <span>_________</span></li>
            <li>Edad: <span>_________</span></li>
            <li>Género: <span>_________</span></li>
            <li>IMC: <span>_________</span></li>
            <li><h4>Medidas:</h4></li>
            <ul>
              <li>Cintura: <span>_________</span></li>
              <li>Brazo: <span>_________</span></li>
              <li>Muñecas: <span>_________</span></li>
              <li>Antebrazos: <span>_________</span></li>
              <li>Pecho: <span>_________</span></li>
              <li>Muslo: <span>_________</span></li>
              <li>Pantorrilla: <span>_________</span></li>
            </ul>

          </ul>
        </div>
        <div className="data-card">
          <h2>Datos del Ideales</h2>
          <ul>
            <li>Peso: <span>_________</span></li>
            <li>Altura: <span>_________</span></li>
            <li>Edad: <span>_________</span></li>
            <li>Género: <span>_________</span></li>
            <li>IMC: <span>_________</span></li>
            <li><h4>Medidas:</h4></li>
            <ul>
              <li>Cintura: <span>_________</span></li>
              <li>Brazo: <span>_________</span></li>
              <li>Muñecas: <span>_________</span></li>
              <li>Antebrazos: <span>_________</span></li>
              <li>Pecho: <span>_________</span></li>
              <li>Muslo: <span>_________</span></li>
              <li>Pantorrilla: <span>_________</span></li>
            </ul>

          </ul>
        </div>
        <div className="focus-types">
          <h2>Tipos de enfoque</h2>
          <div className="focus-circle red"></div>
          <div className="focus-circle blue"></div>
          <div className="focus-circle purple"></div>
          <div className="focus-circle green"></div>
          <div className="focus-circle yellow"></div>
          <div className="focus-circle brown"></div>
        </div>
      </div>
    </div>
  );
}

export default RutinaC;
