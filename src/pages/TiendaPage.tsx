'use client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { getCollection } from '@/services/firestoreService';
import { Producto } from '@/interfaces';

export default function TiendaPage() {
  const [vintageProducts, setVintageProducts] = useState<Producto[]>([]);
  const [nuevosProducts, setNuevosProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const all = await getCollection<Producto>('productos');
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
        setError('');
      } catch (err) {
        setError('Error al cargar productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (prod: Producto) => {
    const stockDisponible = prod.stock !== undefined ? prod.stock : 0;
    if (stockDisponible <= 0) {
      alert('No hay stock disponible de este producto.');
      return;
    }
    const cart = JSON.parse(localStorage.getItem('frenesiCarrito') || '[]');
    const existing = cart.find((item: any) => item.id === prod.id);
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

  const getStock = (prod: Producto): number => prod.stock !== undefined ? prod.stock : 0;

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
                  {!inStock && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center" style={{ zIndex: 10, borderRadius: '8px' }}>
                      <span className="text-white fw-bold fs-4">Sin stock</span>
                    </div>
                  )}
                  <div className="card-img-top">
                    <img src={prod.imagen} alt={prod.nombre} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'contain' }} />
                  </div>
                  <div className="card-body p-0 mt-3 text-center">
                    <div className="product-title">{prod.nombre}</div>
                    <div className="product-price">${prod.precio}</div>
                    <div className="small text-muted">{inStock ? `Stock: ${stock}` : 'Sin stock'}</div>
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

  if (loading) {
    return (
      <>
        <Header />
        <main className="main">
          <div className="text-center py-5">Cargando tienda...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="main">
          <div className="alert alert-danger">{error}</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main">
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

        {renderProductGrid(vintageProducts, 'Vintage', 'Revive tus recuerdos')}
        {renderProductGrid(nuevosProducts, 'Nuevos Productos', 'Productos recién agregados')}

        <div className="container text-center mt-0 mb-4">
          <Link to="/novedades" className="btn btn-ver-mas px-5 py-3">
            Ver más productos
          </Link>
        </div>

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