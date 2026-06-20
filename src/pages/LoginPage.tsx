/**
 * LOGIN PAGE - Página de inicio de sesión
 * 
 * Permite a usuarios administradores y clientes autenticarse.
 * Redirige según el rol: admin → intranet, cliente → index.
 * 
 * @page /login
 */

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Credenciales incorrectas. Intenta nuevamente.');
      }
    } catch (err) {
      setError('Ocurrió un error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <img
                  src="/assets/img/logo-sin-letras.png"
                  alt="Frenesí"
                  style={{ height: 80 }}
                  className="mb-3"
                  onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                />
                <h2 className="fw-bold" style={{ color: '#6f42c1' }}>Frenesí</h2>
                <p className="text-muted">Papelería · Intranet</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">Correo electrónico</label>
                  <input
                    id="email"
                    type="email"
                    className="form-control form-control-lg rounded-3"
                    placeholder="admin@frenesi.cl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">Contraseña</label>
                  <input
                    id="password"
                    type="password"
                    className="form-control form-control-lg rounded-3"
                    placeholder="123456"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <div className="alert alert-danger text-center py-2">{error}</div>}
                <button
                  type="submit"
                  className="btn w-100 py-2 rounded-3 fw-semibold"
                  style={{ backgroundColor: '#6f42c1', color: 'white' }}
                  disabled={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
              </form>
              <div className="mt-4 text-center">
                <small className="text-muted">
                  <strong>Credenciales de prueba:</strong><br />
                  <span className="badge bg-primary me-1">Admin</span> admin@frenesi.cl / 123456<br />
                  <span className="badge bg-success me-1">Cliente</span> cliente@frenesi.cl / 123456
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}