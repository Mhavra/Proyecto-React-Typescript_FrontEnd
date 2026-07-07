'use client';

import { useState, useEffect } from 'react';
import { Usuario } from '@/interfaces';

interface UsuarioFormProps {
  usuario?: Usuario;
  onSave: (usuario: Omit<Usuario, 'id'>) => void;
  onCancel: () => void;
  saving?: boolean;
}

export default function UsuarioForm({ usuario, onSave, onCancel, saving = false }: UsuarioFormProps) {
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
        password: '', // No se muestra la contraseña en edición
        rol: usuario.rol,
      });
    }
  }, [usuario]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validar que la contraseña esté presente en creación
    if (!usuario && !formData.password) {
      alert('La contraseña es obligatoria para usuarios nuevos.');
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-12 col-md-6 mb-3">
          <label className="form-label fw-semibold">Nombre <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control"
            placeholder="Nombre completo"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
            disabled={saving}
          />
        </div>

        <div className="col-12 col-md-6 mb-3">
          <label className="form-label fw-semibold">Email <span className="text-danger">*</span></label>
          <input
            type="email"
            className="form-control"
            placeholder="usuario@ejemplo.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={saving || !!usuario} // No se puede cambiar email en edición
          />
        </div>

        <div className="col-12 col-md-6 mb-3">
          <label className="form-label fw-semibold">
            {usuario ? 'Nueva contraseña (opcional)' : 'Contraseña *'}
          </label>
          <input
            type="password"
            className="form-control"
            placeholder={usuario ? 'Dejar vacío para mantener' : 'Mínimo 6 caracteres'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!usuario}
            disabled={saving}
            minLength={6}
          />
        </div>

        <div className="col-12 col-md-6 mb-3">
          <label className="form-label fw-semibold">Rol</label>
          <select
            className="form-select"
            value={formData.rol}
            onChange={(e) => setFormData({ ...formData, rol: e.target.value as 'admin' | 'cliente' })}
            disabled={saving}
          >
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </div>
      <div className="d-flex gap-2">
        <button type="submit" className="btn" style={{ backgroundColor: '#6f42c1', color: 'white' }} disabled={saving}>
          <i className="bi bi-save me-1"></i> {saving ? 'Guardando...' : 'Guardar'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
      </div>
    </form>
  );
}