/**
 * PRODUCTO DETALLE - Vista de detalle de un producto
 * 
 * @component
 * @param props.producto - Producto a mostrar
 * @param props.onEdit - Función para editar
 * @param props.onDelete - Función para eliminar
 * @param props.onBack - Función para volver
 */

'use client';

import { Producto } from '@/interfaces';

interface ProductoDetalleProps {
  producto: Producto;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}

export default function ProductoDetalle({
  producto,
  onEdit,
  onDelete,
  onBack,
}: ProductoDetalleProps) {
  return (
    <div>
      <button className="btn btn-outline-secondary mb-4" onClick={onBack}>
        <i className="bi bi-arrow-left me-1"></i>
        Volver
      </button>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row">
            <div className="col-12 col-md-4 mb-4 mb-md-0">
              <img
                src={producto.imagen || '/placeholder.png'}
                alt={producto.nombre}
                className="img-fluid rounded"
                style={{ maxHeight: 300, objectFit: 'contain' }}
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
              />
            </div>
            <div className="col-12 col-md-8">
              <h3 className="fw-bold">{producto.nombre}</h3>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge" style={{ backgroundColor: '#dcd9ff', color: '#6f42c1' }}>
                  {producto.categoria}
                </span>
                <span className="badge bg-success">Stock: {producto.cantidad} unidades</span>
                <span className="badge bg-warning text-dark">
                  ${producto.precio.toLocaleString()}
                </span>
              </div>
              <p className="text-muted">{producto.descripcion || 'Sin descripción'}</p>

              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-warning" onClick={onEdit}>
                  <i className="bi bi-pencil me-1"></i>
                  Editar
                </button>
                <button className="btn btn-danger" onClick={onDelete}>
                  <i className="bi bi-trash me-1"></i>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}