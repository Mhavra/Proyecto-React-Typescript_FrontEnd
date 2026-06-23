'use client';

import { useState } from 'react';
import { storage, STORAGE_KEYS } from '@/services/localStorageService';
import { Consulta } from '@/interfaces';

/**
 * VALIDACION FORM - Formulario de contacto con validación
 * 
 * Componente que maneja el formulario de servicio al cliente.
 * Incluye validación de campos en tiempo real y guarda las consultas en localStorage.
 * 
 * Validaciones:
 * - Nombre: solo letras y espacios, mínimo 2 caracteres
 * - Apellido: solo letras y espacios, mínimo 2 caracteres
 * - Email: formato válido (usuario@dominio.com) sin números en el nombre del correo
 * - Motivo: solo letras, números, espacios y signos de puntuación básicos, mínimo 10 caracteres
 * 
 * @component
 */
export default function ValidacionForm() {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    motivo: '',
  });
  // Estado para errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Estado para mostrar mensaje de éxito
  const [success, setSuccess] = useState(false);

  // ============================================================
  // VALIDACIONES INDIVIDUALES
  // ============================================================

  /**
   * VALIDACIÓN DE NOMBRE
   * - Solo letras (con acentos) y espacios
   * - Mínimo 2 caracteres
   * - Máximo 80 caracteres
   */
  const validateNombre = (value: string): string => {
    if (!value.trim()) return 'El nombre es obligatorio.';
    if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
    if (value.trim().length > 80) return 'El nombre no puede tener más de 80 caracteres.';
    // Solo letras (incluyendo acentos) y espacios
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) {
      return 'El nombre solo puede contener letras y espacios.';
    }
    return '';
  };

  /**
   * VALIDACIÓN DE APELLIDO
   * - Solo letras (con acentos) y espacios
   * - Mínimo 2 caracteres
   * - Máximo 80 caracteres
   */
  const validateApellido = (value: string): string => {
    if (!value.trim()) return 'El apellido es obligatorio.';
    if (value.trim().length < 2) return 'El apellido debe tener al menos 2 caracteres.';
    if (value.trim().length > 80) return 'El apellido no puede tener más de 80 caracteres.';
    // Solo letras (incluyendo acentos) y espacios
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) {
      return 'El apellido solo puede contener letras y espacios.';
    }
    return '';
  };

  /**
   * VALIDACIÓN DE EMAIL
   * - Formato: palabra@palabra.palabra
   * - El nombre del correo (antes del @) no puede ser solo números
   * - El dominio (después del @) no puede contener números
   */
  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'El correo electrónico es obligatorio.';
    
    // Expresión regular para email válido
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(value.trim())) {
      return 'Ingresa un correo válido (ejemplo: usuario@dominio.com).';
    }
    
    // Validar que el nombre del correo (antes del @) no sea solo números
    const parts = value.trim().split('@');
    if (parts.length === 2) {
      const localPart = parts[0];
      const domain = parts[1];
      
      // Verificar que el nombre del correo NO sea solo números
      if (/^\d+$/.test(localPart)) {
        return 'El nombre del correo no puede ser solo números.';
      }
      
      // Verificar que el dominio no contenga números
      if (/\d/.test(domain)) {
        return 'El dominio del correo no puede contener números después del @.';
      }
    }
    
    return '';
  };

  /**
   * VALIDACIÓN DE MOTIVO
   * - No permite caracteres especiales como @#${}[]<> etc.
   * - Solo letras, números, espacios y signos de puntuación básicos (.,;:!?)
   * - Mínimo 10 caracteres
   * - Máximo 500 caracteres
   */
  const validateMotivo = (value: string): string => {
    if (!value.trim()) return 'El motivo es obligatorio.';
    if (value.trim().length < 10) return 'El motivo debe tener al menos 10 caracteres.';
    if (value.trim().length > 500) return 'El motivo no puede tener más de 500 caracteres.';
    // Solo letras, números, espacios y signos de puntuación básicos
    // Permitimos: letras (con acentos), números, espacios, . , ; : ! ?
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,;:!?]+$/.test(value.trim())) {
      return 'El motivo solo puede contener letras, números, espacios y signos de puntuación básicos (.,;:!?).';
    }
    return '';
  };

  // ============================================================
  // MANEJADORES DE CAMBIOS CON VALIDACIÓN EN TIEMPO REAL
  // ============================================================

  /**
   * Maneja el cambio del campo nombre con validación en tiempo real
   */
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

  /**
   * Maneja el cambio del campo apellido con validación en tiempo real
   */
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

  /**
   * Maneja el cambio del campo email con validación en tiempo real
   */
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

  /**
   * Maneja el cambio del campo motivo con validación en tiempo real
   */
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
  // VALIDACIÓN COMPLETA Y ENVÍO
  // ============================================================

  /**
   * VALIDACIÓN COMPLETA DEL FORMULARIO
   * Ejecuta todas las validaciones y retorna un objeto con los errores
   */
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

  /**
   * Maneja el envío del formulario
   * - Valida todos los campos
   * - Si hay errores, los muestra
   * - Si no hay errores, guarda la consulta en localStorage
   * - Muestra mensaje de éxito y resetea el formulario
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess(false);
      return;
    }
    setErrors({});

    // Construcción del objeto consulta con fecha y hora
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

    // Guardar en localStorage usando el servicio de storage
    storage.addItem<Consulta>(STORAGE_KEYS.CONSULTAS, consulta);

    // Mostrar mensaje de éxito y resetear formulario
    setSuccess(true);
    setFormData({ nombre: '', apellido: '', email: '', motivo: '' });
    setTimeout(() => setSuccess(false), 5000); // Ocultar mensaje después de 5s
  };

  return (
    <form id="contactForm" onSubmit={handleSubmit} noValidate>
      {/* Campo Nombre */}
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

      {/* Campo Apellido */}
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

      {/* Campo Email */}
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

      {/* Campo Motivo */}
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
          ></textarea>
          {errors.motivo && <div className="form-error">{errors.motivo}</div>}
          <small className="text-muted">
            Mínimo 10 caracteres. Solo letras, números y puntuación básica (.,;:!?).
          </small>
        </div>
      </div>

      {/* Botón de envío */}
      <div className="text-center">
        <button type="submit" className="btn btn-primary">Enviar</button>
      </div>

      {/* Mensaje de éxito */}
      {success && (
        <div className="alert alert-success mt-3" role="alert">
          ✅ Mensaje enviado, pronto te contactaremos.
        </div>
      )}
    </form>
  );
}
