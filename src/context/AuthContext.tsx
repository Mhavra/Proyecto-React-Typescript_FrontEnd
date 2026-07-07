// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { getDocument, getCollection } from '@/services/firestoreService';
import { Usuario, AuthContextType } from '@/interfaces';

const getUsuarioFromFirestore = async (uid: string, email?: string): Promise<Usuario | null> => {
  try {
    // Buscar por UID (el documento tiene ID = uid)
    const userDoc = await getDocument<Usuario>('usuarios', uid);
    if (userDoc) return userDoc;
    
    // Si no, buscar por email
    if (email) {
      const usuarios = await getCollection<Usuario>('usuarios');
      const encontrado = usuarios.find(u => u.email === email);
      return encontrado || null;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener usuario de Firestore:', error);
    return null;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función que mapea el usuario de Firebase con el rol de Firestore
  const mapFirebaseUser = async (firebaseUser: FirebaseUser | null): Promise<Usuario | null> => {
    if (!firebaseUser) return null;
    
    let userData = await getUsuarioFromFirestore(firebaseUser.uid, firebaseUser.email || undefined);
    
    // Si no existe en Firestore, crear uno por defecto (cliente)
    if (!userData) {
      userData = {
        id: firebaseUser.uid,
        nombre: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
        email: firebaseUser.email || '',
        rol: 'cliente',
      };
    }
    return userData;
  };

  // Escuchar cambios de autenticación (persistencia de sesión)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const mapped = await mapFirebaseUser(firebaseUser);
      setUser(mapped);
      setIsAuthenticated(!!mapped);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Función de login (espera a que el usuario esté completamente mapeado)
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Esperamos a que se obtenga el usuario con rol de Firestore
      const mapped = await mapFirebaseUser(userCredential.user);
      setUser(mapped);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
    setUser(null);
    setIsAuthenticated(false);
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
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}