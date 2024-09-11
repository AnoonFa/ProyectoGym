import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const RoleProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { role: 'nolog', username: null,id: null, nombre: null, apellido: null, correo: null };
  });

  useEffect(() => {
    if (user && user.username) {
      localStorage.setItem('user', JSON.stringify(user));
    } else if (user.role !== 'nolog') {
      console.warn("El usuario en el contexto no tiene un 'username' definido.");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
