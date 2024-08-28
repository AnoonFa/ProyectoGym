import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import VerProducto from "../VerProductos/VerProductos";
import VerCliente from "../VerCliente/VerCliente";
import ClasesForm from "../../Forms/ClasesForm/ClasesForm";
import ProductForm from "../../Forms/ProductForm/ProductForm";
import VerClases from "../VerClases/VerClases";
import PlanDetails from "../../pages/Planes/VerPlan";
import RutinaAdminIndex from "../Rutina/RutinaAdminIndex";
import Payments from "../Payments/Payments";
import Planes from "../../pages/Planes/Planes";


function AdminPage() {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <div style={{marginTop: "100px", marginBottom: "185px", display: "flex",flexDirection: "column", alignItems: "center", width: "100%"}}>
              <h2>Bienvenido</h2>
            </div>
          }
        />
        <Route
          path="VerCliente"
          element={
            <div style={{ display: "flex" }}>
              <VerCliente />
            </div>
          }
        />
        <Route path="VerProducto" element={<VerProducto />} />
        <Route path="resultados" element={<ProductForm />} />
        <Route path="VerClases" element={<VerClases />} />
        <Route path="ClasesForm" element={<ClasesForm />} />
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