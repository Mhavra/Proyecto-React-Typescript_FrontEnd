/**
 * PEDIDO LIST - Listado de pedidos
 * 
 * @component
 */

'use client';

import { Pedido } from '@/interfaces';

interface PedidoListProps {
  pedidos: Pedido[];
  onCambiarEstado: (id: number, nuevoEstado: 'pendiente' | 'enviado' | 'entregado') => void;
  onDelete: (id: number) => void;
}

export default function PedidoList({ pedidos, onCambiarEstado, onDelete }: PedidoListProps) {
  if (pedidos.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <i className="bi bi-inbox fs-1 d-block mb-3"></i>
        <p>No hay pedidos que coincidan con el filtro</p>
      </div>
    );
  }

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      pendiente: 'bg-warning text-dark',
      enviado: 'bg-info text-white',
      entregado: 'bg-success text-white',
    };
    return colors[estado] || 'bg-secondary text-white';
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>
                    <span className="fw-semibold">{pedido.cliente}</span>
                    <br />
                    <small className="text-muted">{pedido.productos.length} productos</small>
                  </td>
                  <td>{pedido.fecha}</td>
                  <td>${pedido.total.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${getEstadoColor(pedido.estado)}`}>
                      {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                    </span>
                  </td>
                  <td className="text-end">
                    {pedido.estado === 'pendiente' && (
                      <button
                        onClick={() => onCambiarEstado(pedido.id, 'enviado')}
                        className="btn btn-sm btn-info me-1"
                        title="Marcar como enviado"
                      >
                        <i className="bi bi-truck"></i>
                      </button>
                    )}
                    {pedido.estado === 'enviado' && (
                      <button
                        onClick={() => onCambiarEstado(pedido.id, 'entregado')}
                        className="btn btn-sm btn-success me-1"
                        title="Marcar como entregado"
                      >
                        <i className="bi bi-check2"></i>
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(pedido.id)}
                      className="btn btn-sm btn-outline-danger"
                      title="Eliminar pedido"
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