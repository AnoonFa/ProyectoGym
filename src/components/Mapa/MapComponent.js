import React from 'react';

const MapComponent = () => {
  return (
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.338320911942!2d-74.09018952501106!3d4.5329572430888945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3fa302b84fae75%3A0x80ff3fbaa187af3c!2sGym%20step%20libertadores.!5e0!3m2!1ses!2sco!4v1723068872309!5m2!1ses!2sco"
          width="95%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
  );
};

export default MapComponent;

