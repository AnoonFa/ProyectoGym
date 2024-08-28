import React, { useState } from "react";
import "./VerPlan.css";
import { useNavigate, useParams } from "react-router-dom";

const planData = {
  1: { title: "Plan 1", description: "10 días", price: "100K" },
  2: { title: "Plan 2", description: "20 días", price: "200K" },
  3: { title: "Plan 3", description: "30 días", price: "300K" },
  4: { title: "Plan 4", description: "40 días", price: "400K" },
};

const PlanDetails = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const plan = planData[planId];

  const [showModal, setShowModal] = useState(false);

  const handleBack = () => {
    navigate("/adminEmpleadoIndex/PlansAdmin");
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="todo">
      <div className="plan-details-container">
        <h2>{plan.title}</h2>
        <p>Descripción del plan: {plan.description}</p>
        <p>Precio: {plan.price}</p>
        <div className="button-group">
          <button className="button" onClick={handleShowModal}>
            Añadir cliente
          </button>
          <button className="button" onClick={handleBack}>
            Volver
          </button>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Agregar Cliente</h2>
            <form>
              <div className="form-group">
                <label htmlFor="name">Nombre:</label>
                <input type="text" id="name" name="name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico:</label>
                <input type="email" id="email" name="email" />
              </div>
              <div className="button-group">
                <button type="submit" className="button">
                  Guardar
                </button>
                <button type="button" className="button" onClick={handleCloseModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanDetails;
