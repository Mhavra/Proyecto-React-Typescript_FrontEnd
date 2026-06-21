'use client';

import { useState } from 'react';
import { storage, STORAGE_KEYS } from '@/services/localStorageService';
import { Consulta } from '@/interfaces';

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

  // Función de validación de campos
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.nombre.trim().length < 2) newErrors.nombre = 'El nombre debe tener al menos 2 caracteres.';
    if (formData.apellido.trim().length < 1) newErrors.apellido = 'El apellido es obligatorio.';
    if (!/^[^\s@]+@(gmail\.com|hotmail\.com|outlook\.com)$/.test(formData.email.trim())) {
      newErrors.email = 'Solo se permiten correos Gmail, Hotmail u Outlook.';
    }
    if (formData.motivo.trim().length < 10) newErrors.motivo = 'El motivo debe tener al menos 10 caracteres.';
    return newErrors;
  };

  // Manejo del envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Si hay errores, se muestran
      setSuccess(false);
      return;
    }
    setErrors({}); // Limpia errores previos

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

    // Guardar en localStorage
    storage.addItem<Consulta>(STORAGE_KEYS.CONSULTAS, consulta);

    // Mostrar mensaje de éxito y resetear formulario
    setSuccess(true);
    setFormData({ nombre: '', apellido: '', email: '', motivo: '' });
    setTimeout(() => setSuccess(false), 5000); // Ocultar mensaje después de 5s
  };

  return (
    <form id="contactForm" onSubmit={handleSubmit}>
      {/* Campo Nombre */}
      <div className="mb-3 row fcolor">
        <label htmlFor="contactNombre" className="col-12 col-sm-4 col-form-label text-sm-end">Nombre</label>
        <div className="col-12 col-sm-8">
          <input
            type="text"
            id="contactNombre"
            className="form-control"
            maxLength={80}
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />
          {errors.nombre && <div className="form-error">{errors.nombre}</div>}
        </div>
      </div>

      {/* Campo Apellido */}
      <div className="mb-3 row fcolor">
        <label htmlFor="contactApellido" className="col-12 col-sm-4 col-form-label text-sm-end">Apellido</label>
        <div className="col-12 col-sm-8">
          <input
            type="text"
            id="contactApellido"
            className="form-control"
            maxLength={80}
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
          />
          {errors.apellido && <div className="form-error">{errors.apellido}</div>}
        </div>
      </div>

      {/* Campo Email */}
      <div className="mb-3 row fcolor">
        <label htmlFor="contactEmail" className="col-12 col-sm-4 col-form-label text-sm-end">Correo Electrónico</label>
        <div className="col-12 col-sm-8">
          <input
            type="email"
            id="contactEmail"
            className="form-control"
            maxLength={90}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>
      </div>

      {/* Campo Motivo */}
      <div className="mb-3 row fcolor">
        <label htmlFor="contactMotivo" className="col-12 col-sm-4 col-form-label text-sm-end">Motivo</label>
        <div className="col-12 col-sm-8">
          <textarea
            id="contactMotivo"
            className="form-control barramotivo"
            maxLength={200}
            rows={4}
            value={formData.motivo}
            onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
          ></textarea>
          {errors.motivo && <div className="form-error">{errors.motivo}</div>}
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
