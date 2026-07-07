// src/pages/RegisterPage.tsx
'use client';

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { addDocument } from '@/services/firestoreService';
import { Usuario } from '@/interfaces';

export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateNombre = (value: string): string => {
    if (!value.trim()) return 'El nombre es obligatorio.';
    if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) {
      return 'El nombre solo puede contener letras y espacios.';
    }
    return '';
  };

  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'El correo es obligatorio.';
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value.trim())) {
      return 'Ingresa un correo válido (ej: usuario@dominio.com).';
    }
    const parts = value.trim().split('@');
    if (parts.length === 2 && /^\d+$/.test(parts[0])) {
      return 'El nombre del correo no puede ser solo números.';
    }
    if (parts.length === 2 && /\d/.test(parts[1])) {
      return 'El dominio del correo no puede contener números.';
    }
    return '';
  };

  const validatePassword = (value: string): string => {
    if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    const nombreError = validateNombre(nombre);
    if (nombreError) { setError(nombreError); setLoading(false); return; }

    const emailError = validateEmail(email);
    if (emailError) { setError(emailError); setLoading(false); return; }

    const passwordError = validatePassword(password);
    if (passwordError) { setError(passwordError); setLoading(false); return; }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 2. Guardar en Firestore (colección 'usuario')
      await addDocument<Usuario>('usuario', {
        id: uid, // Usamos el UID como ID del documento (lo forzamos)
        nombre: nombre.trim(),
        email: email.trim(),
        rol: 'cliente', // Por defecto, cliente
      } as any); // Forzamos porque addDocument espera Omit<Usuario, 'id'>

      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      console.error('Error en registro:', err);
      const errorCode = err.code;
      if (errorCode === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado.');
      } else if (errorCode === 'auth/invalid-email') {
        setError('Correo inválido.');
      } else if (errorCode === 'auth/weak-password') {
        setError('La contraseña es demasiado débil.');
      } else {
        setError('Ocurrió un error al registrarse. Intenta de nuevo.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4">
              <div className="text-center mb-3">
                <img
                  src="/assets/img/logo-sin-letras.png"
                  alt="Frenesí"
                  style={{ height: 60 }}
                  className="mb-2"
                  onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                />
                <h2 className="fw-bold" style={{ color: '#6f42c1', fontSize: '1.8rem' }}>Frenesí</h2>
                <p className="text-muted small">Crear cuenta</p>
              </div>

              <button
                className="btn btn-outline-secondary w-100 mb-3 btn-sm"
                onClick={() => navigate('/')}
              >
                <i className="bi bi-arrow-left me-2"></i> Volver al inicio
              </button>

              {success ? (
                <div className="alert alert-success text-center">
                  ✅ Registro exitoso. Serás redirigido al login...
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <label className="form-label fw-semibold small">Nombre completo</label>
                    <input
                      type="text"
                      className="form-control form-control-sm rounded-3"
                      placeholder="Tu nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold small">Correo electrónico</label>
                    <input
                      type="email"
                      className="form-control form-control-sm rounded-3"
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold small">Contraseña (mínimo 6 caracteres)</label>
                    <input
                      type="password"
                      className="form-control form-control-sm rounded-3"
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold small">Confirmar contraseña</label>
                    <input
                      type="password"
                      className="form-control form-control-sm rounded-3"
                      placeholder="••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <div className="alert alert-danger text-center py-1 small">{error}</div>}
                  <button
                    type="submit"
                    className="btn w-100 py-1 rounded-3 fw-semibold"
                    style={{ backgroundColor: '#6f42c1', color: 'white', fontSize: '0.9rem' }}
                    disabled={loading}
                  >
                    {loading ? 'Registrando...' : 'Registrarse'}
                  </button>
                </form>
              )}

              <div className="mt-2 text-center">
                <Link to="/login" className="btn btn-link btn-sm p-0">
                  ¿Ya tienes cuenta? Inicia sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}