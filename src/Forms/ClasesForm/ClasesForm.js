import React, { useState, useEffect } from "react";
import "./ClasesForm.css";
import { useNavigate } from "react-router-dom";

const ClasesForm = () => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/adminEmpleadoIndex/VerClases");
  };

  useEffect(() => {
    setShowModal(true);
  }, []);

  return (
    <div className="Fondo">
      <div className="form-con">
        {showModal && (
          <>
            <h2 className="form-title">Nombre clase</h2>
            <form className="class-form">
              <div className="form-group">
                <label htmlFor="hora">Hora:</label>
                <input type="text" id="hora" name="hora" />
              </div>
              <div className="form-group">
                <label htmlFor="dia">Día:</label>
                <input type="text" id="dia" name="dia" />
              </div>
              <div className="form-group">
                <label htmlFor="instructor">Instructor:</label>
                <input type="text" id="instructor" name="instructor" />
              </div>
              <div className="form-group">
                <label htmlFor="informacion">Información:</label>
                <input type="text" id="informacion" name="informacion" />
              </div>
              <div className="button-group">
                <button type="submit" className="button">
                  Agregar
                </button>
                <button
                  type="reset"
                  className="button"
                  onClick={handleCloseModal}
                >
                  Volver
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ClasesForm;
