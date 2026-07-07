// src/services/firestoreService.ts
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

// Obtener todos los documentos de una colección
export const getCollection = async <T>(collectionName: string): Promise<T[]> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const items: T[] = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() } as T);
  });
  return items;
};

// Obtener un documento por ID
export const getDocument = async <T>(collectionName: string, id: string): Promise<T | null> => {
  try {
    console.log(`📄 getDocument: ${collectionName}/${id}`);
    const docSnap = await getDoc(doc(db, collectionName, id));
    if (docSnap.exists()) {
      console.log('✅ Documento existe:', docSnap.data());
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    console.log('❌ Documento no existe');
    return null;
  } catch (error) {
    console.error('❌ Error en getDocument:', error);
    throw error;
  }
};

// Agregar un documento (Firestore genera ID automáticamente)
export const addDocument = async <T>(collectionName: string, data: Omit<T, 'id'>): Promise<T> => {
  const docRef = await addDoc(collection(db, collectionName), data);
  return { id: docRef.id, ...data } as T;
};

// Actualizar un documento
export const updateDocument = async <T>(collectionName: string, id: string, updates: Partial<T>): Promise<void> => {
  await updateDoc(doc(db, collectionName, id), updates);
};

// Eliminar un documento
export const deleteDocument = async (collectionName: string, id: string): Promise<void> => {
  await deleteDoc(doc(db, collectionName, id));
};