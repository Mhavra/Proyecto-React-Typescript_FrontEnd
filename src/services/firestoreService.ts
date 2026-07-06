//Nuevo: operaciones CRUD con Firestore

// Los IDs se manejan como number (convertimos desde string).

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/firebase/config';

/**
 * Obtiene todos los documentos de una colección.
 * Convierte el ID string de Firestore a number.
 */
export const getItems = async <T extends { id: number }>(
  collectionName: string
): Promise<T[]> => {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return { ...data, id: Number(doc.id) } as T;
  });
};

/**
 * Agrega un nuevo documento a una colección.
 * Firestore genera automáticamente el ID como string,
 * pero lo convertimos a number al devolverlo.
 */
export const addItem = async <T extends { id: number }>(
  collectionName: string,
  data: Omit<T, 'id'>
): Promise<T> => {
  const docRef = await addDoc(collection(db, collectionName), data);
  return { id: Number(docRef.id), ...data } as T;
};

/**
 * Actualiza un documento existente por ID (número).
 * Internamente convertimos el ID a string para Firestore.
 */
export const updateItem = async <T extends { id: number }>(
  collectionName: string,
  id: number,
  updates: Partial<T>
): Promise<void> => {
  const docRef = doc(db, collectionName, String(id));
  await updateDoc(docRef, updates);
};

/**
 * Elimina un documento por ID (número).
 * Internamente convertimos el ID a string para Firestore.
 */
export const deleteItem = async (
  collectionName: string,
  id: number
): Promise<void> => {
  const docRef = doc(db, collectionName, String(id));
  await deleteDoc(docRef);
};

/**
 * Obtiene un documento por ID (número).
 * Convierte el ID string de Firestore a number.
 */
export const getItemById = async <T extends { id: number }>(
  collectionName: string,
  id: number
): Promise<T | null> => {
  const docRef = doc(db, collectionName, String(id));
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    return { ...data, id: Number(snapshot.id) } as T;
  }
  return null;
};