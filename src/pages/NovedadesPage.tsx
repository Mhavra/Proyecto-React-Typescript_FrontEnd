// src/pages/NovedadesPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { getCollection } from '@/services/firestoreService';
import { Producto } from '@/interfaces';

export default function NovedadesPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';

  const [allProducts, setAllProducts] = useState<Producto[]>([]);
  const [filtered, setFiltered] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const prods = await getCollection<Producto>('productos');
        setAllProducts(prods);
        setFiltered(prods);
      } catch (err) {
        setError('Error al cargar productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialSearch) {
      handleSearch(initialSearch);
    }
  }, [initialSearch]);

  const handleSearch = (term: string) => {
    const normalized = term
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

    if (!normalized) {
      setFiltered(allProducts);
      return;
    }

    const filtered = allProducts.filter(p =>
      p.nombre
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .includes(normalized) ||
      (p.categoria &&
        p.categoria
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes(normalized))
    );
    setFiltered(filtered);
  };

  const getStock = (prod: Producto): number => prod.stock !== undefined ? prod.stock : 0;

  if (loading) return <div className="text-center py-5">Cargando productos...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <Header />
      <main className="main">
        <section className="container my-5 text-center">
          <h1>Novedades</h1>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  id="searchInput"
                  className="form-control form-control-lg"
                  placeholder="Buscar productos por nombre o categoría..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="container my-5">
          <div className="row g-4">
            {filtered.map(prod => {
              const stock = getStock(prod);
              const inStock = stock > 0;
              return (
                <div key={prod.id} className="col-6 col-md-3 mb-4">
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
                      <div className="product-category small text-muted">{prod.categoria || ''}</div>
                      <div className="product-price">${prod.precio}</div>
                      <div className="small text-muted">{inStock ? `Stock: ${stock}` : 'Sin stock'}</div>
                      <button
                        className={`btn w-100 mt-2 ${inStock ? 'btn-add-cart' : 'btn-secondary'}`}
                        onClick={() => {
                          if (!inStock) {
                            alert('No hay stock disponible de este producto.');
                            return;
                          }
                          const cart = JSON.parse(localStorage.getItem('frenesiCarrito') || '[]');
                          const existing = cart.find((item: any) => item.id === prod.id);
                          if (existing) {
                            if (existing.cantidad >= stock) {
                              alert(`Solo hay ${stock} unidades disponibles.`);
                              return;
                            }
                            existing.cantidad += 1;
                          } else {
                            cart.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: 1 });
                          }
                          localStorage.setItem('frenesiCarrito', JSON.stringify(cart));
                          window.dispatchEvent(new Event('storage'));
                        }}
                        disabled={!inStock}
                      >
                        {inStock ? 'Agregar al carrito' : 'Sin stock'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-12">
                <p className="text-center">No hay productos que coincidan con la búsqueda.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}