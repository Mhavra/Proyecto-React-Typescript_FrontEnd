/**
 LAYOUT - Componente principal con Sidebar y Navbar
 @component
 @param props.children - Componentes hijos
 @param props.user - Usuario autenticado
 @param props.onLogout - Función de logout
 */

'use client';

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Usuario } from '@/interfaces';

interface LayoutProps {
  children: React.ReactNode;
  user: Usuario;
  onLogout: () => void;
}

/**
 * Configuración de navegación del sidebar
 * Cada item tiene: nombre, ruta y ícono de Bootstrap Icons
 */
const navigation = [
  { name: 'Dashboard', path: '/dashboard', icon: 'bi bi-grid-1x2-fill' },
  { name: 'Productos', path: '/productos', icon: 'bi bi-box-seam-fill' },
  { name: 'Pedidos', path: '/pedidos', icon: 'bi bi-cart-fill' },
  { name: 'Consultas', path: '/consultas', icon: 'bi bi-chat-dots-fill' },
  { name: 'Usuarios', path: '/usuarios', icon: 'bi bi-people-fill' },
];

export default function Layout({ children, user, onLogout }: LayoutProps) {
  // Estado para modo oscuro
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Estado para menú móvil (sidebar colapsada)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Efecto para cargar la preferencia de modo oscuro al montar el componente
   */
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    if (darkMode) document.body.classList.add('dark');
  }, []);

  /**
   * Alterna entre modo claro y oscuro
   */
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.body.classList.toggle('dark');
  };
  /**
   * Maneja el logout y redirige a la tienda
   */
  const handleLogout = () => {
    onLogout();
    navigate('/'); // Redirige a TiendaPage
  };

  return (
    <div className="d-flex vh-100 overflow-hidden">
      {/* Sidebar - visible en desktop */}
      <div className="sidebar d-none d-md-flex flex-column flex-shrink-0">
        {/* Encabezado del sidebar */}
        <div className="d-flex align-items-center px-4 py-3 border-bottom">
          <h5 className="fw-bold mb-0" style={{ color: '#6f42c1' }}>Frenesí</h5>
          <span className="ms-1 text-muted small">Intranet</span>
        </div>

        {/* Navegación del sidebar */}
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

        {/* Pie de página del sidebar */}
        <div className="p-3 border-top">
          <small className="text-muted">Frenesí Papelería v1.0</small>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Header superior - visible en móvil y desktop */}
        <header className="bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
          {/* Botón para abrir menú móvil */}
          <button
            className="btn d-md-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="bi bi-list fs-4"></i>
          </button>
          <h5 className="mb-0 fw-semibold d-md-none">Frenesí</h5>
          
          {/* Acciones del usuario */}
          <div className="d-flex align-items-center gap-2 ms-auto">
            {/* Botón de modo oscuro */}
            <button
              onClick={toggleDarkMode}
              className="btn btn-outline-secondary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
            >
              <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
            </button>

            {/* Información del usuario */}
            <div className="d-flex align-items-center gap-2">
              <div className="text-end d-none d-sm-block">
                <div className="small fw-semibold text-dark">{user.nombre}</div>
                <div className="small text-muted">{user.rol}</div>
              </div>
              {/* Avatar (inicial del nombre) */}
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 36, height: 36 }}
              >
                <span className="fw-semibold small">{user.nombre.charAt(0).toUpperCase()}</span>
              </div>
            </div>

            {/* Botón de cerrar sesión */}
            <button onClick={handleLogout} className="btn btn-danger btn-sm px-3">
              <i className="bi bi-box-arrow-right me-1"></i>
              <span className="d-none d-sm-inline">Salir</span>
            </button>
          </div>
        </header>

        {/* Menú móvil - se muestra cuando está abierto */}
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
        
        {/* Área de contenido principal */}
        <main className="flex-grow-1 overflow-auto p-4" style={{ backgroundColor: '#f8f9fa' }}>
          {children}
        </main>
      </div>
    </div>
  );
}