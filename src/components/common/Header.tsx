'use client';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('frenesiCarrito') || '[]');
      const total = cart.reduce((acc: number, item: any) => acc + item.cantidad, 0);
      setCartCount(total);
    };
    updateCart();
    window.addEventListener('storage', updateCart);

    const dark = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(dark);
    if (dark) document.body.classList.add('dark');

    return () => window.removeEventListener('storage', updateCart);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.body.classList.toggle('dark');
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const term = (e.target as HTMLInputElement).value.trim();
      if (term) {
        navigate(`/novedades?search=${encodeURIComponent(term)}`);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="top-bar">
        Envíos a todo Chile por Bluexpress
        <span className="separador">|</span>
        Envios a RM por Paket
      </div>

      <div className="header-main">
        <div className="logo">
          <h1>
            <Link to="/">
              <img src="/assets/img/logo sin letras.png" alt="Frenesí" />
            </Link>
            Frenesí <span>Papelería</span>
          </h1>
        </div>
        <div className="acciones">
          <span className="icono" onClick={() => setSearchVisible(!searchVisible)}>
            <i className="bi bi-search-heart"></i>
            <span className="tooltip">Búsqueda</span>
          </span>
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
          <span className="icono" onClick={toggleDarkMode}>
            <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-stars'}`}></i>
            <span className="tooltip">Modo oscuro</span>
          </span>
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
          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-2 ms-2">
              <span className="text-muted small">{user?.nombre}</span>
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

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-expanded={menuOpen}
      >
        <i className="bi bi-list"></i>
      </button>

      <nav className={`menu-domi ${menuOpen ? 'mobile-open' : ''}`}>
        <div className="navbar-nav gap-3 d-flex flex-wrap">
          <Link to="/novedades" className="btn btn-outline-light rounded-pill px-3">
            Novedades
          </Link>
          <div className="menu-item">
            <span className="btn btn-outline-light rounded-pill px-3">Agendas</span>
            <div className="submenu">
              <Link to="#">Agendas 2026</Link>
              <Link to="#">Agendas perpetuas</Link>
              <Link to="#">Agendas vintage</Link>
            </div>
          </div>
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
          <div className="menu-item">
            <span className="btn btn-outline-light rounded-pill px-3">Planners</span>
            <div className="submenu">
              <Link to="#">Planners anuales</Link>
              <Link to="#">Planners mensuales</Link>
              <Link to="#">Planners semanales</Link>
            </div>
          </div>
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
          <Link to="#" className="btn btn-outline-light rounded-pill px-3">
            Sets
          </Link>
        </div>
      </nav>
    </header>
  );
}