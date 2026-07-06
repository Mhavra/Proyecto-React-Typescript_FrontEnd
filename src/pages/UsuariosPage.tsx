// src/pages/UsuariosPage.tsx
// Gestión de usuarios con Firestore.
// Los IDs se mantienen como number.

'use client';

import { useState } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { Usuario } from '@/interfaces';
import SearchBar from '@/components/common/SearchBar';
import UsuarioList from '@/components/usuarios/UserList';
import UsuarioForm from '@/components/usuarios/UserForm';

export default function UsuariosPage() {
  const { items: usuarios, loading, create, update, remove } = useFirestore<Usuario>('usuarios');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  const filteredUsuarios = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (usuario: Omit<Usuario, 'id'>) => {
    if (editingUser) {
      await update(editingUser.id, usuario);
      setEditingUser(null);
    } else {
      await create(usuario);
    }
    setShowForm(false);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUser(usuario);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar este usuario?')) {
      await remove(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  if (loading) return <div className="text-center py-5">Cargando usuarios...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Usuarios</h4>
        <button
          className="btn" style={{ backgroundColor: '#6f42c1', color: 'white' }}
          onClick={() => setShowForm(true)}
        >
          <i className="bi bi-plus-circle me-1"></i>
          Nuevo Usuario
        </button>
      </div>

      <SearchBar
        placeholder="Buscar usuarios por nombre o email..."
        value={search}
        onChange={setSearch}
      />

      {showForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h5>
            <UsuarioForm
              usuario={editingUser || undefined}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      <UsuarioList
        usuarios={filteredUsuarios}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}