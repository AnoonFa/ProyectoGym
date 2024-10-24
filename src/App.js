import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { ProductsContext } from './context/ProductsContext';
import Plans from "./components/Relleno/Relleno";
import RegisterForm from "./pages/Auth/RegisterPage/Register";
import ClientPage from "./components/IndexCliente/IndexCliente";
import AdminPage from "./components/adminEmpleadoIndex/adminEmpleadoIndex";
import Carousel from "./components/Carousel/Carousel";
import VerClases from "./components/VerClases/VerClases";
import PlanDetails from "./pages/Planes/VerPlan";
import RutinesPage from "./pages/Client/RoutinesPage/RoutinesPage";
import LoginP from "./pages/Auth/LoginPage/LoginPage";
import TermsPage from './pages/Auth/LoginPage/TermPage';
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
import Checkout from './components/checkout/Checkout';
import MisClases from './pages/Client/ClassesPage/MisClases';
import MisPlanes from './pages/Planes/MisPlanes';
import PlanesPage from './pages/Planes/planesPage';
import ProductCard from './components/ProductCard/ProductCard';
import AdminConfirmacion from './components/Ticketera/Admin/Confirmacion';
import Relleno from './components/Relleno/Relleno';
import ChangePassword from './pages/Auth/LoginPage/Cambiar-contraseña';
import ResetPassword from './pages/Auth/LoginPage/Cambiar-contraseña2';


function App() {
  const { filteredProducts, products, setFilteredProducts } = useContext(ProductsContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let filtered = products;

    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceRange) {
      const [min, max] = priceRange;
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    setFilteredProducts(filtered);
  }, [categoryFilter, searchTerm, priceRange, products, setFilteredProducts]);

  const handlePriceRangeSelect = (min, max) => {
    setPriceRange([min, max]);
  };

  const handleClearFilters = () => {
    setCategoryFilter(null);
    setSearchTerm('');
    setPriceRange([0, 100000]);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const productsToShow = filteredProducts.length > 0 ? filteredProducts : products;

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
                  <Relleno/>
                  <Carousel />
                  <Planes />
                    
                  <CategoryCircles onCategorySelect={setCategoryFilter} />
                  <div className="content-container">
                    <div className="searchbar-container">
                    <SearchBar 
                    onSearch={setSearchTerm} 
                    onPriceRangeSelect={handlePriceRangeSelect} 
                    onCategorySelect={setCategoryFilter}
                    onClearFilters={handleClearFilters}
                  />
                  </div>
                    <div className="products-section">
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
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cambiar-contraseña" element={<ChangePassword />} />
            <Route path="/restablecer-contraseña/:userId" element={<ResetPassword />} />
            <Route path="/Register/*" element={<RegisterForm />} />
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
