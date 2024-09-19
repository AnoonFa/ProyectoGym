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
    if (user && user.username) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user'); // Limpia localStorage si no hay un usuario establecido
    }
      
      

      // Aquí construimos la URL de la API según el rol del usuario
      let apiUrl = '';
      switch (user.role) {
        case 'admin':
          apiUrl = `http://localhost:3001/admin/${user.id}`;
          break;
        case 'employee':
          apiUrl = `http://localhost:3001/employee/${user.id}`;
          break;
        case 'client':
          apiUrl = `http://localhost:3001/client/${user.id}`;
          break;
        default:
          console.error('Rol de usuario no reconocido');
          return;
      }

      // Fetch para obtener los datos del usuario, según el rol
      if (user.id) {
        fetch(apiUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
          })
          .then(data => {
            setUser(prevUser => ({
              ...prevUser,
              tickets: data.tickets || 0
            }));
          })
          .catch(error => console.error('Error fetching user tickets:', error));
      }
    }, [user.username, user.id, user.role]);
  
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
    fetch(`http://localhost:3001/client/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tickets: newTicketCount }),
    }).catch(error => console.error('Error updating user tickets:', error));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updateUserTickets }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);