import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Product.css';

const Product = () => {
    return (
        <div>
          <Header />
          <div className="product-page">
            <div className="product-details">
            <img src={require('../../assets/images/planes5.jpg')} alt="Tiquetera práctica libre gimnasio" className="product-image" />
            <div className="product-info">
                <h1>Plan Anual de Gimnasio</h1>
                <p>En este plan te ofrecemos nuestros servicios de máquinas, asesorías y rutinas personalizadas durante un año</p>
                <p className="price">Desde <strong>$550.000</strong></p>
                <p className="note"> No se realizan reembolsos.</p>
                <button className="cta-button">Comprar</button>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </div>
            </div>
          </div>
          <Footer />
        </div>
    );
}

export default Product;
