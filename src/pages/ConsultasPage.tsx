// src/pages/ConsultasPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { getCollection, updateDocument, deleteDocument } from '@/services/firestoreService';
import { Consulta } from '@/interfaces';
import SearchBar from '@/components/common/SearchBar';
import ConsultaList from '@/components/consultas/ConsultaList';

export default function ConsultasPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('todas');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarConsultas = async () => {
    try {
      setLoading(true);
      const data = await getCollection<Consulta>('consultas');
      setConsultas(data);
      setError('');
    } catch (err) {
      setError('Error al cargar consultas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarConsultas();
  }, []);

  const consultasFiltradas = consultas.filter(c => {
    const matchesEstado = filtroEstado === 'todas' ? true : c.estado === filtroEstado;
    const matchesSearch = c.nombre.toLowerCase().includes(search.toLowerCase()) ||
                          c.apellido.toLowerCase().includes(search.toLowerCase()) ||
                          c.email.toLowerCase().includes(search.toLowerCase());
    return matchesEstado && matchesSearch;
  });

  const handleCambiarEstado = async (id: string, nuevoEstado: 'leida' | 'respondida', respuesta?: string) => {
    try {
      const updates: Partial<Consulta> = { estado: nuevoEstado };
      if (respuesta !== undefined) updates.respuesta = respuesta;
      await updateDocument('consultas', id, updates);
      await cargarConsultas();
    } catch (err) {
      setError('Error al actualizar consulta');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta consulta?')) {
      try {
        await deleteDocument('consultas', id);
        await cargarConsultas();
      } catch (err) {
        setError('Error al eliminar consulta');
      }
    }
  };

  if (loading) return <div className="text-center py-5">Cargando consultas...</div>;

  return (
    <div>
      <h4 className="fw-bold mb-4">Consultas de Clientes</h4>
      {error && <div className="alert alert-danger">{error}</div>}

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