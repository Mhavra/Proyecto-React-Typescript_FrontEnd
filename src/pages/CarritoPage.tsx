'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

interface CartItem {
  id: string | number;
  nombre: string;
  precio: number;
  cantidad: number;
}

export default function CarritoPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadCart();
    window.addEventListener('storage', loadCart);
    return () => window.removeEventListener('storage', loadCart);
  }, []);

  const loadCart = () => {
    const data = JSON.parse(localStorage.getItem('frenesiCarrito') || '[]');
    setCart(data);
    const sum = data.reduce((acc: number, item: CartItem) => acc + item.precio * item.cantidad, 0);
    setTotal(sum);
  };

  const updateQuantity = (id: string | number, newQty: number) => {
    if (newQty < 1) return;
    const updated = cart.map(item =>
      String(item.id) === String(id) ? { ...item, cantidad: newQty } : item
    );
    localStorage.setItem('frenesiCarrito', JSON.stringify(updated));
    setCart(updated);
    const sum = updated.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    setTotal(sum);
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (id: string | number) => {
    const filtered = cart.filter(item => String(item.id) !== String(id));
    localStorage.setItem('frenesiCarrito', JSON.stringify(filtered));
    setCart(filtered);
    const sum = filtered.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    setTotal(sum);
    window.dispatchEvent(new Event('storage'));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 3) errs.name = 'Ingresa al menos 3 caracteres para el nombre.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Ingresa un correo electrónico válido.';
    return errs;
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setMessage('');
      return;
    }
    if (cart.length === 0) {
      setMessage('El carrito está vacío. Agrega productos antes de finalizar la compra.');
      return;
    }
    // Simular envío de pedido
    localStorage.setItem('frenesiCarrito', JSON.stringify([]));
    setCart([]);
    setTotal(0);
    setName('');
    setEmail('');
    setMessage('Gracias por tu pedido. Pronto te contactaremos por correo.');
    setErrors({});
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <>
      <Header />
      <main className="main">
        <section className="cart-page container py-5">
          <div className="text-center mb-4">
            <h1>Carrito de compras</h1>
            <p className="hero-subtitle">Revisa tus productos y completa tu pedido</p>
          </div>
          <div className="table-responsive mb-4">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="cartTableBody">
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">Tu carrito está vacío.</td>
                  </tr>
                ) : (
                  cart.map(item => (
                    <tr key={String(item.id)}>
                      <td>{item.nombre}</td>
                      <td>${item.precio}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          className="form-control form-control-sm"
                          style={{ width: '80px' }}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        />
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <strong>Total:</strong>
            <div id="cartTotal" className="fs-5">${total}</div>
          </div>

          <section className="checkout-form p-4 rounded-3 shadow-sm bg-white">
            <h2 className="mb-3">Finalizar compra</h2>
            <form id="checkoutForm" onSubmit={handleCheckout}>
              <div className="mb-3">
                <label htmlFor="checkoutName" className="form-label">Nombre completo</label>
                <input
                  id="checkoutName"
                  type="text"
                  className="form-control"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="checkoutEmail" className="form-label">Correo electrónico</label>
                <input
                  id="checkoutEmail"
                  type="email"
                  className="form-control"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
              <button type="submit" className="btn btn-add-cart w-100">Enviar pedido</button>
              {message && <div className="form-message mt-3">{message}</div>}
            </form>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}