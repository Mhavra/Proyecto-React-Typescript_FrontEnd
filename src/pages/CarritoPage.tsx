'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { storage, STORAGE_KEYS } from '@/services/localStorageService';
import { Pedido } from '@/interfaces';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

interface CartItem {
  id: string | number;
  nombre: string;
  precio: number;
  cantidad: number;
}

export default function CarritoPage() {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
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

  // Función común para crear pedido
  const crearPedido = (datos: { cliente: string; email?: string; direccion?: string; telefono?: string }) => {
    if (cart.length === 0) {
      setMessage('El carrito está vacío. Agrega productos antes de finalizar la compra.');
      return;
    }

    const pedido: Omit<Pedido, 'id'> = {
      cliente: datos.cliente,
      email: datos.email || '',
      direccion: datos.direccion || '',
      telefono: datos.telefono || '',
      fecha: new Date().toLocaleDateString('es-CL'),
      productos: cart.map(item => ({
        id: item.id,
        cantidad: item.cantidad,
        precio: item.precio
      })),
      total: total,
      estado: 'pendiente'
    };

    console.log('📦 Pedido a guardar:', pedido); // Para depuración

    // Guardar en localStorage
    storage.addItem<Pedido>(STORAGE_KEYS.PEDIDOS, pedido);

    // Vaciar carrito
    localStorage.setItem('frenesiCarrito', JSON.stringify([]));
    setCart([]);
    setTotal(0);
    window.dispatchEvent(new Event('storage'));

    setMessage('¡Gracias por tu pedido! Pronto nos pondremos en contacto.');
    setErrors({});
    // Limpiar formulario si está visible
    setName('');
    setEmail('');
    setDireccion('');
    setTelefono('');
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (isAuthenticated && user) {
      // Usuario logueado: usar sus datos (dirección y teléfono pueden venir del perfil o dejarse vacíos)
      crearPedido({
        cliente: user.nombre,
        email: user.email,
        direccion: direccion.trim() || '', // si queremos permitir editarlos
        telefono: telefono.trim() || ''
      });
    } else {
      // Usuario no logueado: validar formulario
      const errs: Record<string, string> = {};
      if (!name.trim() || name.trim().length < 3) errs.name = 'Ingresa al menos 3 caracteres para el nombre.';
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Ingresa un correo electrónico válido.';
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        setMessage('');
        return;
      }
      crearPedido({
        cliente: name.trim(),
        email: email.trim(),
        direccion: direccion.trim(),
        telefono: telefono.trim()
      });
    }
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
              <tbody>
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
            <div className="fs-5">${total}</div>
          </div>

          {cart.length > 0 && (
            <section className="checkout-form p-4 rounded-3 shadow-sm bg-white">
              <h2 className="mb-3">Finalizar compra</h2>

              {isAuthenticated && user ? (
                // Usuario logueado: mostramos sus datos y permitimos editar dirección y teléfono si se desea
                <div>
                  <p className="text-muted">
                    Estás realizando el pedido como <strong>{user.nombre}</strong> ({user.email}).
                  </p>
                  <div className="mb-3">
                    <label className="form-label">Dirección (opcional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Calle, número, comuna"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Teléfono (opcional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="+56 9 ..."
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-add-cart w-100" onClick={handleCheckout}>
                    Realizar pedido
                  </button>
                </div>
              ) : (
                // Usuario no logueado: formulario completo
                <form onSubmit={handleCheckout}>
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
                  <div className="mb-3">
                    <label htmlFor="checkoutDireccion" className="form-label">Dirección</label>
                    <input
                      id="checkoutDireccion"
                      type="text"
                      className="form-control"
                      placeholder="Calle, número, comuna"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="checkoutTelefono" className="form-label">Teléfono</label>
                    <input
                      id="checkoutTelefono"
                      type="text"
                      className="form-control"
                      placeholder="+56 9 ..."
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-add-cart w-100">Enviar pedido</button>
                </form>
              )}

              {message && <div className="form-message mt-3">{message}</div>}
            </section>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}