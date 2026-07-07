'use client';

import { useState } from 'react';
import { Pedido } from '@/interfaces';

interface PedidoListProps {
  pedidos: Pedido[];
  onCambiarEstado: (id: string, nuevoEstado: 'pendiente' | 'enviado' | 'entregado') => void;
  onDelete: (id: string) => void;
}

export default function PedidoList({ pedidos, onCambiarEstado, onDelete }: PedidoListProps) {
  const [expandido, setExpandido] = useState<string | null>(null);

  const safePedidos = pedidos || [];

  if (safePedidos.length === 0) {
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

  const toggleExpand = (id: string) => {
    setExpandido(expandido === id ? null : id);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th>Cliente</th>
                <th>Email</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {safePedidos.map((pedido) => {
                const isExpanded = expandido === pedido.id;
                return (
                  <tr key={pedido.id}>
                    <td>
                      <span className="fw-semibold">{pedido.cliente}</span>
                    </td>
                    <td>{pedido.email || '-'}</td>
                    <td>{pedido.direccion || '-'}</td>
                    <td>{pedido.telefono || '-'}</td>
                    <td>{pedido.fecha}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-info"
                        type="button"
                        onClick={() => toggleExpand(pedido.id)}
                      >
                        {isExpanded ? 'Ocultar productos' : `Ver productos (${pedido.productos.length})`}
                      </button>
                      {isExpanded && (
                        <div className="mt-2 p-2 bg-light rounded">
                          <ul className="list-unstyled small mb-0">
                            {pedido.productos.map((item, idx) => (
                              <li key={idx} className="border-bottom py-1">
                                <strong>{item.nombre || `Producto ID: ${item.id}`}</strong>
                                <br />
                                <span className="text-muted">
                                  {item.cantidad} x ${item.precio.toLocaleString()} = ${(item.cantidad * item.precio).toLocaleString()}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </td>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}