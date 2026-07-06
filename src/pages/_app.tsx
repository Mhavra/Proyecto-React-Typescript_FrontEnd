// src/pages/_app.tsx
// Punto de entrada de la aplicación.
// Aquí se inicializan los productos por defecto en Firestore si no existen.

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

import { getItems, addItem } from '@/services/firestoreService';
import { useEffect } from 'react';
import { defaultProducts } from '@/data/defaultProducts';
import { Producto } from '@/interfaces';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function AppRoutes() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Inicializa productos por defecto en Firestore usando IDs numéricos.
   * Se ejecuta una sola vez al montar la aplicación.
   */
  useEffect(() => {
    const initializeProducts = async () => {
      try {
        // 1. Verificar si ya hay productos en la colección
        const existing = await getItems<Producto>('productos');
        if (existing.length === 0) {
          // 2. Si está vacía, subir todos los productos con sus IDs originales
          for (const product of defaultProducts) {
            // 3. Crear una copia del producto sin el campo id (Firestore lo usa como ID del documento)
            const { id, ...productData } = product;
            // 4. Crear referencia al documento con el ID numérico convertido a string
            const docRef = doc(db, 'productos', String(id));
            // 5. Guardar el documento en Firestore
            await setDoc(docRef, productData);
          }
          console.log('✅ Productos iniciales agregados a Firestore con IDs numéricos (1 al 20)');
        }
      } catch (error) {
        console.error('❌ Error al inicializar productos:', error);
      }
    };
    initializeProducts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Routes>
      {/* Rutas públicas (accesibles sin autenticación) */}
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
            <AdminLayout user={user!} onLogout={handleLogout}>
              <DashboardPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/productos"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminLayout user={user!} onLogout={handleLogout}>
              <ProductosPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/productos/:id"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminLayout user={user!} onLogout={handleLogout}>
              <ProductoDetallePage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/pedidos"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminLayout user={user!} onLogout={handleLogout}>
              <PedidosPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/consultas"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminLayout user={user!} onLogout={handleLogout}>
              <ConsultasPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/usuarios"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminLayout user={user!} onLogout={handleLogout}>
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