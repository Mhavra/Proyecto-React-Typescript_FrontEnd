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

export const getCollection = async <T>(collectionName: string): Promise<T[]> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const items: T[] = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() } as T);
  });
  return items;
};

export const getDocument = async <T>(collectionName: string, id: string): Promise<T | null> => {
  const docSnap = await getDoc(doc(db, collectionName, id));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
};

export const addDocument = async <T>(collectionName: string, data: Omit<T, 'id'>): Promise<T> => {
  const docRef = await addDoc(collection(db, collectionName), data);
  return { id: docRef.id, ...data } as T;
};

export const updateDocument = async <T>(collectionName: string, id: string, updates: Partial<T>): Promise<void> => {
  await updateDoc(doc(db, collectionName, id), updates);
};

export const deleteDocument = async (collectionName: string, id: string): Promise<void> => {
  await deleteDoc(doc(db, collectionName, id));
};