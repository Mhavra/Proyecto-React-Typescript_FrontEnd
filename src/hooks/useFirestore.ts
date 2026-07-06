// src/hooks/useFirestore.ts
// Custom hook para gestionar datos de Firestore con estado reactivo.
// Mantiene los IDs como number.

import { useState, useEffect } from 'react';
import { getItems, addItem, updateItem, deleteItem } from '@/services/firestoreService';

export function useFirestore<T extends { id: number }>(collectionName: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga los datos desde Firestore al montar el componente.
   * Se ejecuta una sola vez (array de dependencias vacío).
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getItems<T>(collectionName);
      setItems(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos desde Firestore.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [collectionName]);

  /**
   * Crea un nuevo documento en Firestore.
   */
  const create = async (data: Omit<T, 'id'>) => {
    try {
      const newItem = await addItem<T>(collectionName, data);
      setItems((prev) => [...prev, newItem]);
      return newItem;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  /**
   * Actualiza un documento existente en Firestore.
   */
  const update = async (id: number, data: Partial<T>) => {
    try {
      await updateItem(collectionName, id, data);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data } : item))
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  /**
   * Elimina un documento de Firestore.
   */
  const remove = async (id: number) => {
    try {
      await deleteItem(collectionName, id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    items,
    loading,
    error,
    create,
    update,
    remove,
    setItems,
    refetch: fetchData,
  };
}