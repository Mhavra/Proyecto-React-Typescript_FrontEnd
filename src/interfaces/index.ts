export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol: 'admin' | 'editor' | 'viewer' | 'cliente';
    password?: string;
}

export interface Producto {
    id: number;
    nombre: string;
    categoria: string;
    precio: number;
    imagen: string;
    descripcion?: string;
    stock: number;
}

export interface Pedido {
    id: number;
    cliente: string;
    fecha: string;
    productos: { id: number; cantidad: number; precio: number}[];
    total: number;
    estado: 'pendiente' | 'enviado' | 'entregado';
}

export interface Consulta {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    motivo: string;
    estado: 'no_leida' | 'leida';
}

export interface AuthContextType {
    user: Usuario | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}