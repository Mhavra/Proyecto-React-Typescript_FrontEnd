'use client';

import { useState } from 'react';
import { addDocument } from '@/services/firestoreService';
import { Consulta } from '@/interfaces';

export default function ValidacionForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    motivo: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // VALIDACIONES INDIVIDUALES
  // ============================================================

  const validateNombre = (value: string): string => {
    if (!value.trim()) return 'El nombre es obligatorio.';
    if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
    if (value.trim().length > 80) return 'El nombre no puede tener más de 80 caracteres.';
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) {
      return 'El nombre solo puede contener letras y espacios.';
    }
    return '';
  };

  const validateApellido = (value: string): string => {
    if (!value.trim()) return 'El apellido es obligatorio.';
    if (value.trim().length < 2) return 'El apellido debe tener al menos 2 caracteres.';
    if (value.trim().length > 80) return 'El apellido no puede tener más de 80 caracteres.';
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) {
      return 'El apellido solo puede contener letras y espacios.';
    }
    return '';
  };

  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'El correo electrónico es obligatorio.';
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value.trim())) {
      return 'Ingresa un correo válido (ejemplo: usuario@dominio.com).';
    }
    const parts = value.trim().split('@');
    if (parts.length === 2) {
      if (/^\d+$/.test(parts[0])) return 'El nombre del correo no puede ser solo números.';
      if (/\d/.test(parts[1])) return 'El dominio del correo no puede contener números después del @.';
    }
    return '';
  };

  const validateMotivo = (value: string): string => {
    if (!value.trim()) return 'El motivo es obligatorio.';
    if (value.trim().length < 10) return 'El motivo debe tener al menos 10 caracteres.';
    if (value.trim().length > 500) return 'El motivo no puede tener más de 500 caracteres.';
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,;:!?]+$/.test(value.trim())) {
      return 'El motivo solo puede contener letras, números, espacios y signos de puntuación básicos (.,;:!?).';
    }
    return '';
  };

  // ============================================================
  // MANEJADORES DE CAMBIOS CON VALIDACIÓN EN TIEMPO REAL
  // ============================================================

  const handleNombreChange = (value: string) => {
    setFormData(prev => ({ ...prev, nombre: value }));
    const error = validateNombre(value);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors.nombre = error;
      } else {
        delete newErrors.nombre;
      }
      return newErrors;
    });
  };

  const handleApellidoChange = (value: string) => {
    setFormData(prev => ({ ...prev, apellido: value }));
    const error = validateApellido(value);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors.apellido = error;
      } else {
        delete newErrors.apellido;
      }
      return newErrors;
    });
  };

  const handleEmailChange = (value: string) => {
    setFormData(prev => ({ ...prev, email: value }));
    const error = validateEmail(value);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors.email = error;
      } else {
        delete newErrors.email;
      }
      return newErrors;
    });
  };

  const handleMotivoChange = (value: string) => {
    setFormData(prev => ({ ...prev, motivo: value }));
    const error = validateMotivo(value);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors.motivo = error;
      } else {
        delete newErrors.motivo;
      }
      return newErrors;
    });
  };

  // ============================================================
  // VALIDACIÓN COMPLETA Y ENVÍO A FIRESTORE
  // ============================================================

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    const nombreError = validateNombre(formData.nombre);
    if (nombreError) newErrors.nombre = nombreError;
    const apellidoError = validateApellido(formData.apellido);
    if (apellidoError) newErrors.apellido = apellidoError;
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    const motivoError = validateMotivo(formData.motivo);
    if (motivoError) newErrors.motivo = motivoError;
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess(false);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const now = new Date();
      const consulta: Omit<Consulta, 'id'> = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        email: formData.email.trim(),
        motivo: formData.motivo.trim(),
        fecha: now.toLocaleDateString(),
        hora: now.toLocaleTimeString(),
        estado: 'no_leida',
      };

      // Guardar en Firestore usando el servicio
      await addDocument<Consulta>('consultas', consulta);

      setSuccess(true);
      setFormData({ nombre: '', apellido: '', email: '', motivo: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error al enviar consulta:', error);
      alert('Ocurrió un error al enviar la consulta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="contactForm" onSubmit={handleSubmit} noValidate>
      <div className="mb-3 row fcolor">
        <label htmlFor="contactNombre" className="col-12 col-sm-4 col-form-label text-sm-end">
          Nombre <span className="text-danger">*</span>
        </label>
        <div className="col-12 col-sm-8">
          <input
            type="text"
            id="contactNombre"
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            maxLength={80}
            placeholder="Ej: Juan"
            value={formData.nombre}
            onChange={(e) => handleNombreChange(e.target.value)}
          />
          {errors.nombre && <div className="form-error">{errors.nombre}</div>}
          <small className="text-muted">Solo letras y espacios. Mínimo 2 caracteres.</small>
        </div>
      </div>

      <div className="mb-3 row fcolor">
        <label htmlFor="contactApellido" className="col-12 col-sm-4 col-form-label text-sm-end">
          Apellido <span className="text-danger">*</span>
        </label>
        <div className="col-12 col-sm-8">
          <input
            type="text"
            id="contactApellido"
            className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
            maxLength={80}
            placeholder="Ej: Pérez"
            value={formData.apellido}
            onChange={(e) => handleApellidoChange(e.target.value)}
          />
          {errors.apellido && <div className="form-error">{errors.apellido}</div>}
          <small className="text-muted">Solo letras y espacios. Mínimo 2 caracteres.</small>
        </div>
      </div>

      <div className="mb-3 row fcolor">
        <label htmlFor="contactEmail" className="col-12 col-sm-4 col-form-label text-sm-end">
          Correo Electrónico <span className="text-danger">*</span>
        </label>
        <div className="col-12 col-sm-8">
          <input
            type="email"
            id="contactEmail"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            maxLength={90}
            placeholder="Ej: usuario@dominio.com"
            value={formData.email}
            onChange={(e) => handleEmailChange(e.target.value)}
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
          <small className="text-muted">Formato: usuario@dominio.com (sin números en el dominio).</small>
        </div>
      </div>

      <div className="mb-3 row fcolor">
        <label htmlFor="contactMotivo" className="col-12 col-sm-4 col-form-label text-sm-end">
          Motivo <span className="text-danger">*</span>
        </label>
        <div className="col-12 col-sm-8">
          <textarea
            id="contactMotivo"
            className={`form-control barramotivo ${errors.motivo ? 'is-invalid' : ''}`}
            maxLength={500}
            rows={4}
            placeholder="Describe tu consulta o duda..."
            value={formData.motivo}
            onChange={(e) => handleMotivoChange(e.target.value)}
          />
          {errors.motivo && <div className="form-error">{errors.motivo}</div>}
          <small className="text-muted">
            Mínimo 10 caracteres. Solo letras, números y puntuación básica (.,;:!?).
          </small>
        </div>
      </div>

      <div className="text-center">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

      {success && (
        <div className="alert alert-success mt-3" role="alert">
          ✅ Mensaje enviado, pronto te contactaremos.
        </div>
      )}
    </form>
  );
}