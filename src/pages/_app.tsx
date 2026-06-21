// src/pages/_app.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import PrivateRoute from '@/components/common/PrivateRoute';
import AdminLayout from '@/components/common/Layout';
import LoginPage from '@/pages/LoginPage';
import TiendaPage from '@/pages/TiendaPage';
import NovedadesPage from '@/pages/NovedadesPage';
import ServicioClientePage from '@/pages/ServicioClientePage';
import CarritoPage from '@/pages/CarritoPage';
import AcercaDeNosotrosPage from '@/pages/AcercaDeNosotrosPage';
import DashboardPage from '@/pages/DashboardPage';
import ProductosPage from '@/pages/ProductosPage';
import ProductoDetallePage from '@/pages/ProductoDetallePage';
import PedidosPage from '@/pages/PedidosPage';
import ConsultasPage from '@/pages/ConsultasPage';
import UsuariosPage from '@/pages/UsuariosPage';

import { storage, STORAGE_KEYS } from '@/services/localStorageService';
import { useEffect } from 'react';
import { defaultProducts } from '@/data/defaultProducts';
import { Producto } from '@/interfaces';

import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


function AppRoutes() {
  const { user, logout } = useAuth();

  // Inicializar productos por defecto
  useEffect(() => {
    const products = storage.get<Producto>(STORAGE_KEYS.PRODUCTOS);
    if (products.length === 0) {
      storage.setItem(STORAGE_KEYS.PRODUCTOS, defaultProducts);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<TiendaPage />} />
      <Route path="/novedades" element={<NovedadesPage />} />
      <Route path="/servicio-cliente" element={<ServicioClientePage />} />
      <Route path="/carrito" element={<CarritoPage />} />
      <Route path="/acerca-de-nosotros" element={<AcercaDeNosotrosPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas privadas (solo admin) */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminLayout user={user!} onLogout={logout}>
              <DashboardPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/productos"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminLayout user={user!} onLogout={logout}>
              <ProductosPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/productos/:id"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminLayout user={user!} onLogout={logout}>
              <ProductoDetallePage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/pedidos"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminLayout user={user!} onLogout={logout}>
              <PedidosPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/consultas"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminLayout user={user!} onLogout={logout}>
              <ConsultasPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/usuarios"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminLayout user={user!} onLogout={logout}>
              <UsuariosPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}