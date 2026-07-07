'use client';

import { useEffect, useState } from 'react';
import { getCollection } from '@/services/firestoreService';
import { Producto, Pedido, Consulta } from '@/interfaces';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productos, pedidos, consultas, usuarios] = await Promise.all([
          getCollection<Producto>('productos'),
          getCollection<Pedido>('pedidos'),
          getCollection<Consulta>('consultas'),
          getCollection('usuario'),
        ]);

        setStats({
          productos: productos.length,
          pedidosPendientes: pedidos.filter(p => p.estado === 'pendiente').length,
          consultasNoLeidas: consultas.filter(c => c.estado === 'no_leida').length,
          usuarios: usuarios.length,
        });
        setError('');
      } catch (err: any) {
        console.error('Error al cargar estadísticas:', err);
        setError('Error al cargar estadísticas. Verifica tus permisos en Firestore.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-5">Cargando estadísticas...</div>;

  return (
    <div>
      <h4 className="fw-bold mb-4">Dashboard</h4>
      {error && <div className="alert alert-danger">{error}</div>}
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