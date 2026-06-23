/**
 * USE LOCAL STORAGE - Custom Hook para localStorage reactivo
 * 
 * @module hooks/useLocalStorage
 */

import { useState, useEffect } from 'react';
import { storage } from '@/services/localStorageService';

/**
 * Hook para usar localStorage de forma reactiva
 * @param key - Clave del localStorage
 * @param initialValue - Valor inicial
 * @returns [valor, setValor]
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Estado que sincroniza con localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = storage.getItem<T>(key);
      return item.length > 0 ? item as T : initialValue;
    } catch (error) {
      console.error('Error al leer localStorage:', error);
      return initialValue;
    }
  });

  /**
   * Función para actualizar el valor
   * Guarda en localStorage y actualiza el estado
   */
  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storage.setItem(key, valueToStore as any[]);
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const item = storage.getItem<T>(key);
      if (item.length > 0) {
        setStoredValue(item as T);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}