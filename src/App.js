import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { ProductsContext } from './context/ProductsContext';
import Plans from "./components/Plans/Plans";
import RegisterForm from "./pages/Auth/RegisterPage/Register";
import ClientPage from "./components/IndexCliente/IndexCliente";
import AdminPage from "./components/adminEmpleadoIndex/adminEmpleadoIndex";
import VerProducto from "./components/VerProductos/VerProductos";
import Carousel from "./components/Carousel/Carousel";
import VerClases from "./components/VerClases/VerClases";
import PlanDetails from "./pages/Planes/VerPlan";
import RutinesPage from "./pages/Client/RoutinesPage/RoutinesPage";
import LoginP from "./pages/Auth/LoginPage/LoginPage";
import ProductsPage from "./pages/Client/ProductsPage/ProductsPage";
import ClasesPage from "./pages/Client/ClassesPage/ClassesPage";
import VerCliente from "./components/VerCliente/VerCliente";
import ClienteForm from "./Forms/ClienteForm/ClienteForm";
import RutinaAdminIndex from "./components/Rutina/RutinaAdminIndex";
import MapComponent from "./components/Mapa/MapComponent";
import { ClassesProvider } from "./context/ClasesContext";
import { ProductsProvider } from "./context/ProductsContext";
import { RoleProvider } from "./context/RoleContext";
import CategoryCircles from "./components/CategoryCircles/CategoryCircles";
import SearchBar from "./components/SearchBar/SearchBar";
import ProductPagePersonal from "./pages/Client/ProductsPage/ProductPagePersonal";
import './Modal.css';
import './App.css';
import Modal from './components/Modal/Modal';
import VerTicketera from './components/Ticketera/VerTicketera';
import Planes from './pages/Planes/Planes';
import Comprobant from './pages/Client/PaymentsPage/Comprobant';
import Payments from './pages/Client/PaymentsPage/PaymentsPage';
import RutinasCliente from './components/Rutina/RutinasCliente';
import ClassDetail from './pages/Client/ClassesPage/ClasesDetailsPage';
import CalendarClases from './components/VerClases/VerClases';
import Productos from './components/ProductCard/Productos';
import Checkout from './components/checkout/Checkout';
import MisClases from './pages/Client/ClassesPage/MisClases';
import MisPlanes from './pages/Planes/MisPlanes';
import PlanesPage from './pages/Planes/planesPage';
import Productp1 from './components/Product/Productp1';
import ProductCard from './components/ProductCard/ProductCard';
import AdminConfirmacion from './components/Ticketera/Admin/Confirmacion';

function App() {
  const [showModal, setShowModal] = useState(false);

  const productsContext = useContext(ProductsContext);
  const { filteredProducts = [], products = [] } = productsContext || {};

  useEffect(() => {
    console.log("filteredProducts:", filteredProducts);
    console.log("products:", products);
  }, [filteredProducts, products]);

  const productsToShow = filteredProducts.length > 0 ? filteredProducts : products;

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <RoleProvider>
      <ClassesProvider>
        <div className="app-container">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Carousel />
                  <Plans openModal={handleOpenModal} />
                  <CategoryCircles />
                  <div className="content-container">
                    <div className="searchbar-container">
                      <SearchBar />
                    </div>
                    <div className="products-section">
                      <h2>Productos</h2>
                      <div className="products-grid">
                        {productsToShow.length > 0 ? (
                          productsToShow.map((product, index) => (
                            <ProductCard key={index} product={product} />
                          ))
                        ) : (
                          <p>No hay productos disponibles.</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <Footer className="footer" />
                  <Modal show={showModal} onClose={handleCloseModal}>
                    <PaymentForm onClose={handleCloseModal} />
                  </Modal>
                </>
              }
            />
            <Route path="/MisClases/*" element={<MisClases />} />
            <Route path="/Checkout/*" element={<Checkout />} />
            <Route path="/ClienteIndex/*" element={<ClientPage />} />
            <Route path="/adminEmpleadoIndex/*" element={<AdminPage />} />
            <Route path="/LoginP/*" element={<LoginP />} />
            <Route path="/Register/*" element={<RegisterForm />} />
            <Route path="/VerProducto/*" element={<VerProducto />} />
            <Route path="/VerClases/*" element={<VerClases />} />
            <Route path="PlanDetails/:planId" element={<PlanDetails />} />
            <Route path="/ClasesPage/*" element={<ClasesPage />} />
            <Route path="/ProductsPage/*" element={<ProductsPage />} />
            <Route path="/products/:category" element={<ProductPagePersonal />} />
            <Route path="/RutinesClient/*" element={<RutinesPage />} />
            <Route path="/VerCliente/*" element={<VerCliente />} />
            <Route path="/ClienteForm/*" element={<ClienteForm />} />
            <Route path="/Comprobant/*" element={<Comprobant />} />
            <Route path="/VerTicketera/*" element={<VerTicketera />} />
            <Route path="/PlanesPage/*" element={<PlanesPage />} />
            <Route path="/Productp1/:planId" element={<Productp1 />} />
            <Route path="/MisPlanes/*" element={<MisPlanes />} />
            <Route path="/RutinaAdminIndex/*" element={<RutinaAdminIndex />} />
            <Route path="/Payments/*" element={<Payments />} />
            <Route path="/RutinasCliente/*" element={<RutinasCliente />} />
            <Route path="/" element={<CalendarClases />} />
            <Route path="/ClassDetail/:className" element={<ClassDetail />} />
            <Route path="/AdminConfirmacion" element={<AdminConfirmacion />} />
          </Routes>
        </div>
      </ClassesProvider>
    </RoleProvider>
  );
}

function PaymentForm({ onClose }) {
  const navigate = useNavigate();

  const handleSubmitPayment = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      name: formData.get('name'),
      plan: formData.get('plan'),
      phone: formData.get('phone'),
      cost: formData.get('cost'),
      code: formData.get('code'),
      paymentMethod: formData.get('payment-method'),
    };

    alert('Payment Submitted');
    navigate('/Comprobant', { state: data });
    onClose();
  };

  return (
    <form className="modal-form" onSubmit={handleSubmitPayment}>
      <div>
        <label htmlFor="name">Nombre:</label>
        <input type="text" id="name" name="name" required />
      </div>
      <div>
        <label htmlFor="plan">Plan:</label>
        <select id="plan" name="plan" required>
          <option value="">Selecciona un plan</option>
          <option value="Mensualidad">Mensualidad</option>
          <option value="Trimestre">Trimestre</option>
          <option value="Semestre">Semestre</option>
          <option value="Año">Año</option>
        </select>
      </div>
      <div>
        <label htmlFor="phone">Teléfono:</label>
        <input type="tel" id="phone" name="phone" required />
      </div>
      <div>
        <label htmlFor="cost">Costo:</label>
        <input type="number" id="cost" name="cost" required />
      </div>
      <div>
        <label htmlFor="code">Código:</label>
        <input type="text" id="code" name="code" required />
      </div>
      <div>
        <label htmlFor="payment-method">Método de Pago:</label>
        <select id="payment-method" name="payment-method" required>
          <option value="">Selecciona un método</option>
          <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
          <option value="Transferencia Bancaria">Transferencia Bancaria</option>
          <option value="PayPal">Crediculo</option>
        </select>
      </div>
      <button type="submit">Realizar Pago</button>
      <button type="button" className="cancel" onClick={onClose}>Cancelar Pago</button>
    </form>
  );
}

export default App;
