'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { getDocument, setDocument } from '@/services/firestoreService';  //  Importamos setDocument
import { Usuario, AuthContextType } from '@/interfaces';

// Función para obtener o crear usuario en Firestore
const getOrCreateUsuario = async (firebaseUser: FirebaseUser): Promise<Usuario> => {
  const uid = firebaseUser.uid;
  
  // 1. Intentar obtener de Firestore
  let userDoc = await getDocument<Usuario>('usuario', uid);
  
  // 2. Si existe, devolverlo
  if (userDoc) {
    console.log('✅ Usuario encontrado en Firestore:', userDoc);
    return userDoc;
  }
  
  // 3. Si no existe, CREARLO automáticamente
  console.log('🆕 Usuario no encontrado en Firestore. Creando...');
  
  const nombre = firebaseUser.displayName || 
                 firebaseUser.email?.split('@')[0] || 
                 'Usuario';
  
  const nuevoUsuario: Omit<Usuario, 'id'> = {
    nombre: nombre,
    email: firebaseUser.email || '',
    rol: 'cliente',
  };
  
  // Guardar en Firestore con el UID como ID del documento
  await setDocument('usuario', uid, nuevoUsuario);
  
  const usuarioCreado: Usuario = {
    id: uid,
    ...nuevoUsuario,
  };
  
  console.log('✅ Usuario creado en Firestore:', usuarioCreado);
  return usuarioCreado;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Obtener o crear el usuario en Firestore
        const userData = await getOrCreateUsuario(firebaseUser);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await getOrCreateUsuario(userCredential.user);
      setUser(userData);
      setIsAuthenticated(true);
      console.log('🔐 Login exitoso, usuario:', userData);
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