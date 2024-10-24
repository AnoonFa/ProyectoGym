import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/RoleContext'; // Importa el contexto de autenticación
import './TermsPage.css';

const TermsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state;
  const { setUser } = useAuth(); // Para actualizar el usuario en el contexto

  const [activeSection, setActiveSection] = useState('terms'); // Comienza en términos

  const handleAccept = async () => {
    try {
      // Marcar al usuario como habilitado cuando acepta
      const response = await fetch(`http://localhost:3001/${user.role}/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ habilitado: true }),
      });

      if (response.ok) {
        // Actualiza el estado local del usuario y guárdalo en el localStorage
        const updatedUser = { ...user, habilitado: true };
        setUser(updatedUser); // Actualiza el contexto de autenticación
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Guardar el usuario en localStorage

        // Redirigir a la página correspondiente según el rol
        navigate(user.role === 'client' ? '/ClienteIndex' : '/adminEmpleadoIndex');
      } else {
        console.error('Error al actualizar el estado de habilitación');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    navigate('/login');
  };

  return (
    <div className="terms-container">
      <div className="terms-content">
      <div className="terms-menu">
        <button
          className={`menu-button ${activeSection === 'terms' ? 'active' : ''}`}
          onClick={() => setActiveSection('terms')}
        >
          Términos y Condiciones
        </button>
        <button
          className={`menu-button ${activeSection === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveSection('privacy')}
        >
          Políticas de Privacidad
        </button>
      </div>
        {activeSection === 'terms' && (
          <div className="scrollable-content">
            <h2>Términos y Condiciones</h2>
            <p>
              {/* Texto largo de términos y condiciones */}
              Términos y Condiciones de Uso
INFORMACIÓN RELEVANTE
Es requisito necesario para la adquisición de los productos que se ofreceneneste sitio, que lea y acepte los siguientes Términos y Condiciones que acontinuación se redactan. El uso de nuestros servicios así como la compradenuestros productos implicará que usted ha leído y aceptado los Términos yCondiciones de Uso en el presente documento. Todos los productos quesonofrecidos por nuestro sitio web pudieran ser creados, cobrados, enviados opresentados por una página web tercera y, en tal caso, estarían sujetas asuspropios Términos y Condiciones. En algunos casos, para adquirir un producto, será necesario el registro por parte del usuario, con ingreso de datos
personales fidedignos y definición de una contraseña. El usuario puede elegir y cambiar la clave para su acceso de administraciónde la cuenta en cualquier momento, en caso de que se haya registradoy quesea necesario para la compra de alguno de nuestros productos.
localhost:3000 no asume la responsabilidad en caso de que entregue dichaclave a terceros. Todas las compras y transacciones que se lleven a cabo por medio de estesitio web, están sujetas a un proceso de confirmación y verificación, el cual
podría incluir la verificación del stock y disponibilidad de producto, validaciónde la forma de pago, validación de la factura (en caso de existir) y el
cumplimiento de las condiciones requeridas por el medio de pago
seleccionado. En algunos casos puede que se requiera una verificaciónpor
medio de correo electrónico. Los precios de los productos ofrecidos en esta Tienda Online son válidos
solamente en las compras realizadas en este sitio web. LICENCIA
Gimnasio David & Goliat, a través de su sitio web, concede una licenciaparaque los usuarios utilicen los productos que son vendidos en este sitio webdeacuerdo a los Términos y Condiciones que se describen en este documento. USO NO AUTORIZADO
En caso de que aplique (para venta de software, plantillas, u otro productodediseño y programación), usted no puede colocar uno de nuestros productos, modificado o sin modificar, en un CD, sitio web o ningún otro medio y
ofrecerlos para la redistribución o la reventa de ningún tipo. PROPIEDAD
Usted no puede declarar propiedad intelectual o exclusiva a ninguno denuestros productos, modificado o sin modificar. Todos los productos sonpropiedad de los proveedores del contenido. En caso de que no se
especifique lo contrario, nuestros productos se proporcionan sin ningúntipo
de garantía, expresa o implícita. En ningún caso esta compañía será
responsable de ningún daño incluyendo, pero no limitado a, daños directos,
indirectos, especiales, fortuitos o consecuentes u otras pérdidas resultantesdel uso o de la imposibilidad de utilizar nuestros productos. POLÍTICA DE REEMBOLSO Y GARANTÍA
1. Productos Elegibles para Devolución
Los productos pueden ser devueltos en el local de Gimnasio David &Goliat
dentro de los 10 días naturales posteriores a la compra, siempre y cuandocumplan con las siguientes condiciones:  El producto debe estar en su estado original, sin usar, con todas lasetiquetas y empaques intactos.  El producto debe estar limpio y no debe presentar daños visibles. 2. Proceso de Devolución
 Solicitud de Devolución: Para iniciar la devolución, el cliente debecontactar a nuestro servicio de atención al cliente a través de [correoelectrónico] o [número de teléfono]. El cliente deberá acudir al
gimnasio para realizar la devolución del producto.  Inspección del Producto: Al llegar al local, el producto será
inspeccionado para asegurar que cumple con las condiciones dedevolución.  Resolución en el Local: Si la devolución es aceptada, se ofreceráal
cliente un producto nuevo del mismo tipo o se discutirá una soluciónalternativa. 3. Responsabilidad de los Gastos de Envío
 Devolución en el Local: No se requieren gastos de envío para ladevolución, ya que el proceso se realiza en el local de Gimnasio David& Goliat.  Casos Especiales: En situaciones donde el cliente no pueda acudir al
local, se evaluará individualmente. Los gastos de envío para la
devolución del producto desde el cliente hacia el gimnasio seránresponsabilidad del cliente, a menos que se trate de un error por partede Gimnasio David & Goliat.  Reemplazo de Producto: Si se debe enviar un producto nuevo debidoa una situación especial acordada, los gastos de envío serán
asumidos por Gimnasio David & Goliat. 4. Excepciones y Consideraciones
 Productos No Elegibles para Reembolso: Los productos que nocumplan con las condiciones de devolución serán devueltos al clientesin reembolso.
 Errores de Gimnasio David & Goliat: Los gastos de envío paraladevolución y el reemplazo del producto serán asumidos por el
gimnasio en caso de errores. COMPROBACIÓN ANTIFRAUDE
La compra del cliente puede ser aplazada para la comprobación antifraude. También puede ser suspendida por más tiempo para una investigación másrigurosa, para evitar transacciones fraudulentas. PRIVACIDAD
Este localhost:3000 garantiza que la información personal que usted envíacuenta con la seguridad necesaria. Los datos ingresados por el usuariooenel caso de requerir una validación de los pedidos no serán entregados aterceros, salvo que deba ser revelada en cumplimiento a una orden judicial orequerimientos legales. La suscripción a boletines de correos electrónicos publicitarios es voluntariaypodría ser seleccionada al momento de crear su cuenta. Gimnasio David & Goliat reserva los derechos de cambiar o modificar estostérminos sin previo aviso.
              {/* Agrega aquí el texto completo de los términos */}
              </p>
          </div>
        )}
        {activeSection === 'privacy' && (
          <div className="scrollable-content">
            <h2 >Política de Privacidad</h2>
            <p>
              {/* Texto largo de política de privacidad */}
              Política de privacidad
Última actualización: 7 de septiembre de 2024
Esta Política de Privacidad describe Nuestras políticas y procedimientos sobre la
recopilación, uso y divulgación de Su información cuando utiliza el Servicio y le informa
sobre Sus derechos de privacidad y cómo la ley lo protege. Utilizamos sus datos personales para proporcionar y mejorar el Servicio. Al utilizar el
Servicio, usted acepta la recopilación y el uso de información de acuerdo con esta Política deprivacidad. Esta Política de privacidad se ha creado con la ayuda del Generador de políticas
de privacidad . Interpretación y definiciones
Interpretación
Las palabras cuya letra inicial está en mayúscula tienen significados definidos en las
siguientes condiciones. Las siguientes definiciones tendrán el mismo significado
independientemente de que aparezcan en singular o en plural. Definiciones
A los efectos de esta Política de Privacidad:
Cuenta significa una cuenta única creada para que Usted acceda a nuestro Servicioopartes de nuestro Servicio. Afiliado significa una entidad que controla, es controlada por o está bajo control
común con una parte, donde "control" significa propiedad del 50%o más de las
acciones, participación patrimonial u otros valores con derecho a voto para la
elección de directores u otra autoridad administrativa. La empresa (a la que en este Acuerdo se hace referencia como "la empresa", "nosotros", "nos" o "nuestro") se refiere a Gimnasio David & Goliat, Tv. 14c Este
#5489, Bogotá. Las cookies son pequeños archivos que un sitio web coloca en su computadora, dispositivo móvil o cualquier otro dispositivo y que contienen los detalles de suhistorial de navegación en ese sitio web, entre sus muchos usos. País se refiere a: Colombia
Dispositivo significa cualquier dispositivo que pueda acceder al Servicio, como unacomputadora, un teléfono celular o una tableta digital. Datos Personales son cualquier información relacionada con una persona física
identificada o identificable. El servicio se refiere al sitio web. Proveedor de servicios significa cualquier persona física o jurídica que procesa los
datos en nombre de la Compañía. Se refiere a empresas o individuos de terceros
empleados por la Compañía para facilitar el Servicio, para proporcionar el Servicio
en nombre de la Compañía, para realizar servicios relacionados con el Servicio opara ayudar a la Compañía a analizar cómo se utiliza el Servicio. Los datos de uso se refieren a los datos recopilados automáticamente, ya sea
generados por el uso del Servicio o por la propia infraestructura del Servicio (por
ejemplo, la duración de la visita a una página). El sitio web se refiere a Gimnasio David & Goliat, accesible desde localhost:3000Usted significa el individuo que accede o utiliza el Servicio, o la empresa u otra
entidad legal en nombre de la cual dicho individuo accede o utiliza el Servicio, segúncorresponda. Recopilación y uso de sus datos personales
Tipos de datos recopilados
Datos personales
Al utilizar nuestro Servicio, podemos solicitarle que nos proporcione cierta informacióndeidentificación personal que se puede utilizar para contactarlo o identificarlo. La informaciónde identificación personal puede incluir, entre otras cosas:
Dirección de correo electrónico
Nombre y apellido
Número de teléfono
Datos de uso
Datos de uso
Los datos de uso se recopilan automáticamente al utilizar el Servicio. Los datos de uso pueden incluir información como la dirección de protocolo de Internet desu dispositivo (por ejemplo, dirección IP), el tipo de navegador, la versión del navegador, las
páginas de nuestro Servicio que visita, la hora y la fecha de su visita, el tiempo dedicado a
esas páginas, identificadores únicos del dispositivo y otros datos de diagnóstico. Cuando accede al Servicio mediante o a través de un dispositivo móvil, podemos recopilar
cierta información automáticamente, incluyendo, entre otros, el tipo de dispositivo móvil
que utiliza, la identificación única de su dispositivo móvil, la dirección IP de su dispositivomóvil, su sistema operativo móvil, el tipo de navegador de Internet móvil que utiliza, identificadores únicos de dispositivo y otros datos de diagnóstico. También podemos recopilar información que su navegador envía cada vez que visita
nuestro Servicio o cuando accede al Servicio mediante un dispositivo móvil. Tecnologías de seguimiento y cookies
Utilizamos cookies y tecnologías de seguimiento similares para rastrear la actividad ennuestro Servicio y almacenar cierta información. Las tecnologías de seguimiento utilizadas
son balizas, etiquetas y scripts para recopilar y rastrear información y para mejorar y
analizar nuestro Servicio. Las tecnologías que utilizamos pueden incluir:
 Cookies o Cookies del Navegador. Una cookie es un pequeño archivo que se coloca enSu Dispositivo. Usted puede indicarle a Su navegador que rechace todas las Cookies oque le indique cuándo se envía una Cookie. Sin embargo, si no acepta las Cookies, es
posible que no pueda utilizar algunas partes de nuestro Servicio. A menos que haya
ajustado la configuración de Su navegador para que rechace las Cookies, nuestro
Servicio puede utilizar Cookies.  Balizas web. Algunas secciones de nuestro Servicio y nuestros correos electrónicos
pueden contener pequeños archivos electrónicos conocidos como balizas web (tambiénconocidos como gifs transparentes, etiquetas de píxeles y gifs de un solo píxel) que
permiten a la Compañía, por ejemplo, contar los usuarios que han visitado esas páginas
o han abierto un correo electrónico y para otras estadísticas relacionadas con el sitioweb (por ejemplo, registrar la popularidad de una determinada sección y verificar la
integridad del sistema y del servidor). Las cookies pueden ser "persistentes" o "de sesión". Las cookies persistentes permanecenen su computadora personal o dispositivo móvil cuando se desconecta, mientras que las
cookies de sesión se eliminan tan pronto como cierra su navegador web. Obtenga más
información sobre las cookies en el artículo del sitio web Políticas de privacidad . Utilizamos cookies de sesión y persistentes para los fines que se detallan a continuación:
Cookies necesarias/esenciales
Tipo: Cookies de sesión
Administrado por: Nosotros
Finalidad: Estas cookies son esenciales para proporcionarle los servicios disponiblesa través del sitio web y permitirle utilizar algunas de sus funciones. Ayudan a
autenticar a los usuarios y a evitar el uso fraudulento de las cuentas de usuario. Sinestas cookies, no se pueden proporcionar los servicios que ha solicitado y solo
utilizamos estas cookies para proporcionarle dichos servicios. Política de Cookies / Aviso de Aceptación de Cookies
Tipo: Cookies persistentes
Administrado por: Nosotros
Finalidad: Estas Cookies identifican si los usuarios han aceptado el uso de cookies enel Sitio Web. Cookies de funcionalidad
Tipo: Cookies persistentes
Administrado por: Nosotros
Finalidad: Estas cookies nos permiten recordar las opciones que usted elige cuandoutiliza el sitio web, como por ejemplo sus datos de acceso o su preferencia de idioma. La finalidad de estas cookies es proporcionarle una experiencia más personalizadayevitar que tenga que volver a introducir sus preferencias cada vez que utilice el sitioweb.
Para obtener más información sobre las cookies que utilizamos y sus opciones con respectoa las cookies, visite nuestra Política de cookies o la sección de Cookies de nuestra Política deprivacidad. Uso de sus datos personales
La Compañía podrá utilizar los Datos Personales para los siguientes fines:
Para proporcionar y mantener nuestro Servicio , incluido el seguimiento del usodel mismo. Para gestionar su cuenta: para gestionar su registro como usuario del Servicio. Los
Datos Personales que proporcione pueden darle acceso a diferentes funcionalidades
del Servicio que están disponibles para usted como usuario registrado. Para la ejecución de un contrato: el desarrollo, cumplimiento y ejecución del
contrato de compra de los productos, artículos o servicios que Usted ha adquiridoode cualquier otro contrato con Nosotros a través del Servicio. Para comunicarnos con Usted: Para comunicarnos con Usted por correo
electrónico, llamadas telefónicas, SMS u otras formas equivalentes de comunicaciónelectrónica, como las notificaciones push de una aplicación móvil sobre
actualizaciones o comunicaciones informativas relacionadas con las funcionalidades, productos o servicios contratados, incluidas las actualizaciones de seguridad, cuando sea necesario o razonable para su implementación. Para brindarle noticias, ofertas especiales e información general sobre otros bienes, servicios y eventos que ofrecemos y que sean similares a los que ya ha compradooconsultado, a menos que haya optado por no recibir dicha información. Para gestionar sus solicitudes: Para atender y gestionar las solicitudes que nos
envíe. Para transferencias comerciales: Podemos utilizar su información para evaluar ollevar a cabo una fusión, desinversión, reestructuración, reorganización, disoluciónu otra venta o transferencia de algunos o todos nuestros activos, ya sea como unnegocio en marcha o como parte de una quiebra, liquidación o procedimiento
similar, en el que los datos personales que tenemos sobre los usuarios de nuestroServicio se encuentran entre los activos transferidos. Para otros fines : Podemos utilizar su información para otros fines, como análisis
de datos, identificación de tendencias de uso, determinación de la efectividad de
nuestras campañas promocionales y para evaluar y mejorar nuestro Servicio, productos, servicios, marketing y su experiencia. Podemos compartir su información personal en las siguientes situaciones:  Con proveedores de servicios: Podemos compartir su información personal con
proveedores de servicios para monitorear y analizar el uso de nuestro Servicio y para
comunicarnos con usted.  Para transferencias comerciales: Podemos compartir o transferir su informaciónpersonal en relación con, o durante las negociaciones de, cualquier fusión, venta de
activos de la empresa, financiamiento o adquisición de la totalidad o parte de nuestronegocio a otra empresa.  Con afiliados: podemos compartir su información con nuestros afiliados, en cuyo casoles exigiremos que respeten esta Política de privacidad. Los afiliados incluyen nuestra
empresa matriz y cualquier otra subsidiaria, socios de empresas conjuntas u otras
empresas que controlamos o que están bajo control común con nosotros.  Con socios comerciales: Podemos compartir su información con nuestros socios
comerciales para ofrecerle ciertos productos, servicios o promociones.  Con otros usuarios: cuando Usted comparte información personal o interactúa de otramanera en áreas públicas con otros usuarios, dicha información puede ser vista por
todos los usuarios y puede distribuirse públicamente en el exterior.  Con su consentimiento : Podemos divulgar su información personal para cualquier
otro propósito con su consentimiento. Conservación de sus datos personales
La Compañía conservará sus Datos Personales únicamente durante el tiempo que sea
necesario para los fines establecidos en esta Política de Privacidad. Conservaremos y
utilizaremos sus Datos Personales en la medida necesaria para cumplir con nuestras
obligaciones legales (por ejemplo, si estamos obligados a conservar sus datos para cumplir
con las leyes aplicables), resolver disputas y hacer cumplir nuestros acuerdos y políticas
legales. La Compañía también conservará los Datos de uso para fines de análisis interno. Los Datos
de uso generalmente se conservan durante un período de tiempo más corto, excepto cuandoestos datos se utilizan para fortalecer la seguridad o mejorar la funcionalidad de NuestroServicio, o estamos obligados legalmente a conservar estos datos durante períodos de
tiempo más largos. Transferencia de sus datos personales
Su información, incluidos los Datos Personales, se procesa en las oficinas operativas de la
Compañía y en cualquier otro lugar donde se encuentren las partes involucradas en el
procesamiento. Esto significa que esta información puede transferirse a computadoras
ubicadas fuera de su estado, provincia, país u otra jurisdicción gubernamental donde las
leyes de protección de datos pueden diferir de las de su jurisdicción y mantenerse en ellas. Su consentimiento a esta Política de privacidad seguido de su envío de dicha informaciónrepresenta su aceptación de dicha transferencia. La Compañía tomará todas las medidas razonablemente necesarias para garantizar que sus
datos sean tratados de forma segura y de acuerdo con esta Política de privacidad y no se
realizará ninguna transferencia de sus datos personales a una organización o un país a
menos que existan controles adecuados, incluida la seguridad de sus datos y otra
información personal.
Eliminar sus datos personales
Tiene derecho a eliminar o solicitar que le ayudemos a eliminar los Datos Personales que
hemos recopilado sobre usted. Nuestro Servicio puede brindarle la posibilidad de eliminar cierta información sobre usteddesde el Servicio. Puede actualizar, modificar o eliminar su información en cualquier momento iniciando
sesión en su cuenta, si tiene una, y visitando la sección de configuración de la cuenta que lepermite administrar su información personal. También puede comunicarse con nosotros
para solicitar acceso, corregir o eliminar cualquier información personal que nos haya
proporcionado. Sin embargo, tenga en cuenta que es posible que necesitemos conservar cierta informacióncuando tengamos una obligación legal o una base legal para hacerlo. Divulgación de sus datos personales
Transacciones comerciales
Si la Compañía participa en una fusión, adquisición o venta de activos, sus Datos Personales
pueden ser transferidos. Le notificaremos antes de que sus Datos Personales sean
transferidos y queden sujetos a una Política de Privacidad diferente. Aplicación de la ley
En determinadas circunstancias, la Compañía puede estar obligada a divulgar sus Datos
Personales si así lo exige la ley o en respuesta a solicitudes válidas de autoridades públicas
(por ejemplo, un tribunal o una agencia gubernamental). Otros requisitos legales
La Compañía podrá divulgar sus Datos Personales creyendo de buena fe que dicha acciónes
necesaria para:  Cumplir con una obligación legal  Proteger y defender los derechos o propiedad de la Compañía
 Prevenir o investigar posibles infracciones en relación con el Servicio
 Proteger la seguridad personal de los Usuarios del Servicio o del público
 Protegerse contra la responsabilidad legal
Seguridad de sus datos personales
La seguridad de sus datos personales es importante para nosotros, pero recuerde que
ningún método de transmisión por Internet o método de almacenamiento electrónico es
100 % seguro. Si bien nos esforzamos por utilizar medios comercialmente aceptables paraproteger sus datos personales, no podemos garantizar su seguridad absoluta.
Privacidad de los niños
Nuestro Servicio no está dirigido a ninguna persona menor de 13 años. No recopilamos
deliberadamente información de identificación personal de ninguna persona menor de 13años. Si usted es padre o tutor y sabe que su hijo nos ha proporcionado datos personales, comuníquese con nosotros. Si nos damos cuenta de que hemos recopilado datos personales
de cualquier persona menor de 13 años sin verificar el consentimiento de los padres, tomamos medidas para eliminar esa información de nuestros servidores. Si necesitamos confiar en el consentimiento como base legal para procesar su informaciónysu país requiere el consentimiento de uno de sus padres, es posible que solicitemos el
consentimiento de sus padres antes de recopilar y utilizar esa información. Enlaces a otros sitios web
Nuestro Servicio puede contener enlaces a otros sitios web que no son operados por
Nosotros. Si hace clic en un enlace de un tercero, será dirigido al sitio de ese tercero. Le
recomendamos encarecidamente que revise la Política de privacidad de cada sitio que visite. No tenemos control ni asumimos ninguna responsabilidad por el contenido, las políticas deprivacidad o las prácticas de sitios o servicios de terceros. Cambios a esta Política de Privacidad
Es posible que actualicemos nuestra Política de privacidad de vez en cuando. Le
notificaremos cualquier cambio publicando la nueva Política de privacidad en esta página. Le informaremos por correo electrónico y/o un aviso destacado en nuestro Servicio, antes
de que el cambio entre en vigencia y actualizaremos la fecha de "Última actualización" enlaparte superior de esta Política de privacidad. Se recomienda revisar periódicamente esta Política de privacidad para comprobar si se hanproducido cambios. Los cambios a esta Política de privacidad entran en vigor cuando se
publican en esta página. Contáctenos
Si tiene alguna pregunta sobre esta Política de Privacidad, puede contactarnos:  Por número de teléfono: (601) 456-7890
              {/* Agrega aquí el texto completo de la política de privacidad */}
              </p>
          </div>
        )}

            <div className="terms-buttons">
            <button className="cancel-buttons" onClick={handleCancel}>Cancelar</button>
            <button className="accept-buttons" onClick={handleAccept}>Aceptar</button>
            </div>

      </div>


    </div>
  );
};

export default TermsPage;