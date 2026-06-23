'use client';

import { useEffect } from 'react'; //useEffect para redirigir si no está autenticado o no tiene el rol 
import { useNavigate } from 'react-router-dom'; //useNavigate para redirigir a login o tienda según le coloque
import { useAuth } from '@/context/AuthContext'; //useAuth para obtener el estado de autenticación y el usuario actual

/**
 * PRIVATE ROUTE - Componente de protección de rutas
 * 
 * Solo permite el acceso a usuarios autenticados con los roles permitidos.
 * Redirige automáticamente a /login si no está autenticado,
 * o a / si no tiene el rol requerido.
 * 
 * component
 * param props.children - Componentes hijos a renderizar si pasa la verificación
 * param props.allowedRoles - Array de roles permitidos (por defecto solo ['admin'])
 */

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // opcional, por defecto solo admin
}

export default function PrivateRoute({ children, allowedRoles = ['admin'] }: PrivateRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  /**
   * Efecto que verifica la autenticación y los roles
   * Redirige según corresponda
   */
  useEffect(() => {
    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user && !allowedRoles.includes(user.rol)) {
      // Si no tiene el rol permitido, redirigir a la tienda
      navigate('/');
    }
  }, [isAuthenticated, user, allowedRoles, navigate]);
  // Muestra un loading mientras se verifica la autenticación
  if (!isAuthenticated || !user || !allowedRoles.includes(user.rol)) {
    return <div className="text-center py-5">Cargando...</div>;
  }
  // Si pasa todas las verificaciones, renderiza los hijos
  return <>{children}</>;
}