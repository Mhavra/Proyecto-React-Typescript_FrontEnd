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

/**
 * Usuarios por defecto (se crean si no existen en localStorage)
 */
const DEFAULT_USERS: Usuario[] = [
  {
    id: 1,
    nombre: 'Administrador',
    email: 'admin@frenesi.cl',
    password: '123456',
    rol: 'admin',
  },
  {
    id: 2,
    nombre: 'Cliente Demo',
    email: 'cliente@frenesi.cl',
    password: '123456',
    rol: 'cliente',
  },
];

/**
 * Proveedor del contexto de autenticación
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Cargar sesión desde localStorage al montar el componente
   */
  useEffect(() => {
    const session = storage.getItemById<{ id: number; userId: number }>(STORAGE_KEYS.SESSION, 1);
    if (session) {
      const users = storage.get<Usuario>(STORAGE_KEYS.USUARIOS);
      const foundUser = users.find(u => u.id === session.userId);
      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
      }
    }
    setLoading(false);
  }, []);

  /**
   * Iniciar sesión
   * @param email - Correo del usuario
   * @param password - Contraseña
   * @returns true si el login es exitoso
   */
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
      // Guardar sesión con ID numérico
      storage.addItem(STORAGE_KEYS.SESSION, { userId: foundUser.id });
      return true;
    }
    return false;
  };

  /**
   * Cerrar sesión
   */
  const logout = () => {
    const currentUserId = user?.id;
    setUser(null);
    setIsAuthenticated(false);
    if (currentUserId !== undefined) {
      const items = storage.get<{ id: number; userId: number }>(STORAGE_KEYS.SESSION);
      const filtered = items.filter(item => item.userId !== currentUserId);
      storage.setItem(STORAGE_KEYS.SESSION, filtered);
    }
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

/**
 * Hook para usar el contexto de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}