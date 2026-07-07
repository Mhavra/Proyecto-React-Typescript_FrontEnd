// src/interfaces/index.ts
// Se mantienen los IDs como number para compatibilidad con la ES3.
// Firestore genera IDs string, pero los convertimos a number al leer.
/**
 * USUARIO - Representa un usuario del sistema
 */
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password?: string;
  rol: 'admin' | 'cliente';
}

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  imagen: string;
  descripcion?: string;
  stock?: number;
}

export interface Pedido {
  id: string;
  cliente: string;
  email?: string;
  direccion?: string;
  telefono?: string;
  fecha: string;
  productos: {
    id: string;
    nombre: string;  //  Campo obligatorio
    cantidad: number;
    precio: number;
  }[];
  total: number;
  estado: 'pendiente' | 'enviado' | 'entregado';
}

export interface Consulta {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  motivo: string;
  fecha: string;
  hora: string;
  estado: 'no_leida' | 'leida' | 'respondida';
  respuesta?: string;
}

export interface AuthContextType {
  user: Usuario | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}