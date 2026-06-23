'use client';

import { useEffect } from 'react'; //useEffect para redirigir si no está autenticado o no tiene el rol 
import { useNavigate } from 'react-router-dom'; //useNavigate para redirigir a login o tienda según le coloque
import { useAuth } from '@/context/AuthContext'; //useAuth para obtener el estado de autenticación y el usuario actual

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // opcional, por defecto solo admin
}

export default function PrivateRoute({ children, allowedRoles = ['admin'] }: PrivateRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user && !allowedRoles.includes(user.rol)) {
      // Si no tiene el rol permitido, redirigir a la tienda
      navigate('/');
    }
  }, [isAuthenticated, user, allowedRoles, navigate]);

  if (!isAuthenticated || !user || !allowedRoles.includes(user.rol)) {
    return <div className="text-center py-5">Cargando...</div>;
  }

  return <>{children}</>;
}