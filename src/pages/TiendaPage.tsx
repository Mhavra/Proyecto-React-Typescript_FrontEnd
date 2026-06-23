'use client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { storage, STORAGE_KEYS } from '@/services/localStorageService';
import { Producto } from '@/interfaces';

export default function TiendaPage() {
  const [vintageProducts, setVintageProducts] = useState<Producto[]>([]);
  const [nuevosProducts, setNuevosProducts] = useState<Producto[]>([]);

  useEffect(() => {
    const all = storage.get<Producto>(STORAGE_KEYS.PRODUCTOS);
    const vintage = all.filter(p => p.categoria?.toLowerCase() === 'vintage');
    const nuevos = all.filter(p => p.categoria?.toLowerCase() === 'nuevos');
    // Mostrar solo los primeros 4 de cada categoría
    setVintageProducts(vintage.slice(0, 4));
    setNuevosProducts(nuevos.slice(0, 4));
  }, []);

  const handleAddToCart = (prod: Producto) => {
    const cart = JSON.parse(localStorage.getItem('frenesiCarrito') || '[]');
    const existing = cart.find((item: any) => String(item.id) === String(prod.id));
    if (existing) {
      existing.cantidad += 1;
    } else {
      cart.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: 1 });
    }
    localStorage.setItem('frenesiCarrito', JSON.stringify(cart));
    // Disparar evento para actualizar el contador en el header
    window.dispatchEvent(new Event('storage'));
  };

  const renderProductGrid = (products: Producto[], title: string, subtitle: string) => {
    if (products.length === 0) return null;
    return (
      <>
        <div className="row g-1 text-center align-items-center d-flex mt-5">
          <h1>{title}</h1>
          <p className="hero-subtitle">{subtitle}</p>
        </div>
        <div className="row g-4 justify-content-center">
          {products.map(prod => (
            <div key={prod.id} className="col-6 col-md-3">
              <div className="card border-0 h-100">
                <div className="card-img-top">
                  <img
                    src={prod.imagen}
                    alt={prod.nombre}
                    style={{ width: '100%', aspectRatio: '1/1', objectFit: 'contain' }}
                  />
                </div>
                <div className="card-body p-0 mt-3 text-center">
                  <div className="product-title">{prod.nombre}</div>
                  {/* 🔹 Descripción agregada */}
                  {prod.descripcion && (
                    <div className="product-description small text-muted mt-1" style={{ fontSize: '0.8rem', padding: '0 8px' }}>
                      {prod.descripcion.length > 60 ? prod.descripcion.substring(0, 60) + '...' : prod.descripcion}
                    </div>
                  )}
                  <div className="product-price">${prod.precio}</div>
                  <button
                    className="btn btn-add-cart w-100 mt-2"
                    onClick={() => handleAddToCart(prod)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <Header />
      <main className="main">
        {/* Hero */}
        <div className="seccion-slice-1 position-relative" style={{ minHeight: '80vh' }}>
          <div
            id="hero-image"
            className="position-absolute w-100 h-100"
            style={{ backgroundImage: "url('/assets/img/img_productos/Vintage/vintage.jpeg')" }}
          ></div>
          <section className="hero-banner d-flex align-items-center text-center position-absolute w-100 h-100">
            <div className="container position-relative">
              <p className="hero-subtitle">Papelería Vintage</p>
              <h1 className="hero-title">Detalles que inspiran</h1>
              <a href="#promoVintage" className="hero-btn">Retro/Vintage</a>
            </div>
          </section>
        </div>

        {/* Sección Vintage */}
        {renderProductGrid(vintageProducts, 'Vintage', 'Revive tus recuerdos')}

        {/* Sección Nuevos Productos */}
        {renderProductGrid(nuevosProducts, 'Nuevos Productos', 'Productos recién agregados')}

        {/* Botón Ver más */}
        <div className="container text-center mt-0 mb-4">
          <Link to="/novedades" className="btn btn-ver-mas px-5 py-3">
            Ver más productos
          </Link>
        </div>

        {/* Sección de promociones (3 bloques) */}
        <section className="container-fluid px-1 promo-section px-0 pb-2">
          <div className="row g-1">
            <div className="col-md-4">
              <div className="promo-box">
                <img src="/assets/img/img_productos/papeleria_actu.jpg" alt="Nuevos Productos" />
                <div className="promo-content">
                  <h3>Nuevos Productos</h3>
                  <Link to="/novedades" className="btn btn-light btn-sm">Ver más</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="promo-box">
                <img src="/assets/img/img_productos/stickers.jpg" alt="Stickers" />
                <div className="promo-content">
                  <h3>Stickers</h3>
                  <Link to="#" className="btn btn-light btn-sm">Ver más</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="promo-box">
                <img src="/assets/img/img_productos/img_productos_7.jpg" alt="Lápices" />
                <div className="promo-content">
                  <h3>Lápices</h3>
                  <Link to="#" className="btn btn-light btn-sm">Ver más</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}