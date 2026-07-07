'use client';

import { useState, useEffect } from 'react';
import { getCollection, updateDocument, deleteDocument } from '@/services/firestoreService';
import { Pedido } from '@/interfaces';
import SearchBar from '@/components/common/SearchBar';
import PedidoList from '@/components/pedidos/PedidoList';

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const data = await getCollection<Pedido>('pedidos');
      setPedidos(data);
      setError('');
    } catch (err) {
      setError('Error al cargar pedidos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const pedidosFiltrados = pedidos.filter(p => {
    const matchesEstado = filtroEstado === 'todos' ? true : p.estado === filtroEstado;
    const matchesSearch = p.cliente.toLowerCase().includes(search.toLowerCase());
    return matchesEstado && matchesSearch;
  });

  const handleCambiarEstado = async (id: string, nuevoEstado: 'pendiente' | 'enviado' | 'entregado') => {
    try {
      await updateDocument('pedidos', id, { estado: nuevoEstado });
      await cargarPedidos();
    } catch (err) {
      setError('Error al actualizar estado');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este pedido?')) {
      try {
        await deleteDocument('pedidos', id);
        await cargarPedidos();
      } catch (err) {
        setError('Error al eliminar pedido');
      }
    }
  };

  if (loading) return <div className="text-center py-5">Cargando pedidos...</div>;

  return (
    <div>
      <h4 className="fw-bold mb-4">Pedidos</h4>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => setFiltroEstado('todos')}
          className={`btn ${filtroEstado === 'todos' ? 'btn-primary' : 'btn-outline-secondary'}`}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltroEstado('pendiente')}
          className={`btn ${filtroEstado === 'pendiente' ? 'btn-warning' : 'btn-outline-warning'}`}
        >
          Pendientes
        </button>
        <button
          onClick={() => setFiltroEstado('enviado')}
          className={`btn ${filtroEstado === 'enviado' ? 'btn-info text-white' : 'btn-outline-info'}`}
        >
          Enviados
        </button>
        <button
          onClick={() => setFiltroEstado('entregado')}
          className={`btn ${filtroEstado === 'entregado' ? 'btn-success' : 'btn-outline-success'}`}
        >
          Entregados
        </button>
      </div>

      <SearchBar
        placeholder="Buscar por cliente..."
        value={search}
        onChange={setSearch}
        className="mb-3"
      />

      <PedidoList
        pedidos={pedidosFiltrados}
        onCambiarEstado={handleCambiarEstado}
        onDelete={handleDelete}
      />
    </div>
  );
}