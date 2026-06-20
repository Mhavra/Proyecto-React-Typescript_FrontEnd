/**
 * PEDIDOS PAGE - Gestión de pedidos
 * 
 * @page /pedidos
 */

'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { storage, STORAGE_KEYS } from '@/services/localStorageService';
import { Pedido } from '@/interfaces';
import SearchBar from '@/components/common/SearchBar';
import PedidoList from '@/components/pedidos/PedidoList';

export default function PedidosPage() {
  const [pedidos, setPedidos] = useLocalStorage<Pedido[]>(STORAGE_KEYS.PEDIDOS, []);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [search, setSearch] = useState('');

  const pedidosFiltrados = pedidos.filter(p => {
    const matchesEstado = filtroEstado === 'todos' ? true : p.estado === filtroEstado;
    const matchesSearch = p.cliente.toLowerCase().includes(search.toLowerCase());
    return matchesEstado && matchesSearch;
  });

  const handleCambiarEstado = (id: number, nuevoEstado: 'pendiente' | 'enviado' | 'entregado') => {
    storage.updateItem<Pedido>(STORAGE_KEYS.PEDIDOS, id, { estado: nuevoEstado });
    setPedidos(storage.get<Pedido>(STORAGE_KEYS.PEDIDOS));
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar este pedido?')) {
      storage.deleteItem<Pedido>(STORAGE_KEYS.PEDIDOS, id);
      setPedidos(storage.get<Pedido>(STORAGE_KEYS.PEDIDOS));
    }
  };

  return (
    <div>
      <h4 className="fw-bold mb-4">Pedidos</h4>

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