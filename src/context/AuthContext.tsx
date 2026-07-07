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
import { getDocument } from '@/services/firestoreService';
import { Usuario, AuthContextType } from '@/interfaces';

const getUsuarioFromFirestore = async (uid: string): Promise<Usuario | null> => {
  try {
    // 🔥 Ahora busca en la colección 'usuario' (singular) porque así está en Firestore
    const userDoc = await getDocument<Usuario>('usuario', uid);
    if (userDoc) {
      console.log('✅ Usuario encontrado en Firestore:', userDoc);
      return userDoc;
    }
    console.warn('⚠️ No se encontró documento en Firestore para UID:', uid);
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

  const mapFirebaseUser = async (firebaseUser: FirebaseUser | null): Promise<Usuario | null> => {
    if (!firebaseUser) return null;
    
    let userData = await getUsuarioFromFirestore(firebaseUser.uid);
    
    if (!userData) {
      console.log('🆕 Creando usuario por defecto (cliente) para:', firebaseUser.email);
      userData = {
        id: firebaseUser.uid,
        nombre: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
        email: firebaseUser.email || '',
        rol: 'cliente',
      };
    }
    return userData;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const mapped = await mapFirebaseUser(firebaseUser);
      setUser(mapped);
      setIsAuthenticated(!!mapped);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const mapped = await mapFirebaseUser(userCredential.user);
      setUser(mapped);
      setIsAuthenticated(true);
      console.log('🔐 Login exitoso, usuario:', mapped);
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