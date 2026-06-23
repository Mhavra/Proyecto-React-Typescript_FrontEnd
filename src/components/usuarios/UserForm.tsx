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

// Estado del formulario
export default function UsuarioForm({ usuario, onSave, onCancel }: UsuarioFormProps) {
  const [formData, setFormData] = useState<Omit<Usuario, 'id'>>({
    nombre: '',
    email: '',
    password: '',
    rol: 'cliente',
  });

  /**
   * Efecto para cargar los datos del usuario cuando se edita
   */
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre,
        email: usuario.email,
        password: '', // La contraseña se deja vacía en edición
        rol: usuario.rol,
      });
    }
  }, [usuario]);

  /**
   * Maneja el envío del formulario
   * En creación: la contraseña es obligatoria
   * En edición: la contraseña es opcional
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validar que la contraseña esté presente en creación
    if (!formData.password && !usuario) {
      alert('La contraseña es obligatoria');
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        {/* Campo: Nombre */}
        <div className="col-12 col-md-6 mb-3">
          <label className="form-label fw-semibold">Nombre</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nombre completo"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
        </div>

        {/* Campo: Email */}
        <div className="col-12 col-md-6 mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="usuario@ejemplo.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        {/* Campo: Contraseña */}
        <div className="col-12 col-md-6 mb-3">
          <label className="form-label fw-semibold">
            {usuario ? 'Nueva contraseña (opcional)' : 'Contraseña'}
          </label>
          <input
            type="password"
            className="form-control"
            placeholder={usuario ? 'Dejar vacío para mantener' : 'Contraseña...'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!usuario} // Solo obligatorio en creación
          />
        </div>

        {/* Campo: Rol */}
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
      {/* Botones de acción */}
      <div className="d-flex gap-2">
        <button type="submit" className="btn" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
          <i className="bi bi-save me-1"></i> Guardar
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}