export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol: 'admin' | 'editor' | 'viewer';
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
    
}