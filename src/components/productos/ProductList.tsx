// src/components/productos/ProductList.tsx
// Listado de productos con acciones de edición y eliminación.
// El ID se maneja como number.

'use client';

import { Producto } from '@/interfaces';

interface ProductoListProps {
  productos: Producto[];
  onEdit: (producto: Producto) => void;
  onDelete: (id: number) => void;
}

export default function ProductoList({ productos, onEdit, onDelete }: ProductoListProps) {
  if (productos.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <i className="bi bi-inbox fs-1 d-block mb-3"></i>
        <p>No hay productos que coincidan con la búsqueda</p>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={producto.imagen || '/placeholder.png'}
                        alt={producto.nombre}
                        className="rounded me-2"
                        style={{ width: 40, height: 40, objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                      />
                      <span>{producto.nombre}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ backgroundColor: '#dcd9ff', color: '#6f42c1' }}>
                      {producto.categoria}
                    </span>
                  </td>
                  <td>${producto.precio.toLocaleString()}</td>
                  <td>{producto.stock}</td>
                  <td className="text-end">
                    <button
                      onClick={() => onEdit(producto)}
                      className="btn btn-sm btn-outline-warning me-1"
                      title="Editar"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      onClick={() => onDelete(producto.id)}
                      className="btn btn-sm btn-outline-danger"
                      title="Eliminar"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}