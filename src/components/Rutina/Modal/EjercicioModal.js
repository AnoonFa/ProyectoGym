import React, { useEffect , useState } from 'react';
import './EjercicioModal.css';

// Importa todas las imágenes que necesites

/* Ectomorfo */
import curlBicepsBarraZImg from '../../../assets/images/Ejercicios/Ectomorfo/curl-de-biceps-con-barra-en-z-y-w.png';
import curlBicepsMartilloImg from '../../../assets/images/Ejercicios/Ectomorfo/curl-de-biceps-martillo.png';
import elevacionesLateralesImg from '../../../assets/images/Ejercicios/Ectomorfo/elevacion-lateral.png';
import elevacionesLateralesconBandaElástica from '../../../assets/images/Ejercicios/Ectomorfo/Elevaciones-Laterales-con-Banda-Elástica.png';
import extensióndetrícepsporencimadelacabeza from '../../../assets/images/Ejercicios/Ectomorfo/Extensión-de-tríceps-por-encima-de-la-cabeza.jpg'; 
import pressfrances from '../../../assets/images/Ejercicios/Ectomorfo/press-frances-mancuernas.jpg';
import pressFrancésconBarra from '../../../assets/images/Ejercicios/Ectomorfo/Press-Francés-con-Barra.png';
import remoalmentón from '../../../assets/images/Ejercicios/Ectomorfo/Remo-al-mentón-con-barra.png';
import zancadasconmancuernas from '../../../assets/images/Ejercicios/Ectomorfo/zancadas-con-mancuernas.png';
import zancadasconSalto from '../../../assets/images/Ejercicios/Ectomorfo/Zancadas-con-Salto.png';
import zancadas from '../../../assets/images/Ejercicios/Ectomorfo/Zancadas.png';
import curldebícepsconbarraW from '../../../assets/images/Ejercicios/Ectomorfo/Curl-de-bíceps-con-barra-W.png';

/* Mesomorfo */
import dominadasconAgarreAnchoyEstrecho from '../../../assets/images/Ejercicios/Mesomorfo/dominadas-con-Agarre-Ancho-y-Estrecho.png';
import dominadasconPesoAñadido from '../../../assets/images/Ejercicios/Mesomorfo/Dominadas-con-Peso-Añadido.png';
import dominadas from '../../../assets/images/Ejercicios/Mesomorfo/dominadas.jpg';
import pesomuertoconbarraconvencional from '../../../assets/images/Ejercicios/Mesomorfo/peso-muerto-con-barra-convencional.png';
import pesomuertosumo from '../../../assets/images/Ejercicios/Mesomorfo/peso-muerto-sumo.png';
import pesomuerto from '../../../assets/images/Ejercicios/Mesomorfo/peso-muerto.png';
import pressdebancainclinado from '../../../assets/images/Ejercicios/Mesomorfo/press-de-banca-inclinado.png';
import presspectoraldeclinado from '../../../assets/images/Ejercicios/Mesomorfo/press-pectoral-declinado.png';
import pressbancaagarrecerrado from '../../../assets/images/Ejercicios/Mesomorfo/pressbanca-agarre-cerrado.png';
import RemoconBarraconAgarreInvertido from '../../../assets/images/Ejercicios/Mesomorfo/Remo-con-Barra-con-Agarre-Invertido.jpg';
import remoconbarradepie from '../../../assets/images/Ejercicios/Mesomorfo/remo-con-barra-de-pie.png';

/* Endomorfo */
import flexionesConPiesElevados from '../../../assets/images/Ejercicios/Endomorfo/flexiones-con-pies-elevados.png';
import flexiones from '../../../assets/images/Ejercicios/Endomorfo/flexiones.png';
import fondosEnParalelas from '../../../assets/images/Ejercicios/Endomorfo/fondos-en-paralelas.png';
import remoConMacuerna from '../../../assets/images/Ejercicios/Endomorfo/Remo con mancuerna.png';
import remoConBarraT from '../../../assets/images/Ejercicios/Endomorfo/remo-con-barra-t.png';
import remoConMancuernaUnaMano from '../../../assets/images/Ejercicios/Endomorfo/remo-con-mancuerna-una-mano.png';
import sentadilla from '../../../assets/images/Ejercicios/Endomorfo/Sentadilla.png';
import sentadillaFrontales from '../../../assets/images/Ejercicios/Endomorfo/Sentadillas-frontales.jpg';
import fondosenparalelasconpeso from '../../../assets/images/Ejercicios/Endomorfo/Fondos-en-paralelas-con-peso.png';


// Mapeo de ejercicios a imágenes
const ejerciciosImagenes = {

  /* Ectomorfo */
  'Elevaciones laterales': elevacionesLateralesImg,
  'Curl de bíceps con barra Z': curlBicepsBarraZImg,
  'Curl de bíceps con martillo': curlBicepsMartilloImg,
  'Elevaciones laterales con banda elástica': elevacionesLateralesconBandaElástica,
  'Extensión de tríceps por encima de la cabeza': extensióndetrícepsporencimadelacabeza,
  'Press francés con mancuerna': pressfrances,
  'Press francés con barra': pressFrancésconBarra ,
  'Remo al mentón con barra': remoalmentón,
  'Zancadas bulgaras': zancadas,
  'Zancadas con salto': zancadasconSalto,
  'Zancadas con peso': zancadasconmancuernas,
  'Curl de bíceps con barra W' : curldebícepsconbarraW,

  /* Mesomorfo */

  'Peso muerto' : pesomuerto,
  'Press de banca inclinado' : pressdebancainclinado,
  'Dominadas' : dominadas,
  'Remo con barra' : remoconbarradepie,
  'Peso muerto rumano' : pesomuerto,
  'Press de banca declinado' : presspectoraldeclinado,
  'Dominadas con agarre ancho' : dominadasconAgarreAnchoyEstrecho,
  'Peso muerto sumo' : pesomuertosumo,
  'Press de banca cerrado' : pressbancaagarrecerrado,
  'Dominadas con agarre estrecho' : dominadasconAgarreAnchoyEstrecho,
  'Remo con barra con agarre invertido' : RemoconBarraconAgarreInvertido,
  'Peso muerto convencional' : pesomuertoconbarraconvencional,
  'Dominadas con peso añadido' : dominadasconPesoAñadido,

  /* Endomorfo */

  'Sentadillas' : sentadilla,
  'Flexiones' : flexiones,
  'Fondos en paralelas' : fondosEnParalelas,
  'Remo con mancuerna' : remoConMacuerna,
  'Fondos en paralelas con peso' : fondosenparalelasconpeso,
  'Remo con mancuerna a una mano' : remoConMancuernaUnaMano,
  'Elevaciones laterales con mancuerna' : elevacionesLateralesImg,
  'Sentadillas frontales' : sentadillaFrontales,
  'Flexiones con pies elevados' : flexionesConPiesElevados,
  'Remo con barra T' : remoConBarraT

};

const EjercicioModal = ({ ejercicio, tipoCuerpo, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

        // Función para cerrar con animación
        const handleClose = () => {
            setIsClosing(true); // Activar la animación de cierre
            setTimeout(() => {
            onClose(); // Llamar a onClose después de la animación
            }, 300); // 300ms para que coincida con la duración de la animación
        };


  // Función para normalizar los nombres de los ejercicios (eliminar acentos, reemplazar espacios y pasar a minúsculas)
  const normalizeString = (str) => {
    if (typeof str !== 'string') return ''; // Ensure str is a string, else return an empty string
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Removes accents
      .replace(/\s+/g, '_') // Replaces spaces with underscores
      .toLowerCase(); // Converts to lowercase
  };

  useEffect(() => {
    // Evitar que el fondo se desplace al abrir el modal
    document.body.style.overflow = 'hidden';

    // Restaurar el desplazamiento del fondo cuando se cierre el modal
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const getEjercicioInfo = (tipoCuerpo, nombre) => {
    console.log("Tipo de cuerpo:", tipoCuerpo);
    console.log('Nombre del ejercicio:', nombre);
    console.log("Received tipoCuerpo in EjercicioModal:", tipoCuerpo);

    const infoEjercicios = {
        endomorfo: {
            "sentadillas": {
                posicionInicial: "Párate con los pies separados al ancho de los hombros, los pies ligeramente hacia afuera. Mantén la espalda recta, el pecho hacia afuera y los hombros relajados. La barra descansa sobre tus trapecios",
                ejecucion: "Flexiona las rodillas como si fueras a sentarte en una silla, manteniendo la espalda recta. Baja hasta que tus muslos estén paralelos al suelo o un poco más abajo. Empuja con los talones para volver a la posición inicial",
                consejo: "Mantén la mirada hacia adelante y evita que las rodillas se vayan hacia adentro."
            },
            "flexiones":{ 
                 posicionInicial: "Colócate en posición de plancha, con las manos ligeramente más abiertas que el ancho de los hombros y los dedos apuntando hacia adelante. El cuerpo debe formar una línea recta desde los pies hasta la cabeza",
                 ejecucion: "Flexiona los codos y baja tu cuerpo hasta que tu pecho casi toque el suelo. Empuja hacia arriba para volver a la posición inicial.",
                 consejo: "Si te resulta demasiado difícil, puedes apoyar las rodillas en el suelo."
            },
            "fondos_en_paralelas":{ 
                 posicionInicial: "Sujétate a las barras paralelas con un agarre más ancho que el ancho de los hombros. Extiende los brazos completamente",
                 ejecucion: "Flexiona los codos y baja tu cuerpo hasta que tus brazos formen un ángulo de 90 grados. Empuja hacia arriba para volver a la posición inicial.",
                 consejo: "Mantén los codos cerca del cuerpo para evitar lesiones en el hombro"
            },
            "remo_con_mancuerna":{ 
                 posicionInicial: "Incline ligeramente el torso hacia adelante, manteniendo la espalda recta. Sujeta una mancuerna en cada mano con un agarre neutro (palmas hacia adentro).",
                 ejecucion: "Tira de las mancuernas hacia arriba, contrayendo los músculos de la espalda. Baja lentamente las mancuernas a la posición inicial.",
                 consejo: "Mantén los codos cerca del cuerpo durante todo el movimiento"
            },
            "fondos_en_paralelas_con_peso":{ 
                 posicionInicial: "Colócate frente a las barras paralelas con un agarre ligeramente más ancho que el ancho de los hombros. Sujeta las barras y levanta tu cuerpo hasta que los brazos estén completamente extendidos. Para añadir peso, puedes utilizar un cinturón de lastre o una mancuerna entre las piernas.",
                 ejecucion: "Flexiona los codos y baja tu cuerpo hasta que los brazos formen un ángulo de 90 grados o hasta que sientas un buen estiramiento en el pecho. Empuja hacia arriba para volver a la posición inicial.",
                 consejo: "Mantén los codos cerca del cuerpo para evitar lesiones en el hombro. Al añadir peso, concéntrate en mantener una forma correcta y evita balancearte."
            },
             "remo_con_mancuerna_a_una_mano":{ 
                 posicionInicial: "Inclínate hacia adelante, apoyando una mano y una rodilla en un banco. Sujeta una mancuerna con la otra mano",
                 ejecucion: "Tira de la mancuerra hacia arriba, contrayendo los músculos de la espalda. Baja lentamente la mancuerna a la posición inicial.",
                 consejo: "Mantén la espalda recta y evita arquearla"
            },
            "elevaciones_laterales_con_mancuerna":{ 
                 posicionInicial: ": Párate con los pies separados al ancho de los hombros, sosteniendo una mancuerna en cada mano con los brazos extendidos a los lados del cuerpo",
                 ejecucion: "Levanta los brazos lateralmente hasta que estén a la altura de los hombros. Baja lentamente las mancuernas a la posición inicial.",
                 consejo: "Mantén una ligera flexión en los codos durante todo el movimiento"
            },
            "sentadillas_frontales":{ 
                 posicionInicial: "Coloca la barra sobre tus hombros, apoyándola en la parte superior del pecho. Mantén los codos apuntando hacia el suelo",
                 ejecucion: "Flexiona las rodillas y baja como en una sentadilla tradicional. Mantén la espalda recta y el pecho hacia afuera",
                 consejo: "Asegúrate de que la barra esté bien sujeta y de que tu equilibrio sea estable"
            },
            "flexiones_con_pies_elevados":{ 
                 posicionInicial: "Coloca tus pies sobre un banco o silla, manteniendo el cuerpo en una línea recta.",
                 ejecucion: "Realiza flexiones como se describió anteriormente, pero con los pies elevados",
                 consejo: "Cuanto más altos tengas los pies, más difícil será el ejercicio"
            },
            "remo_con_barra_t":{ 
                 posicionInicial: "Coloca una barra T en el suelo. Inclínate hacia adelante con las piernas ligeramente flexionadas y la espalda recta. Sujeta la barra con un agarre prono (palmas hacia abajo) y ligeramente más ancho que el ancho de los hombros.",
                 ejecucion: "Tira de la barra hacia arriba, contrayendo los músculos de la espalda. Mantén los codos cerca del cuerpo. Baja lentamente la barra a la posición inicial",
                 consejo: "Mantén la espalda plana durante todo el movimiento y evita arquearla. Concéntrate en contraer los omóplatos en la parte superior del movimiento."
            },
        },
        mesomorfo: {
            "peso_muerto": {
                posicionInicial: "Con los pies separados al ancho de los hombros, agarra la barra con un agarre ligeramente más ancho que los hombros. Mantén la espalda recta, los hombros retraídos y el core contraído.",
                ejecucion: "Empuja con los pies para levantar la barra, manteniendo la espalda recta y la barra cerca de tu cuerpo. Extiende las caderas y las rodillas al final del movimiento. Baja lentamente la barra siguiendo la misma trayectoria.",
                consejo: "Mantén la mirada hacia adelante y evita redondear la espalda."
            },
            "peso_muerto_rumano":{
                 posicionInicial: "Con los pies separados al ancho de las caderas, agarra la barra con un agarre ligeramente más ancho que los hombros. Mantén una ligera flexión en las rodillas y la espalda recta.",
                ejecucion: "Empuja las caderas hacia atrás mientras doblas ligeramente las rodillas. Baja la barra por las piernas hasta sentir un estiramiento en los isquiotibiales. Vuelve a la posición inicial extendiendo las caderas.",
                consejo: "Mantén la barra cerca de tu cuerpo durante todo el movimiento"
            },
            "peso_muerto_sumo":{
                posicionInicial: "Coloca los pies más anchos que los hombros, con los dedos de los pies apuntando hacia afuera. Agarra la barra con un agarre más ancho que los hombros. Mantén la espalda recta y el core contraído",
                ejecucion: "Empuja con los talones para levantar la barra, manteniendo la espalda recta y la barra cerca de las piernas. Extiende las caderas y las rodillas al final del movimiento. Baja lentamente la barra siguiendo la misma trayectoria",
                consejo: "Mantén las rodillas apuntando hacia afuera durante todo el movimiento"
            },
            "peso_muerto_convencional":{
                posicionInicial: "Con los pies separados al ancho de los hombros, agarra la barra con un agarre ligeramente más ancho que los hombros. Mantén la espalda recta, los hombros retraídos y el core contraído",
                ejecucion: "Empuja con los pies para levantar la barra, manteniendo la espalda recta y la barra cerca de tu cuerpo. Extiende las caderas y las rodillas al final del movimiento. Baja lentamente la barra siguiendo la misma trayectoria",
                consejo: "Mantén la barra lo más cerca posible de tu cuerpo durante todo el movimiento."
            },
            "press_de_banca_inclinado":{
                posicionInicial: "Recuéstate en un banco inclinado y agarra la barra con un agarre ligeramente más ancho que los hombros. Baja la barra hasta el pecho",
                ejecucion: "Empuja la barra hacia arriba hasta que los brazos estén completamente extendidos. Baja lentamente la barra hasta el pecho",
                consejo: "Mantén los codos cerca del cuerpo durante todo el movimiento"
            },
            "press_de_banca_declinado":{
                posicionInicial: "Recuéstate en un banco declinado y agarra la barra con un agarre ligeramente más ancho que los hombros. Baja la barra hasta el pecho",
                ejecucion: "Empuja la barra hacia arriba hasta que los brazos estén completamente extendidos. Baja lentamente la barra hasta el pecho",
                consejo: "Mantén los omóplatos retraídos durante todo el movimiento"
            },
            "press_de_banca_cerrado":{
                posicionInicial: "Recuéstate en un banco plano y agarra la barra con un agarre más estrecho que el ancho de los hombros. Baja la barra hasta el pecho",
                ejecucion: "Empuja la barra hacia arriba hasta que los brazos estén completamente extendidos. Baja lentamente la barra hasta el pecho",
                consejo: "Mantén los codos cerca del cuerpo durante todo el movimiento"
            },
            "dominadas":{
                posicionInicial: "Sujétate a la barra con un agarre pronado (palmas hacia adelante) y los brazos completamente extendidos",
                ejecucion: "Levanta tu cuerpo hasta que tu barbilla esté por encima de la barra. Baja lentamente hasta la posición inicial",
                consejo: "Si te resulta difícil, puedes utilizar una banda de resistencia para ayudarte"
            },
            "dominadas_con_agarre_ancho":{
                posicionInicial: "Sujétate a la barra con un agarre supino (palmas hacia arriba) y los brazos completamente extendidos",
                ejecucion: "Levanta tu cuerpo hasta que tu barbilla esté por encima de la barra. Baja lentamente hasta la posición inicial",
                consejo: "Mantén los codos cerca del cuerpo durante todo el movimiento"
            },
            "dominadas_con_agarre_estrecho":{
                posicionInicial: "Sujétate a la barra con un agarre pronado (palmas hacia adelante) y los brazos completamente extendidos",
                ejecucion: "Levanta tu cuerpo hasta que tu barbilla esté por encima de la barra. Baja lentamente hasta la posición inicial",
                consejo: "Mantén los codos cerca del cuerpo durante todo el movimiento"
            },
            "dominadas_con_peso_anadido":{
                posicionInicial: "Sujétate a la barra con un agarre pronado (palmas hacia adelante) y los brazos completamente extendidos. Coloca un cinturón de lastre o una mancuerna entre tus piernas",
                ejecucion: "Levanta tu cuerpo hasta que tu barbilla esté por encima de la barra. Baja lentamente hasta la posición inicial",
                consejo: "Aumenta el peso gradualmente para evitar lesiones"
            },
            "remo_con_barra":{
                posicionInicial: "Inclínate hacia adelante con las piernas ligeramente flexionadas y la espalda recta. Agarra la barra con un agarre pronado (palmas hacia adelante) y los brazos extendidos.",
                ejecucion: "Tira de la barra hacia tu cuerpo, contrayendo los músculos de la espalda. Baja lentamente la barra a la posición inicial",
                consejo: "Mantén la espalda recta durante todo el movimiento."
            },
            "remo_con_barra_con_agarre_invertido":{
                posicionInicial: "Inclínate hacia adelante con las piernas ligeramente flexionadas y la espalda recta. Agarra la barra con un agarre supino (palmas hacia arriba) y los brazos extendidos",
                ejecucion: "Tira de la barra hacia tu cuerpo, contrayendo los músculos de la espalda. Baja lentamente la barra a la posición inicial",
                consejo: "Mantén los codos cerca del cuerpo durante todo el movimiento."
            },
        },
        ectomorfo: {
            "elevaciones_laterales": {
                posicionInicial: "Párate con los pies separados al ancho de los hombros, sosteniendo una mancuerna en cada mano con los brazos a los lados del cuerpo",
                ejecucion: "Levanta los brazos lateralmente hasta la altura de los hombros, manteniendo los codos ligeramente flexionados. Baja lentamente a la posición inicial.",
                consejo: "Mantén los hombros relajados durante todo el movimiento"
            },
            "curl_de_biceps_con_barra_z":{
                posicionInicial: "Párate con los pies separados al ancho de los hombros, sosteniendo una barra Z con un agarre pronado (palmas hacia adelante).",
                ejecucion: "Flexiona los codos y lleva la barra hacia tus hombros, manteniendo los codos cerca del cuerpo. Baja lentamente la barra a la posición inicial",
                consejo: "Mantén la espalda recta durante todo el movimiento"
            },
            "extension_de_triceps_por_encima_de_la_cabeza":{
                posicionInicial: "Túmbate en un banco plano con una mancuerna en cada mano, sosteniéndolas por encima de tu pecho",
                ejecucion: "Flexiona los codos y lleva la barra hacia tus hombros, manteniendo los codos cerca del cuerpo. Baja lentamente la barra a la posición inicial",
                consejo: "Mantén la espalda recta durante todo el movimiento"
            },
            "zancadas_bulgaras":{
                posicionInicial: "Párate frente a un banco o silla, coloca un pie sobre el banco y da un paso hacia adelante con la otra pierna",
                ejecucion: "Flexiona ambas rodillas hasta formar un ángulo de 90 grados con la rodilla delantera y el muslo trasero paralelo al suelo. Empuja con el pie delantero para volver a la posición inicial.",
                consejo: "Mantén la espalda recta y el torso erguido durante todo el movimiento."
            },
            "elevaciones_laterales_con_banda_elastica":{
                posicionInicial: "Párate con los pies separados al ancho de los hombros y sujeta los extremos de una banda elástica con ambas manos",
                ejecucion: "Levanta los brazos lateralmente hasta la altura de los hombros, manteniendo los codos ligeramente flexionados. Baja lentamente a la posición inicial",
                consejo: "Aumenta la tensión de la banda para aumentar la resistencia"
            },
            "curl_de_biceps_con_martillo":{
                posicionInicial: "Párate con los pies separados al ancho de los hombros, sosteniendo una mancuerna en cada mano con un agarre neutral (palmas hacia adentro).",
                ejecucion: "Flexiona los codos y lleva las mancuernas hacia tus hombros, manteniendo los codos cerca del cuerpo. Baja lentamente las mancuernas a la posición inicial",
                consejo: "Mantén los hombros relajados durante todo el movimiento"
            },
            "press_frances_con_barra":{
                posicionInicial: "Túmbate en un banco plano con una barra cargada sobre tus hombros.",
                ejecucion: "Flexiona los codos y baja la barra hacia tu frente. Extiende los brazos para volver a la posición inicial.",
                consejo: "Mantén los codos cerca de la cabeza durante todo el movimiento"
            },
            "zancadas_con_peso":{
                posicionInicial: "Da un paso hacia adelante y flexiona ambas rodillas hasta formar un ángulo de 90 grados. Empuja con el pie delantero para volver a la posición inicial y repite con la otra pierna.",
                ejecucion: "Da un paso hacia adelante y flexiona ambas rodillas hasta formar un ángulo de 90 grados. Empuja con el pie delantero para volver a la posición inicial y repite con la otra pierna",
                consejo: "Mantén la espalda recta y el torso erguido durante todo el movimiento"
            },
            "remo_al_menton_con_barra":{
                posicionInicial: "Párate con los pies separados al ancho de los hombros, sosteniendo una barra con un agarre pronado (palmas hacia abajo) y los brazos extendidos frente a ti.",
                ejecucion: "Tira de la barra hacia tu mentón, manteniendo los codos cerca del cuerpo. Baja lentamente la barra a la posición inicial",
                consejo: "Mantén la espalda recta durante todo el movimiento."
            },
            "curl_de_biceps_con_barra_w":{
                posicionInicial: "Párate con los pies separados al ancho de los hombros, sosteniendo una barra W con un agarre pronado (palmas hacia adelante).",
                ejecucion: "Flexiona los codos y lleva la barra hacia tus hombros, manteniendo los codos cerca del cuerpo. Baja lentamente la barra a la posición inicial.",
                consejo: "Mantén la espalda recta durante todo el movimiento."
            },
            "press_frances_con_mancuerna":{
                posicionInicial: "Túmbate en un banco plano con una mancuerna en cada mano, sosteniéndolas por encima de tu pecho",
                ejecucion: "Extiende los brazos directamente hacia arriba hasta que estén completamente extendidos. Baja lentamente las mancuernas a la posición inicial",
                consejo: "Mantén los codos cerca de las orejas durante todo el movimiento"
            },
            "zancadas_con_salto":{
                posicionInicial: "Párate con los pies separados al ancho de los hombros",
                ejecucion: ": Da un paso hacia adelante y flexiona ambas rodillas hasta formar un ángulo de 90 grados. Impúlsate hacia arriba y cambia de pierna en el aire para aterrizar en una zancada con la otra pierna.",
                consejo: "Mantén la espalda recta y los brazos extendidos hacia adelante para mantener el equilibrio."
            },
        }
    };
    
    const tipoCuerpoNormalized = normalizeString(tipoCuerpo || '');
    const nombreEjercicioNormalized = normalizeString(nombre || '');
  
    // Return exercise info or an empty object if not found
    return infoEjercicios[tipoCuerpoNormalized]?.[nombreEjercicioNormalized] || {};
  };

  // Obtener la información adicional del ejercicio seleccionado
  const infoAdicional = getEjercicioInfo(tipoCuerpo, ejercicio.nombre);

  // Función para extraer el ID del video de YouTube
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Obtener el ID del video de YouTube
  const videoId = ejercicio.videoUrl ? getYouTubeId(ejercicio.videoUrl) : null;

  return (
    <div className={`exercise-modal-overlay ${isClosing ? 'closing' : ''}`}>
      <div className="exercise-modal-content">
      <button className="exercise-modal-close" onClick={handleClose}>X</button>
        <h2 className="exercise-modal-title">{ejercicio.nombre}</h2>
        <img
          src={ejerciciosImagenes[ejercicio.nombre] || '/src/assets/images/placeholder.png'}
          alt={ejercicio.nombre}
          className="exercise-modal-image"
        />
        <div className="exercise-modal-details">
          <h3>POSICIÓN INICIAL</h3>
          <p>{infoAdicional.posicionInicial || 'No disponible'}</p>
          <h3>EJECUCIÓN</h3>
          <p>{infoAdicional.ejecucion || 'No disponible'}</p>
          <h3>CONSEJOS</h3>
          <p>{infoAdicional.consejo || 'No disponible'}</p>
          <h3>DETALLES</h3>
          <p>Series: {ejercicio.series}</p>
          <p>Repeticiones: {ejercicio.repeticiones || '-'}</p>
          <p>Descanso: {ejercicio.descanso} s</p>
          {videoId && (
            <div>
              <h3>Video</h3>
              <div className="video-container">
                <iframe
                  width="570"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EjercicioModal;