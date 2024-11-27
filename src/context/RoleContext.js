import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const RoleProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { 
      role: 'nolog', 
      username: null, 
      id: null, 
      nombre: null, 
      apellido: null, 
      correo: null,
      tickets: 0
    };
  });

  useEffect(() => {
    if (!user || !user.id) return; // Verifica que user.id esté definido
  
    let apiUrl = '';
    switch (user.role) {
      case 'admin':
        apiUrl = `http://localhost:3005/admin/${user.id}`;
        break;
      case 'employee':
        apiUrl = `http://localhost:3005/employee/${user.id}`;
        break;
      case 'client':
        apiUrl = `http://localhost:3005/client/${user.id}`;
        break;
      default:
        console.error('Rol de usuario no reconocido');
        return;
    }
  
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        setUser(prevUser => ({
          ...prevUser,
          tickets: data.tickets || 0
        }));
      })
      .catch(error => console.error('Error fetching user tickets:', error));
  }, [user.id, user.role]); // Añadir dependencia user.role
  
  
  const updateUserTickets = (newTicketCount) => {
    setUser(prevUser => {
      const updatedUser = {
        ...prevUser,
        tickets: newTicketCount
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });

    // Update tickets on the server
    fetch(`http://localhost:3005/client/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tickets: newTicketCount }),
    }).catch(error => console.error('Error updating user tickets:', error));
  };

  const logout = () => {
    setUser({ 
      role: 'nolog', 
      username: null, 
      id: null, 
      nombre: null, 
      apellido: null, 
      correo: null,
      tickets: 0 
    });
    localStorage.removeItem('user');
  };


  const updateUserPassword = (newPassword) => {
    setUser(prevUser => {
      const updatedUser = { ...prevUser, password: newPassword }; // Asegúrate de manejar esto correctamente
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  
    // Aquí puedes enviar una petición a tu API si necesitas actualizar algo en el servidor
    fetch(`http://localhost:3005/client/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: newPassword }), // Asegúrate de que tu API acepte esto
    }).catch(error => console.error('Error updating user password:', error));
  };
  

  return (
    <AuthContext.Provider value={{ user, setUser, logout ,updateUserTickets, updateUserPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
