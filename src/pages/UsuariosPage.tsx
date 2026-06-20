/**
 * USUARIOS PAGE - Gestión de usuarios
 * 
 * @page /usuarios
 */

'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { storage, STORAGE_KEYS } from '@/services/localStorageService';
import { Usuario } from '@/interfaces';
import SearchBar from '@/components/common/SearchBar';
import UsuarioList from '@/components/usuarios/UserList';
import UsuarioForm from '@/components/usuarios/UserForm';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useLocalStorage<Usuario[]>(STORAGE_KEYS.USUARIOS, []);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  const filteredUsuarios = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (usuario: Omit<Usuario, 'id'>) => {
    if (editingUser) {
      storage.updateItem<Usuario>(STORAGE_KEYS.USUARIOS, editingUser.id, usuario);
      setUsuarios(storage.get<Usuario>(STORAGE_KEYS.USUARIOS));
    } else {
      storage.addItem<Usuario>(STORAGE_KEYS.USUARIOS, usuario);
      setUsuarios(storage.get<Usuario>(STORAGE_KEYS.USUARIOS));
    }
    setShowForm(false);
    setEditingUser(null);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUser(usuario);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar este usuario?')) {
      storage.deleteItem<Usuario>(STORAGE_KEYS.USUARIOS, id);
      setUsuarios(storage.get<Usuario>(STORAGE_KEYS.USUARIOS));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

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