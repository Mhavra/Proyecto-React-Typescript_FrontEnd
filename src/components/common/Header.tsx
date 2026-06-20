'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Leer carrito
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('frenesiCarrito') || '[]');
      const total = cart.reduce((acc: number, item: any) => acc + item.cantidad, 0);
      setCartCount(total);
    };
    updateCart();
    window.addEventListener('storage', updateCart);

    // Modo oscuro
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
        router.push(`/novedades?search=${encodeURIComponent(term)}`);
      }
    }
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
            <Link href="/">
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
            onClick={() => router.push('/carrito')}
            aria-label="Abrir carrito"
          >
            <i className="bi bi-cart3"></i>
            <span className="cart-counter">{cartCount}</span>
            <span className="tooltip">Carrito</span>
          </button>
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
          <Link href="/novedades" className="btn btn-outline-light rounded-pill px-3">
            Novedades
          </Link>
          <div className="menu-item">
            <span className="btn btn-outline-light rounded-pill px-3">Agendas</span>
            <div className="submenu">
              <Link href="#">Agendas 2026</Link>
              <Link href="#">Agendas perpetuas</Link>
              <Link href="#">Agendas vintage</Link>
            </div>
          </div>
          <div className="menu-item">
            <span className="btn btn-outline-light rounded-pill px-3">Retro/Vintage</span>
            <div className="submenu">
              <Link href="#">Village</Link>
              <Link href="#">Esquelas</Link>
              <Link href="#">Libretas</Link>
              <Link href="#">Bolsas</Link>
              <Link href="#">Libros de actividades</Link>
              <Link href="#">Láminas de stickers y sobres</Link>
              <Link href="#">Cuadernos y escritura</Link>
              <Link href="#">Sets</Link>
            </div>
          </div>
          <div className="menu-item">
            <span className="btn btn-outline-light rounded-pill px-3">Papelería y Organización</span>
            <div className="submenu">
              <Link href="#">Post-It</Link>
              <Link href="#">Clips</Link>
              <Link href="#">Stickers</Link>
              <Link href="#">Marca páginas</Link>
              <Link href="#">Pins</Link>
              <Link href="#">Apretadores</Link>
              <Link href="#">Organizadores de lápices</Link>
            </div>
          </div>
          <div className="menu-item">
            <span className="btn btn-outline-light rounded-pill px-3">Escritura</span>
            <div className="submenu">
              <Link href="#">Lápices</Link>
              <Link href="#">Plumas</Link>
              <Link href="#">Destacadores</Link>
              <Link href="#">Gomas y Correctores</Link>
              <Link href="#">Estuches</Link>
            </div>
          </div>
          <div className="menu-item">
            <span className="btn btn-outline-light rounded-pill px-3">Planners</span>
            <div className="submenu">
              <Link href="#">Planners anuales</Link>
              <Link href="#">Planners mensuales</Link>
              <Link href="#">Planners semanales</Link>
            </div>
          </div>
          <div className="menu-item">
            <span className="btn btn-outline-light rounded-pill px-3">Personajes</span>
            <div className="submenu">
              <Link href="#">Hello Kitty y Sanrio</Link>
              <Link href="#">Stitch</Link>
              <Link href="#">Snoopy</Link>
              <Link href="#">Winnie the Poh</Link>
              <Link href="#">Garfield</Link>
              <Link href="#">Disney</Link>
              <Link href="#">Nickelodeon</Link>
              <Link href="#">Looney Tunes y CartoonNetwork</Link>
              <Link href="#">Otros</Link>
            </div>
          </div>
          <Link href="#" className="btn btn-outline-light rounded-pill px-3">
            Sets
          </Link>
        </div>
      </nav>
    </header>
  );
}