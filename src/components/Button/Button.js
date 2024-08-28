import React from 'react';
import './Button.css';

function Button({ onClick, children, variant }) {
  return (
    <button className={`button ${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
