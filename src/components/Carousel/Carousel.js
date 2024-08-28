import React, { useState, useEffect } from 'react';
import './Carousel.css'; 
import image1 from '../../assets/images/gymfoto1.png';
import image2 from '../../assets/images/gymfoto2.png';
import image3 from '../../assets/images/gymfoto3.png';

const images = [image1, image2, image3];

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Auto-slide feature
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
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`slide ${index}`}
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
