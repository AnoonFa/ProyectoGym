import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const ClassesContext = createContext();  // Exportar el contexto

export const ClassesProvider = ({ children }) => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/clases')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then(data => {
        setClasses(data);
      })
      .catch(error => {
        console.error('Error cargando las clases:', error);
      });
  }, []);

  const updateClass = (updatedClass) => {
    fetch(`http://localhost:3001/clases/${updatedClass.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedClass),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la actualización del servidor');
        }
        return response.json();
      })
      .then(data => {
        setClasses(prevClasses => prevClasses.map(clase => clase.id === data.id ? data : clase));

        // Recargar los datos después de la actualización para asegurar que los cambios se reflejan
        fetch('http://localhost:3001/clases')
          .then(response => response.json())
          .then(data => setClasses(data))
          .catch(error => console.error('Error recargando las clases:', error));
      })
      .catch(error => console.error('Error actualizando la clase:', error));
  };

  return (
    <ClassesContext.Provider value={{ classes, setClasses, updateClass }}>
      {children}
    </ClassesContext.Provider>
  );
};
