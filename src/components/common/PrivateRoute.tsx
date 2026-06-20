'use client';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

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