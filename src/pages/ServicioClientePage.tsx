'use client';

import { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { storage, STORAGE_KEYS } from '@/services/localStorageService';
import { Consulta } from '@/interfaces';

export default function ServicioClientePage() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    motivo: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.nombre.trim().length < 2) newErrors.nombre = 'El nombre debe tener al menos 2 caracteres.';
    if (formData.apellido.trim().length < 1) newErrors.apellido = 'El apellido es obligatorio.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = 'Correo electrónico inválido.';
    if (formData.motivo.trim().length < 10) newErrors.motivo = 'El motivo debe tener al menos 10 caracteres.';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess(false);
      return;
    }
    setErrors({});

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
    storage.addItem<Consulta>(STORAGE_KEYS.CONSULTAS, consulta);
    setSuccess(true);
    setFormData({ nombre: '', apellido: '', email: '', motivo: '' });
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <>
      <Header />
      <main className="main formulario">
        <section className="formulario-tittle">
          <div className="about-overlay">
            <h1 className="servinfo">Servicio al cliente</h1>
          </div>
        </section>
        <div className="servinfo">
          <br />
          <p>
            Bienvenido a la sección de Servicio al cliente, donde podrá consultar sobre sus inquietudes o dudas
            en el formulario siguiente o también puede contactarnos desde nuestras redes sociales en Instagram o Facebook, donde también
            atendemos a clientes además de mostrar novedades y ofertas del momento.
          </p>
          <br />
        </div>

        <form id="contactForm" onSubmit={handleSubmit}>
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

          <div className="text-center">
            <button type="submit" className="btn btn-primary">Enviar</button>
          </div>

          {success && (
            <div className="alert alert-success mt-3" role="alert">
              ✅ Mensaje enviado, pronto te contactaremos.
            </div>
          )}
          <br />
        </form>
      </main>
      <Footer />
    </>
  );
}