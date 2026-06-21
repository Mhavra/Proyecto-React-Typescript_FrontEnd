// src/interfaces/index.ts

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: 'admin' | 'cliente';  
}

export interface Producto {
  id: number;  
  nombre: string;
  categoria: string;
  precio: number;
  imagen: string;
  descripcion?: string;
  stock?: number;
}

export interface Pedido {
  id: number;
  cliente: string;
  email?: string;          
  direccion?: string;      
  telefono?: string;       
  fecha: string;
  productos: { id: string | number; cantidad: number; precio: number }[];
  total: number;
  estado: 'pendiente' | 'enviado' | 'entregado';
}

export interface Consulta {
  id: number;
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
  logout: () => void;
  isAuthenticated: boolean;
}