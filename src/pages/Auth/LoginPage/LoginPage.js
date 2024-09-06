import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPage from '../../../components/adminEmpleadoIndex/adminEmpleadoIndex';
import ClientPage from '../../../components/IndexCliente/IndexCliente';
import Login from '../../../pages/Auth/LoginPage/Login';

function LoginP() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/ClienteIndex/*" element={<ClientPage />} />
        <Route path="/adminEmpleadoIndex/*" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default LoginP;


  