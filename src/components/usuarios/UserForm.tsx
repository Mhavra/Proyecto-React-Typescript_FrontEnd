/**
 * USUARIO FORM - Formulario de usuarios
 * 
 * @component
 */

'use client';

import { useState, useEffect } from 'react';
import { Usuario } from '@/interfaces';

interface UsuarioFormProps {
  usuario?: Usuario;
  onSave: (usuario: Omit<Usuario, 'id'>) => void;
  onCancel: () => void;
}

// ... (imports)
export default function UsuarioForm({ usuario, onSave, onCancel }: UsuarioFormProps) {
  const [formData, setFormData] = useState<Omit<Usuario, 'id'>>({
    nombre: '',
    email: '',
    password: '',
    rol: 'cliente',
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre,
        email: usuario.email,
        password: '',
        rol: usuario.rol,
      });
    }
  }, [usuario]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.password && !usuario) {
      alert('La contraseña es obligatoria');
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        {/* campos de nombre, email, contraseña... */}
        <div className="col-12 col-md-6 mb-3">
          <label className="form-label fw-semibold">Rol</label>
          <select
            className="form-select"
            value={formData.rol}
            onChange={(e) => setFormData({ ...formData, rol: e.target.value as 'admin' | 'cliente' })}
          >
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </div>
      <div className="d-flex gap-2">
        <button type="submit" className="btn" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
          <i className="bi bi-save me-1"></i> Guardar
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}