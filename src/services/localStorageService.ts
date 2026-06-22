/**
 * Obtiene todos los elementos de una clave
 * @param key - Clave del localStorage
 * @returns Array de elementos
 */

const getItem = <T>(key:string): T[] => {
    if (typeof window === 'undefined') return [];{
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
}}

/**
Servicio de persistencia de datos 
Proporciona funciones genéricas para operaciones CRUD en localStorage.
Ahora los IDs son numéricos.
@module services/localStorageService
*/


/**
 Guarda un array en localStorage
 @param key - Clave del localStorage
 @param data - Array a guardar
 */
const setItem = <T>(key: string, data: T[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Agrega un nuevo elemento con ID numérico autoincrementable
 @param key - Clave del localStorage
 @param item - Elemento sin ID (se genera automáticamente)
 * @returns Elemento con ID asignado
 */
const addItem = <T extends { id: number }>(key: string, item: Omit<T, 'id'>): T => {
  const items = getItem<T>(key);
  const maxId = items.reduce((max, curr) => (curr.id > max ? curr.id : max), 0);
  const newItem = { ...item, id: maxId + 1 } as T;
  items.push(newItem);
  setItem(key, items);
  return newItem;
};

/**
 Actualiza un elemento existente
 @param key - Clave del localStorage
 @param id - ID numérico del elemento
 @param updates - Datos a actualizar
 @returns Elemento actualizado o null
 */
const updateItem = <T extends { id: number }>(
  key: string,
  id: number,
  updates: Partial<T>
): T | null => {
  const items = getItem<T>(key);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates };
  setItem(key, items);
  return items[index];
};

/**
 * Elimina un elemento por ID numérico
 * @param key - Clave del localStorage
 * @param id - ID numérico del elemento
 * @returns true si se eliminó, false si no
 */
const deleteItem = <T extends { id: number }>(key: string, id: number): boolean => {
  const items = getItem<T>(key);
  const filtered = items.filter(item => item.id !== id);
  setItem(key, filtered);
  return filtered.length !== items.length;
};

/**
 * Obtiene un elemento por ID numérico
 * @param key - Clave del localStorage
 * @param id - ID numérico del elemento
 * @returns Elemento encontrado o null
 */
const getItemById = <T extends { id: number }>(key: string, id: number): T | null => {
  const items = getItem<T>(key);
  return items.find(item => item.id === id) || null;
};

/**
 * Servicio de localStorage
 */
export const storage = {
  get: getItem,
  getItem,
  setItem,
  addItem,
  updateItem,
  deleteItem,
  getItemById,
};

/**
 * Claves de localStorage
 */
export const STORAGE_KEYS = {
  PRODUCTOS: 'frenesi_productos',
  PEDIDOS: 'frenesi_pedidos',
  CONSULTAS: 'frenesi_consultas',
  USUARIOS: 'frenesi_usuarios',
  SESSION: 'frenesi_session',
} as const;