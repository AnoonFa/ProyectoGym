import React from "react";
import './Plans.css';
import Button from "../../components/Button/Button";
import Modal from '../Modal/Modal.js';


function Plans({ openModal }) {
    return (
        <div className="Container">
            <div className="FirstColumn">
                <div className="Plan">
                    <div className='NamePlan1'>
                         Mensualidad
                    </div>
                    <div className='PlanDetails1'>
                        <p>Acceso completo por un mes</p>
                        <Button variant="add" onClick={openModal}>Ver</Button>
                    </div>
                </div>
                <div className="Plan">
                    <div className='NamePlan2'>
                        Trimestre
                    </div>
                    <div className='PlanDetails2'>
                        <p>Acceso completo por tres meses</p>
                        <Button variant="add" onClick={openModal}>Ver</Button>
                    </div>
                </div>
            </div>
            <div className="SecondColumn">
                <div className="Plan">
                    <div className='NamePlan3'>
                        Semestre
                    </div>
                    <div className='PlanDetails3'>
                        <p>Acceso completo por seis meses</p>
                        <Button variant="add" onClick={openModal}>Ver</Button>
                    </div>
                </div>
                <div className="Plan">
                    <div className='NamePlan4'>
                        Año
                    </div>
                    <div className='PlanDetails4'>
                        <p>Acceso completo por un año</p>
                        <Button variant="add" onClick={openModal}>Ver</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Plans;
