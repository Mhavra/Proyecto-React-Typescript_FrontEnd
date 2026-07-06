// src/services/firestoreService.ts
// Servicio para operaciones CRUD en Firestore.
// Los IDs se manejan como number (convertimos desde string).

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/firebase/config';

export const getItems = async <T extends { id: number }>(
  collectionName: string
): Promise<T[]> => {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return { ...data, id: Number(doc.id) } as T;
  });
};

export const addItem = async <T extends { id: number }>(
  collectionName: string,
  data: Omit<T, 'id'>
): Promise<T> => {
  const docRef = await addDoc(collection(db, collectionName), data);
  return { id: Number(docRef.id), ...data } as T;
};

export const addItemWithId = async (
  collectionName: string,
  id: number,
  data: any
): Promise<any> => {
  const docRef = doc(db, collectionName, String(id));
  await setDoc(docRef as any, data);
  return { id, ...data };
};

export const updateItem = async <T extends { id: number }>(
  collectionName: string,
  id: number,
  updates: Partial<T>
): Promise<void> => {
  const docRef = doc(db, collectionName, String(id));
  await updateDoc(docRef as any, updates);
};

export const deleteItem = async (
  collectionName: string,
  id: number
): Promise<void> => {
  const docRef = doc(db, collectionName, String(id));
  await deleteDoc(docRef as any);
};

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