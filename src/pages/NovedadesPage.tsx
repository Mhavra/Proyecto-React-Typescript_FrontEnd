'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { storage, STORAGE_KEYS } from '@/services/localStorageService';
import { Producto } from '@/interfaces';

export default function NovedadesPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [allProducts, setAllProducts] = useState<Producto[]>([]);
  const [filtered, setFiltered] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  useEffect(() => {
    const prods = storage.get<Producto>(STORAGE_KEYS.PRODUCTOS);
    setAllProducts(prods);
    setFiltered(prods);
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
          <div className="row g-4" id="allProductsContainer">
            {filtered.map(prod => (
              <div key={prod.id} className="col-6 col-md-3 mb-4">
                <div className="card border-0 h-100">
                  <div className="card-img-top">
                    <img src={prod.imagen} alt={prod.nombre} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'contain' }} />
                  </div>
                  <div className="card-body p-0 mt-3 text-center">
                    <div className="product-title">{prod.nombre}</div>
                    <div className="product-category small text-muted">{prod.categoria || ''}</div>
                    <div className="product-price">${prod.precio}</div>
                    <button
                      className="btn btn-add-cart w-100 mt-2"
                      onClick={() => {
                        const cart = JSON.parse(localStorage.getItem('frenesiCarrito') || '[]');
                        const existing = cart.find((item: any) => String(item.id) === String(prod.id));
                        if (existing) {
                          existing.cantidad += 1;
                        } else {
                          cart.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: 1 });
                        }
                        localStorage.setItem('frenesiCarrito', JSON.stringify(cart));
                        window.dispatchEvent(new Event('storage'));
                      }}
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
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