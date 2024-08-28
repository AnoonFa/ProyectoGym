import React, { useState } from 'react';

const ClassFilter = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange(value);  // Llamar a la función de filtro con el nuevo valor
  };

  return (
    <div className="class-filter">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Buscar por día o hora"
      />
    </div>
  );
};

export default ClassFilter;
