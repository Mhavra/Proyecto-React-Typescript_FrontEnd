/**
 * APP - Componente principal de la aplicación
 * 
 * Configura las rutas y el contexto de autenticación.
 * 
 * @component
 */

'use client';
// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import PrivateRoute from '@/components/common/PrivateRoute';
import Layout from '@/components/common/Layout';
import LoginPage from '@/pages/LoginPage';
import TiendaPage from '@/pages/TiendaPage'; // <-- Importa la nueva página
import DashboardPage from '@/pages/DashboardPage';
// ... resto de imports

function AppRoutes() {
  const { user, logout } = useAuth();

  return (
    <Routes>
      {/* Ruta PÚBLICA: La tienda, visible para todos */}
      <Route path="/" element={<TiendaPage />} />

      {/* Ruta PÚBLICA: Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* --- RUTAS PRIVADAS (requieren login) --- */}
      <Route
        path="/dashboard"
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
      {/* ... resto de rutas de admin (pedidos, consultas, usuarios) */}
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