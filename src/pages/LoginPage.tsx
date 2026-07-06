// src/pages/LoginPage.tsx
// Página de login con Firebase Authentication.
// Los errores de Firebase se muestran al usuario de forma comprensible.

'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Maneja el inicio de sesión con Firebase.
   * Captura errores de Firebase y muestra mensajes legibles.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
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
                <p className="text-muted small">Papelería · Intranet</p>
              </div>

              <button
                className="btn btn-outline-secondary w-100 mb-3 btn-sm"
                onClick={() => navigate('/')}
              >
                <i className="bi bi-arrow-left me-2"></i> Volver al inicio
              </button>

              <form onSubmit={handleLogin}>
                <div className="mb-2">
                  <label className="form-label fw-semibold small">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control form-control-sm rounded-3"
                    placeholder="admin@frenesi.cl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label fw-semibold small">Contraseña</label>
                  <input
                    type="password"
                    className="form-control form-control-sm rounded-3"
                    placeholder="123456"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}