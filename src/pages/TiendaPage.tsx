'use client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { storage, STORAGE_KEYS } from '@/services/localStorageService';
import { Producto } from '@/interfaces';

/**
 * TIENDA PAGE - Página principal de la tienda
 * 
 * Muestra:
 * - Hero banner con imagen de fondo
 * - Productos vintage (primeros 4 con stock)
 * - Nuevos productos (primeros 4 con stock)
 * - Botón para ver más productos
 * - Sección de promociones (3 bloques)
 * 
 * @page /
 */
export default function TiendaPage() {
  // Estados para productos vintage y nuevos
  const [vintageProducts, setVintageProducts] = useState<Producto[]>([]);
  const [nuevosProducts, setNuevosProducts] = useState<Producto[]>([]);

  /**
   * Carga productos desde localStorage al montar el componente
   * Filtra por categoría y solo muestra productos con stock > 0
   * Toma solo los primeros 4 de cada categoría
   */
  useEffect(() => {
    const all = storage.get<Producto>(STORAGE_KEYS.PRODUCTOS);
    // Filtrar productos con stock > 0 y stock no undefined
    const vintage = all.filter(p => 
      p.categoria?.toLowerCase() === 'vintage' && 
      (p.stock !== undefined && p.stock > 0)
    );
    const nuevos = all.filter(p => 
      p.categoria?.toLowerCase() === 'nuevos' && 
      (p.stock !== undefined && p.stock > 0)
    );
    setVintageProducts(vintage.slice(0, 4));
    setNuevosProducts(nuevos.slice(0, 4));
  }, []);

  /**
   * Agrega un producto al carrito
   * Solo permite agregar si hay stock disponible
   * @param prod - Producto a agregar
   */
  const handleAddToCart = (prod: Producto) => {
    // Verificar si hay stock disponible (manejando undefined)
    const stockDisponible = prod.stock !== undefined ? prod.stock : 0;
    if (stockDisponible <= 0) {
      alert('No hay stock disponible de este producto.');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('frenesiCarrito') || '[]');
    const existing = cart.find((item: any) => String(item.id) === String(prod.id));
    
    // Si el producto ya está en el carrito, verificar que no supere el stock
    if (existing) {
      if (existing.cantidad >= stockDisponible) {
        alert(`Solo hay ${stockDisponible} unidades disponibles.`);
        return;
      }
      existing.cantidad += 1;
    } else {
      cart.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: 1 });
    }
    
    localStorage.setItem('frenesiCarrito', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
  };

  /**
   * Obtiene el stock de forma segura (maneja undefined)
   */
  const getStock = (prod: Producto): number => {
    return prod.stock !== undefined ? prod.stock : 0;
  };

  /**
   * Verifica si un producto tiene stock
   */
  const hasStock = (prod: Producto): boolean => {
    return getStock(prod) > 0;
  };

  /**
   * Renderiza un grid de productos
   * @param products - Lista de productos a mostrar
   * @param title - Título de la sección
   * @param subtitle - Subtítulo de la sección
   */
  const renderProductGrid = (products: Producto[], title: string, subtitle: string) => {
    if (products.length === 0) return null;
    return (
      <>
        <div className="row g-1 text-center align-items-center d-flex mt-5">
          <h1>{title}</h1>
          <p className="hero-subtitle">{subtitle}</p>
        </div>
        <div className="row g-4 justify-content-center">
          {products.map(prod => {
            const stock = getStock(prod);
            const inStock = stock > 0;
            
            return (
              <div key={prod.id} className="col-6 col-md-3">
                <div className="card border-0 h-100 position-relative">
                  {/* Overlay "Sin stock" - se muestra si el stock es 0 */}
                  {!inStock && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center" style={{ zIndex: 10, borderRadius: '8px' }}>
                      <span className="text-white fw-bold fs-4">Sin stock</span>
                    </div>
                  )}
                  <div className="card-img-top">
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      style={{ width: '100%', aspectRatio: '1/1', objectFit: 'contain' }}
                    />
                  </div>
                  <div className="card-body p-0 mt-3 text-center">
                    <div className="product-title">{prod.nombre}</div>
                    <div className="product-price">${prod.precio}</div>
                    <div className="small text-muted">
                      {inStock ? `Stock: ${stock}` : 'Sin stock'}
                    </div>
                    <button
                      className={`btn w-100 mt-2 ${inStock ? 'btn-add-cart' : 'btn-secondary'}`}
                      onClick={() => handleAddToCart(prod)}
                      disabled={!inStock}
                    >
                      {inStock ? 'Agregar al carrito' : 'Sin stock'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <>
      <Header />
      <main className="main">
        {/* Hero banner */}
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