'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getCollection, addDocument, updateDocument, deleteDocument } from '@/services/firestoreService';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Usuario } from '@/interfaces';
import SearchBar from '@/components/common/SearchBar';
import UsuarioList from '@/components/usuarios/UserList';
import UsuarioForm from '@/components/usuarios/UserForm';

export default function UsuariosPage() {
  const { user: currentUser } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await getCollection<Usuario>('usuario');
      setUsuarios(data);
      setError('');
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const filteredUsuarios = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (usuario: Omit<Usuario, 'id'>) => {
    setSaving(true);
    setError('');
    try {
      if (editingUser) {
        // Editar usuario existente (solo Firestore)
        await updateDocument('usuario', editingUser.id, usuario);
        await cargarUsuarios();
        setShowForm(false);
        setEditingUser(null);
      } else {
        // 🔥 Crear usuario NUEVO: primero en Auth, luego en Firestore
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          usuario.email,
          usuario.password || '123456' // Usar password por defecto si no se envía
        );
        const uid = userCredential.user.uid;
        
        // Guardar en Firestore con el UID como ID
        const usuarioData = {
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol || 'cliente',
        };
        await addDocument('usuario', usuarioData);
        
        // Recargar lista
        await cargarUsuarios();
        setShowForm(false);
        setEditingUser(null);
      }
    } catch (err: any) {
      console.error('Error al guardar usuario:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado en Firebase Auth.');
      } else {
        setError('Error al guardar usuario: ' + (err.message || ''));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUser(usuario);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este usuario?')) {
      try {
        await deleteDocument('usuario', id);
        await cargarUsuarios();
      } catch (err) {
        setError('Error al eliminar usuario');
      }
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
          disabled={saving}
        >
          <i className="bi bi-plus-circle me-1"></i>
          Nuevo Usuario
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

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
              saving={saving}
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