/**
 * AUTH CONTEXT - Contexto de autenticación
 * 
 * Maneja el estado del usuario autenticado y proporciona
 * funciones de login y logout a toda la aplicación.
 * 
 * @module context/AuthContext
 */

// src/context/AuthContext.tsx (actualizado)
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, AuthContextType } from '@/interfaces';
import { storage, STORAGE_KEYS } from '@/services/localStorageService';

// Creación del contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Usuarios por defecto para inicializar la aplicación
 */
const DEFAULT_USERS: Usuario[] = [
  { id: 1, nombre: 'Administrador', email: 'admin@frenesi.cl', password: '123456', rol: 'admin' },
  { id: 2, nombre: 'Cliente Demo', email: 'cliente@frenesi.cl', password: '123456', rol: 'cliente' },
];

/**
 * Provider del contexto de autenticación
 * 
 * @param props.children - Componentes hijos que tendrán acceso al contexto
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Estado del usuario autenticado
  const [user, setUser] = useState<Usuario | null>(null);
  // Flag de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Estado de carga (para evitar parpadeos)
  const [loading, setLoading] = useState(true);

  /**
   * Efecto para cargar la sesión al iniciar la aplicación
   * Busca en localStorage la sesión activa
   */
  useEffect(() => {
    // Cargar sesión desde localStorage    
    const sessions = storage.get<{ userId: number }>(STORAGE_KEYS.SESSION);
    if (sessions.length > 0) {
      const session = sessions[0];
      // Buscar el usuario correspondiente al ID de la sesión
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
    // Obtener lista de usuarios
    let users = storage.get<Usuario>(STORAGE_KEYS.USUARIOS);
    // Si no hay usuarios, crear los usuarios por defecto
    if (users.length === 0) {
      storage.setItem(STORAGE_KEYS.USUARIOS, DEFAULT_USERS);
      users = DEFAULT_USERS;
    }
    // Buscar usuario por email y contraseña
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      // Guardar sesión
        storage.setItem(STORAGE_KEYS.SESSION, [{ userId: foundUser.id }]);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Eliminar sesión (borrar todos los registros de sesión)
    storage.setItem(STORAGE_KEYS.SESSION, []);
  };
  
  // Mostrar loading mientras se verifica la sesión
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