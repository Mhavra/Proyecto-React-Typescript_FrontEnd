/**
 * AUTH CONTEXT - Contexto de autenticación
 * 
 * Maneja el estado del usuario autenticado y proporciona
 * funciones de login y logout a toda la aplicación.
 * 
 * @module context/AuthContext
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, AuthContextType } from '@/interfaces';
import { storage, STORAGE_KEYS } from '@/services/localStorageService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USERS: Usuario[] = [
  { id: 1, nombre: 'Administrador', email: 'admin@frenesi.cl', password: '123456', rol: 'admin' },
  { id: 2, nombre: 'Cliente Demo', email: 'cliente@frenesi.cl', password: '123456', rol: 'cliente' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessions = storage.get<{ userId: number }>(STORAGE_KEYS.SESSION);
    if (sessions.length > 0) {
      const session = sessions[0];
      const users = storage.get<Usuario>(STORAGE_KEYS.USUARIOS);
      const foundUser = users.find(u => u.id === session.userId);
      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    let users = storage.get<Usuario>(STORAGE_KEYS.USUARIOS);
    if (users.length === 0) {
      storage.setItem(STORAGE_KEYS.USUARIOS, DEFAULT_USERS);
      users = DEFAULT_USERS;
    }
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      storage.setItem(STORAGE_KEYS.SESSION, [{ userId: foundUser.id }]);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    storage.setItem(STORAGE_KEYS.SESSION, []);
  };

  if (loading) {
    return <div className="text-center py-5">Cargando sesión...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}