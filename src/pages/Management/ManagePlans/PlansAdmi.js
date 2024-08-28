import React from 'react';
import Button from '../../../components/Button/Button';
import Plans from '../../../components/Plans/Plans';
import './PlansAdmi.css';

function PlanesAdmin() {
    return (
        <div className="AdminPlansContainer">
           <center>
            <h2>¡Nuestros Planes! </h2>
            
            <Plans  /> 
            <Button variant="add">Agregar Plan</Button>
            <Button variant="delete">Eliminar Plan</Button>
           </center>
        </div>
    );
}

export default PlanesAdmin;