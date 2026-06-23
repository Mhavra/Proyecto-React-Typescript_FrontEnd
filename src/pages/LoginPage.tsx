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
import { storage, STORAGE_KEYS } from '@/services/localStorageService';
import { Usuario } from '@/interfaces';

export default function LoginPage() {
  // Estados para el formulario de login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Hook de autenticación y navegación
  const { login } = useAuth();
  const navigate = useNavigate();

  // Estados para el formulario de registro
  const [isRegistering, setIsRegistering] = useState(false);
  const [regNombre, setRegNombre] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regError, setRegError] = useState('');

  /**
   * Maneja el inicio de sesión
   * - Valida credenciales con el contexto de autenticación
   * - Si es exitoso, redirige al dashboard
   * - Si falla, muestra mensaje de error
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Credenciales incorrectas.');
      }
    } catch (err) {
      setError('Ocurrió un error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el registro de nuevos usuarios
   * - Valida los datos del formulario
   * - Verifica que el correo no esté registrado
   * - Crea un nuevo usuario y lo agrega al almacenamiento local
   */
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    // Validación del nombre
    if (!regNombre.trim() || regNombre.length < 3) {
      setRegError('El nombre debe tener al menos 3 caracteres.');
      return;
    }
    // Validación del email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) {
      setRegError('Correo electrónico inválido.');
      return;
    }
    // Validación de la contraseña
    if (regPassword.length < 4) {
      setRegError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    // Verificar que las contraseñas coincidan
    if (regPassword !== regConfirm) {
      setRegError('Las contraseñas no coinciden.');
      return;
    }
    // Verificar que el email no esté registrado
    const users = storage.get<Usuario>(STORAGE_KEYS.USUARIOS);
    if (users.some(u => u.email === regEmail)) {
      setRegError('Este correo ya está registrado.');
      return;
    }
    // Crear el nuevo usuario
    const newUser: Omit<Usuario, 'id'> = {
      nombre: regNombre.trim(),
      email: regEmail.trim(),
      password: regPassword,
      rol: 'cliente', // Por defecto, los nuevos usuarios son clientes
    };
    storage.addItem<Usuario>(STORAGE_KEYS.USUARIOS, newUser);
    // Limpiar formulario y mostrar éxito
    setRegError('');
    alert('¡Registro exitoso! Ahora inicia sesión.');
    setIsRegistering(false);
    setRegNombre('');
    setRegEmail('');
    setRegPassword('');
    setRegConfirm('');
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4">
              {/* Logo y título */}
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

              {/* Botón para volver a la tienda */}
              <button
                className="btn btn-outline-secondary w-100 mb-3 btn-sm"
                onClick={() => navigate('/')}
              >
                <i className="bi bi-arrow-left me-2"></i> Volver al inicio
              </button>

              {!isRegistering ? (
                // --- FORMULARIO DE LOGIN ---
                <>
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

                  {/* Enlace a registro */}
                  <div className="mt-2 text-center">
                    <button
                      className="btn btn-link btn-sm p-0"
                      onClick={() => setIsRegistering(true)}
                    >
                      ¿No tienes cuenta? Regístrate aquí
                    </button>
                  </div>

                  {/* Credenciales de prueba */}
                  <div className="mt-2 text-center">
                    <small className="text-muted">
                      <strong>Credenciales de prueba:</strong><br />
                      <span className="badge bg-primary me-1">Admin</span> admin@frenesi.cl / 123456<br />
                      <span className="badge bg-success me-1">Cliente</span> cliente@frenesi.cl / 123456
                    </small>
                  </div>
                </>
              ) : (
                // --- FORMULARIO DE REGISTRO ---
                <>
                  <form onSubmit={handleRegister}>
                    <div className="mb-2">
                      <label className="form-label fw-semibold small">Nombre completo</label>
                      <input
                        type="text"
                        className="form-control form-control-sm rounded-3"
                        placeholder="Tu nombre"
                        value={regNombre}
                        onChange={(e) => setRegNombre(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label fw-semibold small">Correo electrónico</label>
                      <input
                        type="email"
                        className="form-control form-control-sm rounded-3"
                        placeholder="correo@ejemplo.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label fw-semibold small">Contraseña</label>
                      <input
                        type="password"
                        className="form-control form-control-sm rounded-3"
                        placeholder="Mínimo 4 caracteres"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label fw-semibold small">Confirmar contraseña</label>
                      <input
                        type="password"
                        className="form-control form-control-sm rounded-3"
                        placeholder="Repite la contraseña"
                        value={regConfirm}
                        onChange={(e) => setRegConfirm(e.target.value)}
                        required
                      />
                    </div>
                    {regError && <div className="alert alert-danger text-center py-1 small">{regError}</div>}
                    <button
                      type="submit"
                      className="btn w-100 py-1 rounded-3 fw-semibold"
                      style={{ backgroundColor: '#6f42c1', color: 'white', fontSize: '0.9rem' }}
                    >
                      Registrarse
                    </button>
                  </form>

                  {/* Enlace a login */}
                  <div className="mt-2 text-center">
                    <button
                      className="btn btn-link btn-sm p-0"
                      onClick={() => setIsRegistering(false)}
                    >
                      ¿Ya tienes cuenta? Inicia sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}