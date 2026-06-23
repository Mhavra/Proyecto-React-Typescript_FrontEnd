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
  // Estado de usuarios con persistencia en localStorage
  const [usuarios, setUsuarios] = useLocalStorage<Usuario[]>(STORAGE_KEYS.USUARIOS, []);
  // Estado para la búsqueda
  const [search, setSearch] = useState('');
  // Estado para mostrar/ocultar el formulario
  const [showForm, setShowForm] = useState(false);
  // Estado para el usuario que se está editando
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  /**
   * Filtra usuarios por nombre o email
   */
  const filteredUsuarios = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  /**
   * Maneja la creación/edición de un usuario
   * @param usuario - Datos del usuario (sin ID)
   */
  const handleSave = (usuario: Omit<Usuario, 'id'>) => {
    if (editingUser) {
      // Editar usuario existente
      storage.updateItem<Usuario>(STORAGE_KEYS.USUARIOS, editingUser.id, usuario);
      setUsuarios(storage.get<Usuario>(STORAGE_KEYS.USUARIOS));
    } else {
      // Crear nuevo usuario
      storage.addItem<Usuario>(STORAGE_KEYS.USUARIOS, usuario);
      setUsuarios(storage.get<Usuario>(STORAGE_KEYS.USUARIOS));
    }
    // Cerrar formulario y limpiar estado de edición
    setShowForm(false);
    setEditingUser(null);
  };

  /**
   * Maneja la edición de un usuario
   * Abre el formulario con los datos del usuario seleccionado
   * @param usuario - Usuario a editar
   */
  const handleEdit = (usuario: Usuario) => {
    setEditingUser(usuario);
    setShowForm(true);
  };

  /**
   * Maneja la eliminación de un usuario (con confirmación)
   * @param id - ID del usuario a eliminar
   */
  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar este usuario?')) {
      storage.deleteItem<Usuario>(STORAGE_KEYS.USUARIOS, id);
      setUsuarios(storage.get<Usuario>(STORAGE_KEYS.USUARIOS));
    }
  };

  /**
   * Cancela la edición/creación
   */
  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <div>
      {/* Header con título y botón de nuevo usuario */}
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

      {/* Barra de búsqueda */}
      <SearchBar
        placeholder="Buscar usuarios por nombre o email..."
        value={search}
        onChange={setSearch}
      />

      {/* Formulario de usuario (se muestra en creación/edición) */}
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

      {/* Lista de usuarios */}
      <UsuarioList
        usuarios={filteredUsuarios}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}