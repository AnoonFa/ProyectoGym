import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import VerCliente from "../VerCliente/VerCliente";
import VerClases from "../Clases/VerClases/VerClases.js";
import PlanDetails from "../../pages/Planes/VerPlan";
import RutinaAdminIndex from "../Rutina/RutinaAdminIndex";
import Payments from "../Payments/Payments";
import Planes from "../../pages/Planes/Planes";
import { useAuth } from "../../context/RoleContext.js";
import { TicketeraChart } from "../Graficos/Ticketeras.js";
import { ClientCreationChart } from "../Graficos/Cliente.js";
import { PlanesChart } from "../Graficos/Planes.js";
import Relleno from "../Relleno/Relleno.js";

function AdminPage() {
  const { user } = useAuth();
  
  // Estado para manejar la gráfica seleccionada
  const [selectedChart, setSelectedChart] = useState("Planes");

  // Función para renderizar la gráfica seleccionada
  const renderSelectedChart = () => {
    switch (selectedChart) {
      case "Planes":
        return <PlanesChart />;
      case "Cliente":
        return <ClientCreationChart />;
      case "Ticketeras":
        return <TicketeraChart />;
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <Relleno/>
      <div style={{
        marginTop: "100px",
        marginBottom: "3%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        fontSize: "1.8rem"
      }}>
        <h2>Bienvenido, {user ? user.username : "Usuario"}</h2>

        {/* Menú Horizontal */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          margin: "20px 0"
        }}>
          {/* Botones para seleccionar la gráfica */}
          <button 
            onClick={() => setSelectedChart("Planes")}
            style={{
              padding: "10px 20px",
              backgroundColor: selectedChart === "Planes" ? "#2679f7" : "#f1f1f1",
              color: selectedChart === "Planes" ? "white" : "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "all 0.4s ease-in-out"
            }}
          >
            Planes
          </button>
          <button 
            onClick={() => setSelectedChart("Cliente")}
            style={{
              padding: "10px 20px",
              backgroundColor: selectedChart === "Cliente" ? "#2679f7" : "#f1f1f1",
              color: selectedChart === "Cliente" ? "white" : "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "all 0.4s ease-in-out"
            }}
          >
            Cliente
          </button>
          <button 
            onClick={() => setSelectedChart("Ticketeras")}
            style={{
              padding: "10px 20px",
              backgroundColor: selectedChart === "Ticketeras" ? "#2679f7" : "#f1f1f1",
              color: selectedChart === "Ticketeras" ? "white" : "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "all 0.4s ease-in-out"
            }}
          >
            Ticketeras
          </button>
        </div>

        {/* Renderizar la gráfica seleccionada */}
        <div style={{ width: "85%", maxWidth: "800px", marginTop: "20px" }}>
          {renderSelectedChart()}
        </div>
      </div>

      <Routes>
        <Route path="VerCliente" element={<VerCliente />} />
        {/* <Route path="VerProducto" element={<VerProducto />} /> */}        
        <Route path="VerClases" element={<VerClases />} />
        <Route path="/Planes/*" element={<Planes />} />
        <Route path="PlanDetails/:planId" element={<PlanDetails />} />
        <Route path="RutinaAdminIndex" element={<RutinaAdminIndex />} />
        <Route path="Payments" element={<Payments />} />
      </Routes>
      <Footer />
    </>
  );
}

export default AdminPage;