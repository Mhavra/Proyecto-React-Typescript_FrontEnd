// src/context/AuthContext.tsx
// Contexto de autenticación con Firebase Authentication.
// Reemplaza el login simulado de la ES3.

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/firebase/config';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  AuthError,
} from 'firebase/auth';
import { Usuario, AuthContextType } from '@/interfaces';
import { storage, STORAGE_KEYS } from '@/services/localStorageService';

/**
 * Convierte un usuario de Firebase a nuestro tipo Usuario.
 * - El ID de Firebase (uid) lo usamos como identificador único,
 *   pero el rol y nombre se toman de localStorage (usuarios predefinidos).
 */
const mapFirebaseUser = (user: User): Usuario => {
  return {
    id: Number(user.uid) || 999, // Fallback por si no se puede convertir
    nombre: user.displayName || user.email?.split('@')[0] || 'Usuario',
    email: user.email || '',
    password: '',
    rol: 'cliente', // Por defecto, hasta que carguemos el rol desde localStorage
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * onAuthStateChanged: Mantiene la sesión activa entre recargas.
   * Escucha cambios en el estado de autenticación de Firebase.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const mappedUser = mapFirebaseUser(firebaseUser);
        // Buscar el usuario en localStorage para obtener su rol y nombre completo
        const storedUsers = storage.get<Usuario>(STORAGE_KEYS.USUARIOS);
        const storedUser = storedUsers.find((u) => u.email === mappedUser.email);
        if (storedUser) {
          mappedUser.rol = storedUser.rol;
          mappedUser.nombre = storedUser.nombre;
          mappedUser.id = storedUser.id;
        }
        setUser(mappedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  /**
   * Inicio de sesión con Firebase Authentication.
   * Usa signInWithEmailAndPassword y maneja errores con mensajes amigables.
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      const firebaseError = error as AuthError;
      let message = 'Error al iniciar sesión.';
      switch (firebaseError.code) {
        case 'auth/user-not-found':
          message = 'No hay usuario con este correo.';
          break;
        case 'auth/wrong-password':
          message = 'Contraseña incorrecta.';
          break;
        case 'auth/too-many-requests':
          message = 'Demasiados intentos. Intenta más tarde.';
          break;
        default:
          message = firebaseError.message;
      }
      throw new Error(message);
    }
  };

  /**
   * Cierre de sesión con Firebase Authentication.
   * Usa signOut y limpia el estado local.
   */
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAuthenticated(false);
    // Limpiar sesión en localStorage (por si quedó algo)
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
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}