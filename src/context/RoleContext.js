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
      // Fetch tickets from the server when user logs in
      if (user.id) {
        fetch(`http://localhost:3001/client/${user.id}`)
          .then(response => response.json())
          .then(data => {
            setUser(prevUser => ({
              ...prevUser,
              tickets: data.tickets || 0
            }));
          })
          .catch(error => console.error('Error fetching user tickets:', error));
      }
    }
  }, [user.username, user.id]);

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