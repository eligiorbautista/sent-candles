import './styles/App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Header from './components/user/layout/Header.jsx';
import Footer from './components/user/layout/Footer.jsx';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ForgotPassword from './pages/admin/ForgotPassword';
import ResetPassword from './pages/admin/ResetPassword';
import ProductsManager from './pages/admin/ProductsManager';
import EventsManager from './pages/admin/EventsManager';
import Settings from './pages/admin/Settings';
import ContentManager from './pages/admin/ContentManager';
import AssetsManager from './pages/admin/AssetsManager';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white">
      {!isAdminRoute && <Header />}
      <main className={`${!isAdminRoute ? 'pt-16 sm:pt-20' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot" element={<ForgotPassword />} />
          <Route path="/admin/reset-password" element={<ResetPassword />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ProductsManager />} />
          <Route path="/admin/events" element={<EventsManager />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/content" element={<ContentManager />} />
          <Route path="/admin/assets" element={<AssetsManager />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
