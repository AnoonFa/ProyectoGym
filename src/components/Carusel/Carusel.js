import React, { useState, useEffect } from 'react';
import './Caruselss.css';

const images = [
  "https://cdn270-genai.picsart.com/fd5a3719-c1b9-4fbb-a940-823c2c33b240/460518595018201.jpg",
  "https://cdn270-genai.picsart.com/6b2af0b7-c235-4f90-a574-cfa1c00f7b62/460518690011201.jpg",
  "https://cdn270-genai.picsart.com/fc7aeaec-c03f-474f-8a25-82b6e915b51b/460518595019201.jpg"
];

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const intervalId = setInterval(nextSlide, 5000); // Cambia de imagen cada 5 segundos
    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
  }, []);

  return (
    <div className="carousel">
      <button className="carousel-button prev" onClick={prevSlide}>
        &lt;
      </button>
      <div
        className="carousel-images-wrapper"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`carousel-${index}`}
            className="carousel-image"
          />
        ))}
      </div>
      <button className="carousel-button next" onClick={nextSlide}>
        &gt;
      </button>
    </div>
  );
}

export default Carousel;
