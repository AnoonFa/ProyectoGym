import React, { useState, useEffect } from 'react';
import './Carousel.css'; 
import image1 from '../../assets/images/Ejercicios/e5bcd53f-c8d5-4947-9e4b-47341bd942a9.jpg'; // ../../assets/images/gymfoto1.png
import image2 from '../../assets/images/Ejercicios/5e7ad68e-3ede-4ad8-953b-ef94fbbc7430.jpg'; //../../assets/images/gymfoto2.png
import image3 from '../../assets/images/Ejercicios/d66b3881-374d-4084-b4e3-5d4d09dcc9a1.jpg'; // ../../assets/images/gymfoto3.png
import image4 from '../../assets/images/Ejercicios/f812dbaa-bdc6-498f-bb71-2b46077a3772.jpg';

const images = [image1, image2, image3, image4];

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
