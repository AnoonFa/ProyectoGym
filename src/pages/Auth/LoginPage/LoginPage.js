import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import AdminPage from '../../../components/adminEmpleadoIndex/adminEmpleadoIndex';
import ClientPage from '../../../components/IndexCliente/IndexCliente';
import Login from '../../../pages/Auth/LoginPage/Login';

function LoginP() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/ClienteIndex/*" element={<ClientPage />} />
        <Route path="/adminEmpleadoIndex/*" element={<AdminPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default LoginP;


  