// src/pages/CarritoPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getCollection, addDocument, updateDocument } from '@/services/firestoreService';
import { Producto, Pedido } from '@/interfaces';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

interface CartItem {
  id: string;
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
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar productos desde Firestore para verificar stock
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getCollection<Producto>('productos');
        setProductos(data);
      } catch (err) {
        console.error('Error al cargar productos para stock');
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    loadCart();
    window.addEventListener('storage', loadCart);
    return () => window.removeEventListener('storage', loadCart);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      setName(user.nombre);
      setEmail(user.email);
    }
  }, [isAuthenticated, user]);

  const loadCart = () => {
    const data = JSON.parse(localStorage.getItem('frenesiCarrito') || '[]');
    setCart(data);
    const sum = data.reduce((acc: number, item: CartItem) => acc + item.precio * item.cantidad, 0);
    setTotal(sum);
  };

  const getProductStock = (id: string): number => {
    const producto = productos.find(p => p.id === id);
    return producto?.stock !== undefined ? producto.stock : 0;
  };

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    const stockDisponible = getProductStock(id);
    if (newQty > stockDisponible) {
      alert(`Solo hay ${stockDisponible} unidades disponibles.`);
      return;
    }
    const updated = cart.map(item =>
      item.id === id ? { ...item, cantidad: newQty } : item
    );
    localStorage.setItem('frenesiCarrito', JSON.stringify(updated));
    setCart(updated);
    const sum = updated.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    setTotal(sum);
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (id: string) => {
    const filtered = cart.filter(item => item.id !== id);
    localStorage.setItem('frenesiCarrito', JSON.stringify(filtered));
    setCart(filtered);
    const sum = filtered.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    setTotal(sum);
    window.dispatchEvent(new Event('storage'));
  };

  // Validaciones (igual que antes)
  const validateName = (value: string): string => {
    if (!value.trim()) return 'El nombre es obligatorio.';
    if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.';
    if (value.trim().length > 80) return 'El nombre no puede tener más de 80 caracteres.';
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) {
      return 'El nombre solo puede contener letras y espacios.';
    }
    return '';
  };

  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'El correo electrónico es obligatorio.';
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value.trim())) {
      return 'Ingresa un correo válido (ejemplo: usuario@gmail.com).';
    }
    const parts = value.trim().split('@');
    if (parts.length === 2) {
      if (/^\d+$/.test(parts[0])) return 'El nombre del correo no puede ser solo números.';
      if (/\d/.test(parts[1])) return 'El dominio del correo no puede contener números después del @.';
    }
    return '';
  };

  const validateDireccion = (value: string): string => {
    if (!value.trim()) return 'La dirección es obligatoria.';
    if (value.trim().length < 5) return 'La dirección debe tener al menos 5 caracteres.';
    if (!/[a-zA-Z]/.test(value.trim())) return 'La dirección debe contener al menos una palabra (letras).';
    if (!/\d/.test(value.trim())) return 'La dirección debe contener al menos un número (ej: Calle 123).';
    return '';
  };

  const validateTelefono = (value: string): string => {
    if (!value.trim()) return 'El teléfono es obligatorio.';
    const cleanValue = value.trim().replace(/[\s-]/g, '');
    const phoneRegex = /^\+569\d{8}$/;
    if (!phoneRegex.test(cleanValue)) {
      return 'Formato inválido. Debe ser +569 seguido de 8 dígitos (ej: +56912345678).';
    }
    return '';
  };

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    const nameError = validateName(name);
    if (nameError) newErrors.name = nameError;
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    const direccionError = validateDireccion(direccion);
    if (direccionError) newErrors.direccion = direccionError;
    const telefonoError = validateTelefono(telefono);
    if (telefonoError) newErrors.telefono = telefonoError;
    return newErrors;
  };

  const handleNameChange = (value: string) => {
    setName(value);
    const error = validateName(value);
    setErrors(prev => error ? { ...prev, name: error } : { ...prev, name: undefined });
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const error = validateEmail(value);
    setErrors(prev => error ? { ...prev, email: error } : { ...prev, email: undefined });
  };

  const handleDireccionChange = (value: string) => {
    setDireccion(value);
    const error = validateDireccion(value);
    setErrors(prev => error ? { ...prev, direccion: error } : { ...prev, direccion: undefined });
  };

  const handleTelefonoChange = (value: string) => {
    setTelefono(value);
    const error = validateTelefono(value);
    setErrors(prev => error ? { ...prev, telefono: error } : { ...prev, telefono: undefined });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage('');
      return;
    }

    if (cart.length === 0) {
      setMessage('El carrito está vacío.');
      return;
    }

    setLoading(true);
    try {
      // Verificar stock actualizado
      const productosActualizados = await getCollection<Producto>('productos');
      setProductos(productosActualizados);
      
      // Verificar cada item
      for (const item of cart) {
        const prod = productosActualizados.find(p => p.id === item.id);
        if (!prod) {
          setMessage(`El producto "${item.nombre}" ya no está disponible.`);
          setLoading(false);
          return;
        }
        const stock = prod.stock !== undefined ? prod.stock : 0;
        if (stock < item.cantidad) {
          setMessage(`No hay suficiente stock de "${item.nombre}". Disponible: ${stock}`);
          setLoading(false);
          return;
        }
      }

      // Descontar stock
      for (const item of cart) {
        const prod = productosActualizados.find(p => p.id === item.id);
        if (prod) {
          const nuevoStock = (prod.stock || 0) - item.cantidad;
          await updateDocument('productos', item.id, { stock: nuevoStock });
        }
      }

      // Crear pedido en Firestore
      const pedido: Omit<Pedido, 'id'> = {
        cliente: name.trim(),
        email: email.trim(),
        direccion: direccion.trim(),
        telefono: telefono.trim(),
        fecha: new Date().toLocaleDateString('es-CL'),
        productos: cart.map(item => ({
          id: item.id,
          cantidad: item.cantidad,
          precio: item.precio
        })),
        total: total,
        estado: 'pendiente'
      };

      await addDocument<Pedido>('pedidos', pedido);

      // Vaciar carrito
      localStorage.setItem('frenesiCarrito', JSON.stringify([]));
      setCart([]);
      setTotal(0);
      window.dispatchEvent(new Event('storage'));

      setMessage('¡Gracias por tu pedido! Pronto nos pondremos en contacto.');
      setErrors({});
      if (!isAuthenticated) {
        setName('');
        setEmail('');
        setDireccion('');
        setTelefono('');
      }
    } catch (err) {
      console.error(err);
      setMessage('Ocurrió un error al procesar el pedido.');
    } finally {
      setLoading(false);
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
                  cart.map(item => {
                    const stockDisponible = getProductStock(item.id);
                    return (
                      <tr key={item.id}>
                        <td>{item.nombre}</td>
                        <td>${item.precio}</td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            max={stockDisponible > 0 ? stockDisponible : 1}
                            value={item.cantidad}
                            className="form-control form-control-sm"
                            style={{ width: '80px' }}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          />
                          <small className="text-muted d-block">
                            Stock disponible: {stockDisponible}
                          </small>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item.id)}>
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })
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
              {isAuthenticated && user && (
                <div className="alert alert-info mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Estás realizando el pedido como <strong>{user.nombre}</strong> ({user.email}).
                </div>
              )}

              <form onSubmit={handleCheckout} noValidate>
                <div className="mb-3">
                  <label htmlFor="checkoutName" className="form-label">Nombre completo <span className="text-danger">*</span></label>
                  <input
                    id="checkoutName"
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Ej: Juan Pérez"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    maxLength={80}
                    disabled={isAuthenticated && !!user}
                  />
                  {errors.name && <div className="form-error">{errors.name}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="checkoutEmail" className="form-label">Correo electrónico <span className="text-danger">*</span></label>
                  <input
                    id="checkoutEmail"
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Ej: usuario@gmail.com"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    disabled={isAuthenticated && !!user}
                  />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="checkoutDireccion" className="form-label">Dirección <span className="text-danger">*</span></label>
                  <input
                    id="checkoutDireccion"
                    type="text"
                    className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
                    placeholder="Ej: Av. Providencia 123, Depto 4"
                    value={direccion}
                    onChange={(e) => handleDireccionChange(e.target.value)}
                  />
                  {errors.direccion && <div className="form-error">{errors.direccion}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="checkoutTelefono" className="form-label">Teléfono <span className="text-danger">*</span></label>
                  <input
                    id="checkoutTelefono"
                    type="tel"
                    className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                    placeholder="+569 1234 5678"
                    value={telefono}
                    onChange={(e) => handleTelefonoChange(e.target.value)}
                  />
                  {errors.telefono && <div className="form-error">{errors.telefono}</div>}
                </div>

                <button type="submit" className="btn btn-add-cart w-100" disabled={loading}>
                  {loading ? 'Procesando...' : 'Realizar pedido'}
                </button>
              </form>

              {message && <div className="form-message mt-3">{message}</div>}
            </section>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}