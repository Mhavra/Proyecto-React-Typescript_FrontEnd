/**
 * APP - Componente principal de la aplicación
 * 
 * Configura las rutas y el contexto de autenticación.
 * 
 * @component
 */

'use client';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/context/AuthContext';
import PrivateRoute from '@/components/common/PrivateRoute';
import Layout from '@/components/common/Layout';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import ProductosPage from '@/pages/ProductosPage';
import ProductoDetallePage from '@/pages/ProductoDetallePage';
import PedidosPage from '@/pages/PedidosPage';
import ConsultasPage from '@/pages/ConsultasPage';
import UsuariosPage from '@/pages/UsuariosPage';

function AppRoutes() {
  const { user, logout } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout user={user!} onLogout={logout}>
              <DashboardPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/productos"
        element={
          <PrivateRoute>
            <Layout user={user!} onLogout={logout}>
              <ProductosPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/productos/:id"
        element={
          <PrivateRoute>
            <Layout user={user!} onLogout={logout}>
              <ProductoDetallePage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/pedidos"
        element={
          <PrivateRoute>
            <Layout user={user!} onLogout={logout}>
              <PedidosPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/consultas"
        element={
          <PrivateRoute>
            <Layout user={user!} onLogout={logout}>
              <ConsultasPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/usuarios"
        element={
          <PrivateRoute>
            <Layout user={user!} onLogout={logout}>
              <UsuariosPage />
            </Layout>
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