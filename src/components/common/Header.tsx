'use client';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  // Estado del contador de productos en el carrito
  const [cartCount, setCartCount] = useState(0);
  // Estado del modo oscuro
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Estado del menú móvil (abierto/cerrado)
  const [menuOpen, setMenuOpen] = useState(false);
  // Estado para mostrtar/ocultar la barra de búsqueda
  const [searchVisible, setSearchVisible] = useState(false);
  const navigate = useNavigate();
  //Hook de autenticaci´on para obtener el usuario y la función de logout 
  const { user, logout, isAuthenticated } = useAuth();

  /**
   * Efecto para:
   * 1. Actualizar el contador del carrito
   * 2. Escuchar cambios en el carrito (storage)
   * 3. Cargar preferencia de modo oscuro
   */
  useEffect(() => {
    // Función que actualiza el contador desde localStorage
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('frenesiCarrito') || '[]');
      const total = cart.reduce((acc: number, item: any) => acc + item.cantidad, 0);
      setCartCount(total);
    };
    updateCart();
    // Escuchar cambios en localStorage (evento 'storage')
    window.addEventListener('storage', updateCart);

    // Cargar modo oscuro desde localStorage
    const dark = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(dark);
    if (dark) document.body.classList.add('dark');

    // Limpieza al desmontar el componente
    return () => window.removeEventListener('storage', updateCart);
  }, []);

  /**
   * Alterna entre modo claro y oscuro
   * Guarda la preferencia en localStorage y aplica clase CSS al body
   */
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.body.classList.toggle('dark');
  };

  /**
   * Maneja la búsqueda al presionar Enter
   * Redirige a la página de novedades con el término de búsqueda
   */
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const term = (e.target as HTMLInputElement).value.trim();
      if (term) {
        navigate(`/novedades?search=${encodeURIComponent(term)}`);
      }
    }
  };

  /**
   * Maneja el cierre de sesión
   * Redirige a la página de inicio
   */
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      {/* Barra superior con información de envíos */}
      <div className="top-bar">
        Envíos a todo Chile por Bluexpress
        <span className="separador">|</span>
        Envios a RM por Paket
      </div>

      {/* Sección principal del header: logo, acciones y usuario */}
      <div className="header-main">
        {/* Logo y nombre de la tienda */}
        <div className="logo">
          <h1>
            <Link to="/">
              <img src="/assets/img/logo sin letras.png" alt="Frenesí" />
            </Link>
            Frenesí <span>Papelería</span>
          </h1>
        </div>

        {/* Acciones del usuario: búsqueda, modo oscuro, carrito, login/logout */}
        <div className="acciones">
          {/* Botón de búsqueda */}
          <span className="icono" onClick={() => setSearchVisible(!searchVisible)}>
            <i className="bi bi-search-heart"></i>
            <span className="tooltip">Búsqueda</span>
          </span>
          {/* Input de búsqueda (aparece al hacer clic) */}
          {searchVisible && (
            <input
              type="text"
              placeholder="Buscar producto..."
              className="header-search-input"
              onKeyDown={handleSearch}
              autoFocus
              onBlur={() => setTimeout(() => setSearchVisible(false), 200)}
            />
          )}

          {/* Botón de modo oscuro */}
          <span className="icono" onClick={toggleDarkMode}>
            <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-stars'}`}></i>
            <span className="tooltip">Modo oscuro</span>
          </span>

          {/* Botón del carrito con contador */}
          <button
            className="icono cart-button"
            onClick={() => navigate('/carrito')}
            aria-label="Abrir carrito"
          >
            <i className="bi bi-cart3"></i>
            <span className="cart-counter">{cartCount}</span>
            <span className="tooltip">Carrito</span>
          </button>

          {/* Login / Logout */}
           {/* Login / Logout con enlace a dashboard para admin */}
          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-2 ms-2">
              {/* Si es admin, el nombre es un enlace al dashboard */}
              {user?.rol === 'admin' ? (
                <Link to="/dashboard" className="text-decoration-none text-muted small fw-bold">
                  {user?.nombre}
                </Link>
              ) : (
                <span className="text-muted small">{user?.nombre}</span>
              )}
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                Salir
              </button>
            </div>
            ) : (
            <Link to="/login" className="btn btn-outline-primary btn-sm ms-2">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>

      {/* Botón de menú hamburguesa (visible en móvil) */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-expanded={menuOpen}
      >
        <i className="bi bi-list"></i>
      </button>

      {/* Menú de navegación principal con submenús */}
      <nav className={`menu-domi ${menuOpen ? 'mobile-open' : ''}`}>
        <div className="navbar-nav gap-3 d-flex flex-wrap">
          {/* Enlace a Novedades */}
          <Link to="/novedades" className="btn btn-outline-light rounded-pill px-3">
            Novedades
          </Link>

          {/* Menú Agendas con submenú */}
          <div className="menu-item">
            <span className="btn btn-outline-light rounded-pill px-3">Agendas</span>
            <div className="submenu">
              <Link to="#">Agendas 2026</Link>
              <Link to="#">Agendas perpetuas</Link>
              <Link to="#">Agendas vintage</Link>
            </div>
          </div>

          {/* Menú Retro/Vintage con submenú */}
          <div className="menu-item">
            <span className="btn btn-outline-light rounded-pill px-3">Retro/Vintage</span>
            <div className="submenu">
              <Link to="#">Village</Link>
              <Link to="#">Esquelas</Link>
              <Link to="#">Libretas</Link>
              <Link to="#">Bolsas</Link>
              <Link to="#">Libros de actividades</Link>
              <Link to="#">Láminas de stickers y sobres</Link>
              <Link to="#">Cuadernos y escritura</Link>
              <Link to="#">Sets</Link>
            </div>
          </div>
          
          {/* Menú Papelería y Organización con submenú */}
          <div className="menu-item">
            <span className="btn btn-outline-light rounded-pill px-3">Papelería y Organización</span>
            <div className="submenu">
              <Link to="#">Post-It</Link>
              <Link to="#">Clips</Link>
              <Link to="#">Stickers</Link>
              <Link to="#">Marca páginas</Link>
              <Link to="#">Pins</Link>
              <Link to="#">Apretadores</Link>
              <Link to="#">Organizadores de lápices</Link>
            </div>
          </div>

          {/* Menú Escritura con submenú */}
          <div className="menu-item">
            <span className="btn btn-outline-light rounded-pill px-3">Escritura</span>
            <div className="submenu">
              <Link to="#">Lápices</Link>
              <Link to="#">Plumas</Link>
              <Link to="#">Destacadores</Link>
              <Link to="#">Gomas y Correctores</Link>
              <Link to="#">Estuches</Link>
            </div>
          </div>

          {/* Menú Planners con submenú */}
          <div className="menu-item">
            <span className="btn btn-outline-light rounded-pill px-3">Planners</span>
            <div className="submenu">
              <Link to="#">Planners anuales</Link>
              <Link to="#">Planners mensuales</Link>
              <Link to="#">Planners semanales</Link>
            </div>
          </div>

          {/* Menú Personajes con submenú */}
          <div className="menu-item">
            <span className="btn btn-outline-light rounded-pill px-3">Personajes</span>
            <div className="submenu">
              <Link to="#">Hello Kitty y Sanrio</Link>
              <Link to="#">Stitch</Link>
              <Link to="#">Snoopy</Link>
              <Link to="#">Winnie the Poh</Link>
              <Link to="#">Garfield</Link>
              <Link to="#">Disney</Link>
              <Link to="#">Nickelodeon</Link>
              <Link to="#">Looney Tunes y CartoonNetwork</Link>
              <Link to="#">Otros</Link>
            </div>
          </div>

          {/* Enlace a Sets */}
          <Link to="#" className="btn btn-outline-light rounded-pill px-3">
            Sets
          </Link>
        </div>
      </nav>
    </header>
  );
}