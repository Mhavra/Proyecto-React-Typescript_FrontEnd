/**
 LAYOUT - Componente principal con Sidebar y Navbar
 @component
 @param props.children - Componentes hijos
 @param props.user - Usuario autenticado
 @param props.onLogout - Función de logout
 */

'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Usuario } from '@/interfaces';

interface LayoutProps {
  children: React.ReactNode;
  user: Usuario;
  onLogout: () => void;
}

const navigation = [
  { name: 'Dashboard', path: '/', icon: 'bi bi-grid-1x2-fill' },
  { name: 'Productos', path: '/productos', icon: 'bi bi-box-seam-fill' },
  { name: 'Pedidos', path: '/pedidos', icon: 'bi bi-cart-fill' },
  { name: 'Consultas', path: '/consultas', icon: 'bi bi-chat-dots-fill' },
  { name: 'Usuarios', path: '/usuarios', icon: 'bi bi-people-fill' },
];

export default function Layout({ children, user, onLogout }: LayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div className="d-flex vh-100 overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="sidebar d-none d-md-flex flex-column flex-shrink-0">
        <div className="d-flex align-items-center px-4 py-3 border-bottom">
          <h5 className="fw-bold mb-0" style={{ color: '#6f42c1' }}>Frenesí</h5>
          <span className="ms-1 text-muted small">Intranet</span>
        </div>

        <nav className="nav flex-column p-3 flex-grow-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`sidebar-link mb-1 ${isActive ? 'active' : ''}`}
              >
                <i className={`${item.icon} me-3 ${isActive ? 'text-primary' : 'text-muted'}`}></i>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-top">
          <small className="text-muted">Frenesí Papelería v1.0</small>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Navbar */}
        <header className="bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
          <button
            className="btn d-md-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="bi bi-list fs-4"></i>
          </button>

          <h5 className="mb-0 fw-semibold d-md-none">Frenesí</h5>

          <div className="d-flex align-items-center gap-2 ms-auto">
            <button
              onClick={toggleDarkMode}
              className="btn btn-outline-secondary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
            >
              <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
            </button>

            <div className="d-flex align-items-center gap-2">
              <div className="text-end d-none d-sm-block">
                <div className="small fw-semibold text-dark">{user.nombre}</div>
                <div className="small text-muted">{user.rol}</div>
              </div>
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 36, height: 36 }}
              >
                <span className="fw-semibold small">{user.nombre.charAt(0).toUpperCase()}</span>
              </div>
            </div>

            <button onClick={onLogout} className="btn btn-danger btn-sm px-3">
              <i className="bi bi-box-arrow-right me-1"></i>
              <span className="d-none d-sm-inline">Salir</span>
            </button>
          </div>
        </header>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="d-md-none bg-white border-bottom p-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`d-flex align-items-center py-2 px-3 rounded ${isActive ? 'bg-light text-primary' : 'text-dark'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className={`${item.icon} me-3`}></i>
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}

        <main className="flex-grow-1 overflow-auto p-4" style={{ backgroundColor: '#f8f9fa' }}>
          {children}
        </main>
      </div>
    </div>
  );
}