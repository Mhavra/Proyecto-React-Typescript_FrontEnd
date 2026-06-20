/**
 * CONSULTAS PAGE - Gestión de consultas de clientes
 * 
 * @page /consultas
 */

'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { storage, STORAGE_KEYS } from '@/services/localStorageService';
import { Consulta } from '@/interfaces';
import SearchBar from '@/components/common/SearchBar';
import ConsultaList from '@/components/consultas/ConsultaList';

export default function ConsultasPage() {
  const [consultas, setConsultas] = useLocalStorage<Consulta[]>(STORAGE_KEYS.CONSULTAS, []);
  const [filtroEstado, setFiltroEstado] = useState<string>('todas');
  const [search, setSearch] = useState('');

  /**
   * Filtra consultas por estado y cliente
   */
        const consultasFiltradas = consultas.filter(c => {
    const matchesEstado = filtroEstado === 'todas' ? true : c.estado === filtroEstado;
    const matchesSearch = c.nombre.toLowerCase().includes(search.toLowerCase()) ||
                          c.apellido.toLowerCase().includes(search.toLowerCase()) ||
                          c.email.toLowerCase().includes(search.toLowerCase());
    return matchesEstado && matchesSearch;
  });
   /**
   * Cambia el estado de una consulta
   */
  const handleCambiarEstado = (id: number, nuevoEstado: 'leida' | 'respondida') => {
  storage.updateItem<Consulta>(STORAGE_KEYS.CONSULTAS, id, { estado: nuevoEstado });
  setConsultas(storage.get<Consulta>(STORAGE_KEYS.CONSULTAS));
    };
 /**
   * Elimina una consulta
   */
  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar esta consulta?')) {
      storage.deleteItem<Consulta>(STORAGE_KEYS.CONSULTAS, id);
      setConsultas(storage.get<Consulta>(STORAGE_KEYS.CONSULTAS));
    }
  };

  return (
    <div>
      <h4 className="fw-bold mb-4">Consultas de Clientes</h4>

      {/* Filtros */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => setFiltroEstado('todas')}
          className={`btn ${filtroEstado === 'todas' ? 'btn-primary' : 'btn-outline-secondary'}`}
        >
          Todas
        </button>
        <button
          onClick={() => setFiltroEstado('no_leida')}
          className={`btn ${filtroEstado === 'no_leida' ? 'btn-danger' : 'btn-outline-danger'}`}
        >
          No leídas
        </button>
        <button
          onClick={() => setFiltroEstado('leida')}
          className={`btn ${filtroEstado === 'leida' ? 'btn-warning' : 'btn-outline-warning'}`}
        >
          Leídas
        </button>
        <button
          onClick={() => setFiltroEstado('respondida')}
          className={`btn ${filtroEstado === 'respondida' ? 'btn-success' : 'btn-outline-success'}`}
        >
          Respondidas
        </button>
      </div>

      <SearchBar
        placeholder="Buscar por nombre, apellido o email..."
        value={search}
        onChange={setSearch}
        className="mb-3"
      />

      <ConsultaList
        consultas={consultasFiltradas}
        onCambiarEstado={handleCambiarEstado}
        onDelete={handleDelete}
      />
    </div>
  );
}