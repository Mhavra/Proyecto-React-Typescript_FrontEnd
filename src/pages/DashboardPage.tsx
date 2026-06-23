/**
 * DASHBOARD PAGE - Página de inicio
 * 
 * Muestra estadísticas clave del negocio.
 * 
 * @page /
 */

'use client';

import { useEffect, useState } from 'react';
import { storage, STORAGE_KEYS } from '@/services/localStorageService';
import { Producto, Pedido, Consulta } from '@/interfaces';

/**
 * Tarjeta de estadística
 */
const StatCard = ({ title, value, icon, color }: {
  title: string;
  value: number;
  icon: string;
  color: string;
}) => (
  <div className="col-12 col-sm-6 col-xl-3 mb-3">
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex align-items-center justify-content-between">
        <div>
          <h6 className="text-muted mb-1 small">{title}</h6>
          <h3 className="fw-bold mb-0">{value}</h3>
        </div>
        <div className={`rounded-circle p-3 d-flex align-items-center justify-content-center ${color}`}>
          <i className={`${icon} text-white fs-4`}></i>
        </div>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({
    productos: 0,
    pedidosPendientes: 0,
    consultasNoLeidas: 0,
    usuarios: 0,
  });

  /**
   * Cargar estadísticas desde localStorage
   */
  useEffect(() => {
    // Obtener datos desde localStorage
    const productos = storage.get<Producto>(STORAGE_KEYS.PRODUCTOS);
    const pedidos = storage.get<Pedido>(STORAGE_KEYS.PEDIDOS);
    const consultas = storage.get<Consulta>(STORAGE_KEYS.CONSULTAS);
    const usuarios = storage.get(STORAGE_KEYS.USUARIOS);

    // Calcular estadísticas
    setStats({
      productos: productos.length,
      pedidosPendientes: pedidos.filter(p => p.estado === 'pendiente').length,
      consultasNoLeidas: consultas.filter(c => c.estado === 'no_leida').length,
      usuarios: usuarios.length,
    });
  }, []);

  return (
    <div>
      <h4 className="fw-bold mb-4">Dashboard</h4>

      {/* Grid de tarjetas de estadísticas */}
      <div className="row g-3 mb-4">
        <StatCard
          title="Productos"
          value={stats.productos}
          icon="bi bi-box-seam"
          color="bg-primary"
        />
        <StatCard
          title="Pedidos Pendientes"
          value={stats.pedidosPendientes}
          icon="bi bi-cart"
          color="bg-warning"
        />
        <StatCard
          title="Consultas No Leídas"
          value={stats.consultasNoLeidas}
          icon="bi bi-chat-dots"
          color="bg-danger"
        />
        <StatCard
          title="Usuarios"
          value={stats.usuarios}
          icon="bi bi-people"
          color="bg-success"
        />
      </div>
      
      {/* Mensaje de bienvenida */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Bienvenido a la intranet</h5>
          <p className="card-text text-muted">
            Gestiona productos, pedidos, consultas y usuarios desde un solo lugar.
            Selecciona una opción del menú lateral para comenzar.
          </p>
        </div>
      </div>
    </div>
  );
}