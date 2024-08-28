import React from 'react';
import './Rutinas.css';

function RutinaC () {
  return (
    <div className="container-rutina">
      <h1>Nombre</h1>
      <div className="data-sections-rutina">
        <div className="data-card-rutina">
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
        <div className="data-card-rutina">
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
        <div className="focus-types-rutina">
          <h2>Tipos de enfoque</h2>
          <div className="focus-circle-rutina red"></div>
          <div className="focus-circle-rutina blue"></div>
          <div className="focus-circle-rutina purple"></div>
          <div className="focus-circle-rutina green"></div>
          <div className="focus-circle-rutina yellow"></div>
          <div className="focus-circle-rutina brown"></div>
        </div>
      </div>
    </div>
  );
}

export default RutinaC;
