'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { storage, STORAGE_KEYS } from '@/services/localStorageService';
import { Pedido, Producto } from '@/interfaces';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

interface CartItem {
  id: string | number;
  nombre: string;
  precio: number;
  cantidad: number;
}

/**
 * CARRITO PAGE - Página del carrito de compras
 * 
 * Permite:
 * - Ver productos agregados al carrito
 * - Modificar cantidades (con validación de stock)
 * - Eliminar productos
 * - Realizar pedidos (logueado o no) con verificación de stock
 * - Si está logueado: se precargan nombre y email
 * - Si no está logueado: formulario completo con validaciones
 * 
 * @page /carrito
 */
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

  /**
   * Efecto para cargar el carrito al montar el componente
   * y escuchar cambios en localStorage (otras pestañas)
   */
  useEffect(() => {
    loadCart();
    window.addEventListener('storage', loadCart);
    return () => window.removeEventListener('storage', loadCart);
  }, []);

  /**
   * Efecto para precargar datos del usuario si está logueado
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      setName(user.nombre);
      setEmail(user.email);
    }
  }, [isAuthenticated, user]);

  /**
   * Carga el carrito desde localStorage y actualiza el total
   */
  const loadCart = () => {
    const data = JSON.parse(localStorage.getItem('frenesiCarrito') || '[]');
    setCart(data);
    const sum = data.reduce((acc: number, item: CartItem) => acc + item.precio * item.cantidad, 0);
    setTotal(sum);
  };

  /**
   * Obtiene el stock de un producto de forma segura
   */
  const getProductStock = (id: string | number): number => {
    const productos = storage.get<Producto>(STORAGE_KEYS.PRODUCTOS);
    const producto = productos.find(p => String(p.id) === String(id));
    return producto?.stock !== undefined ? producto.stock : 0;
  };

  /**
   * Actualiza la cantidad de un producto en el carrito
   * Verifica que no supere el stock disponible
   * @param id - ID del producto
   * @param newQty - Nueva cantidad (mínimo 1)
   */
  const updateQuantity = (id: string | number, newQty: number) => {
    if (newQty < 1) return;
    
    // Obtener el stock del producto
    const stockDisponible = getProductStock(id);
    
    // Verificar que no supere el stock disponible
    if (newQty > stockDisponible) {
      alert(`Solo hay ${stockDisponible} unidades disponibles.`);
      return;
    }
    
    const updated = cart.map(item =>
      String(item.id) === String(id) ? { ...item, cantidad: newQty } : item
    );
    
    localStorage.setItem('frenesiCarrito', JSON.stringify(updated));
    setCart(updated);
    
    const sum = updated.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    setTotal(sum);
    window.dispatchEvent(new Event('storage'));
  };

  /**
   * Elimina un producto del carrito
   * @param id - ID del producto a eliminar
   */
  const removeItem = (id: string | number) => {
    const filtered = cart.filter(item => String(item.id) !== String(id));
    localStorage.setItem('frenesiCarrito', JSON.stringify(filtered));
    setCart(filtered);
    const sum = filtered.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    setTotal(sum);
    window.dispatchEvent(new Event('storage'));
  };

  // ============================================================
  // VALIDACIONES DEL FORMULARIO
  // ============================================================

  /**
   * 1. VALIDACIÓN DE NOMBRE
   * - Solo letras y espacios
   * - Mínimo 3 caracteres
   * - Máximo 80 caracteres
   */
  const validateName = (value: string): string => {
    if (!value.trim()) return 'El nombre es obligatorio.';
    if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.';
    if (value.trim().length > 80) return 'El nombre no puede tener más de 80 caracteres.';
    // Solo letras (incluyendo acentos) y espacios
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) {
      return 'El nombre solo puede contener letras y espacios.';
    }
    return '';
  };

  /**
   * 2. VALIDACIÓN DE EMAIL
   * - Formato: palabra@palabra.palabra
   * - No puede tener números después del @
   */
  const validateEmail = (value: string): string => {
    if (!value.trim()) return 'El correo electrónico es obligatorio.';
    
    // Expresión regular para email válido (sin +, %, ni otros símbolos especiales)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(value.trim())) {
      return 'Ingresa un correo válido (ejemplo: usuario@gmail.com).';
    }
    
    // Verificar que después del @ solo haya letras (sin números)
    const parts = value.trim().split('@');
    if (parts.length === 2) {
      const localPart = parts[0];
      const domain = parts[1];
      
      // El nombre del correo NO puede ser solo números
      if (/^\d+$/.test(localPart)) {
        return 'El nombre del correo no puede ser solo números.';
      }
      
      // El dominio no debe contener números
      if (/\d/.test(domain)) {
        return 'El dominio del correo no puede contener números después del @.';
      }
    }
    
    return '';
  };

  /**
   * 3. VALIDACIÓN DE DIRECCIÓN
   * - Debe contener al menos una palabra y un número
   * - No puede ser solo números
   * - Mínimo 5 caracteres
   */
  const validateDireccion = (value: string): string => {
    if (!value.trim()) return 'La dirección es obligatoria.';
    if (value.trim().length < 5) return 'La dirección debe tener al menos 5 caracteres.';
    
    // Verificar que tenga al menos una letra (palabra)
    if (!/[a-zA-Z]/.test(value.trim())) {
      return 'La dirección debe contener al menos una palabra (letras).';
    }
    
    // Verificar que tenga al menos un número
    if (!/\d/.test(value.trim())) {
      return 'La dirección debe contener al menos un número (ej: Calle 123).';
    }
    
    return '';
  };

  /**
   * 4. VALIDACIÓN DE TELÉFONO
   * - Formato: +569 seguido de 8 dígitos
   * - Total: 12 caracteres (+569 + 8 dígitos)
   */
  const validateTelefono = (value: string): string => {
    if (!value.trim()) return 'El teléfono es obligatorio.';
    
    // Eliminar espacios y guiones para la validación
    const cleanValue = value.trim().replace(/[\s-]/g, '');
    
    // Formato: +569XXXXXXXX (12 caracteres en total)
    const phoneRegex = /^\+569\d{8}$/;
    
    if (!phoneRegex.test(cleanValue)) {
      return 'Formato inválido. Debe ser +569 seguido de 8 dígitos (ej: +56912345678).';
    }
    
    return '';
  };

  /**
   * VALIDACIÓN COMPLETA DEL FORMULARIO
   * Ejecuta todas las validaciones y retorna un objeto con los errores
   */
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

  // ============================================================
  // MANEJADORES DE CAMBIOS CON VALIDACIÓN EN TIEMPO REAL
  // ============================================================

  /**
   * Maneja el cambio del campo nombre con validación en tiempo real
   */
  const handleNameChange = (value: string) => {
    setName(value);
    const error = validateName(value);
    if (error) {
      setErrors(prev => ({ ...prev, name: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.name;
        return newErrors;
      });
    }
  };

  /**
   * Maneja el cambio del campo email con validación en tiempo real
   */
  const handleEmailChange = (value: string) => {
    setEmail(value);
    const error = validateEmail(value);
    if (error) {
      setErrors(prev => ({ ...prev, email: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  };

  /**
   * Maneja el cambio del campo dirección con validación en tiempo real
   */
  const handleDireccionChange = (value: string) => {
    setDireccion(value);
    const error = validateDireccion(value);
    if (error) {
      setErrors(prev => ({ ...prev, direccion: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.direccion;
        return newErrors;
      });
    }
  };

  /**
   * Maneja el cambio del campo teléfono con validación en tiempo real
   */
  const handleTelefonoChange = (value: string) => {
    setTelefono(value);
    const error = validateTelefono(value);
    if (error) {
      setErrors(prev => ({ ...prev, telefono: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.telefono;
        return newErrors;
      });
    }
  };

  // ============================================================
  // FUNCIONES DE CREACIÓN DE PEDIDO Y CHECKOUT
  // ============================================================

  /**
   * Función común para crear un pedido
   * - Verifica que todos los productos tengan stock suficiente
   * - Descuenta el stock de cada producto
   * - Construye el objeto pedido con los datos del cliente
   * - Guarda en localStorage (frenesi_pedidos)
   * - Vacía el carrito
   * @param datos - Datos del cliente (nombre, email, dirección, teléfono)
   */
  const crearPedido = (datos: { cliente: string; email?: string; direccion?: string; telefono?: string }) => {
    if (cart.length === 0) {
      setMessage('El carrito está vacío. Agrega productos antes de finalizar la compra.');
      return;
    }

    // Verificar stock de todos los productos en el carrito
    const productos = storage.get<Producto>(STORAGE_KEYS.PRODUCTOS);
    
    for (const item of cart) {
      const producto = productos.find(p => String(p.id) === String(item.id));
      if (!producto) {
        setMessage(`El producto "${item.nombre}" ya no está disponible.`);
        return;
      }
      const stockDisponible = producto.stock !== undefined ? producto.stock : 0;
      if (stockDisponible < item.cantidad) {
        setMessage(`No hay suficiente stock de "${item.nombre}". Disponible: ${stockDisponible}`);
        return;
      }
    }

    // Construir el objeto pedido
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

    console.log('📦 Pedido a guardar:', pedido);

    // Descontar stock de cada producto
    for (const item of cart) {
      const productoIndex = productos.findIndex(p => String(p.id) === String(item.id));
      if (productoIndex !== -1) {
        const stockActual = productos[productoIndex].stock !== undefined ? productos[productoIndex].stock : 0;
        const nuevoStock = stockActual - item.cantidad;
        storage.updateItem<Producto>(STORAGE_KEYS.PRODUCTOS, productos[productoIndex].id, {
          stock: nuevoStock
        });
      }
    }

    // Guardar el pedido en localStorage
    storage.addItem<Pedido>(STORAGE_KEYS.PEDIDOS, pedido);

    // Vaciar carrito
    localStorage.setItem('frenesiCarrito', JSON.stringify([]));
    setCart([]);
    setTotal(0);
    window.dispatchEvent(new Event('storage'));

    setMessage('¡Gracias por tu pedido! Pronto nos pondremos en contacto.');
    setErrors({});
    // Limpiar formulario si está visible
    setName(isAuthenticated && user ? user.nombre : '');
    setEmail(isAuthenticated && user ? user.email : '');
    setDireccion('');
    setTelefono('');
  };

  /**
   * Maneja el envío del pedido
   * - SIEMPRE valida todos los campos (nombre, email, dirección, teléfono)
   * - Si está logueado: precarga nombre y email, pero dirección y teléfono son obligatorios
   * - Si no está logueado: valida todos los campos del formulario
   */
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos los campos siempre
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage('');
      return;
    }

    // Si pasa la validación, crear el pedido
    crearPedido({
      cliente: name.trim(),
      email: email.trim(),
      direccion: direccion.trim(),
      telefono: telefono.trim()
    });
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

          {/* Tabla de productos */}
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
                    // Obtener el stock del producto para mostrar
                    const stockDisponible = getProductStock(item.id);
                    
                    return (
                      <tr key={String(item.id)}>
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

          {/* Total */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <strong>Total:</strong>
            <div className="fs-5">${total}</div>
          </div>

          {/* Checkout - SIEMPRE se muestra el formulario completo */}
          {cart.length > 0 && (
            <section className="checkout-form p-4 rounded-3 shadow-sm bg-white">
              <h2 className="mb-3">Finalizar compra</h2>
              
              {isAuthenticated && user && (
                <div className="alert alert-info mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Estás realizando el pedido como <strong>{user.nombre}</strong> ({user.email}).
                  Completa los datos de dirección y teléfono para finalizar.
                </div>
              )}

              <form onSubmit={handleCheckout} noValidate>
                {/* Campo: Nombre */}
                <div className="mb-3">
                  <label htmlFor="checkoutName" className="form-label">
                    Nombre completo <span className="text-danger">*</span>
                  </label>
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
                  <small className="text-muted">Solo letras y espacios. Mínimo 3 caracteres.</small>
                </div>

                {/* Campo: Email */}
                <div className="mb-3">
                  <label htmlFor="checkoutEmail" className="form-label">
                    Correo electrónico <span className="text-danger">*</span>
                  </label>
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
                  <small className="text-muted">Formato: usuario@dominio.com (sin números en el dominio).</small>
                </div>

                {/* Campo: Dirección - SIEMPRE OBLIGATORIO */}
                <div className="mb-3">
                  <label htmlFor="checkoutDireccion" className="form-label">
                    Dirección <span className="text-danger">*</span>
                  </label>
                  <input
                    id="checkoutDireccion"
                    type="text"
                    className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
                    placeholder="Ej: Av. Providencia 123, Depto 4"
                    value={direccion}
                    onChange={(e) => handleDireccionChange(e.target.value)}
                  />
                  {errors.direccion && <div className="form-error">{errors.direccion}</div>}
                  <small className="text-muted">Debe contener palabra y número (ej: Calle 123).</small>
                </div>

                {/* Campo: Teléfono - SIEMPRE OBLIGATORIO */}
                <div className="mb-3">
                  <label htmlFor="checkoutTelefono" className="form-label">
                    Teléfono <span className="text-danger">*</span>
                  </label>
                  <input
                    id="checkoutTelefono"
                    type="tel"
                    className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                    placeholder="+569 1234 5678"
                    value={telefono}
                    onChange={(e) => handleTelefonoChange(e.target.value)}
                  />
                  {errors.telefono && <div className="form-error">{errors.telefono}</div>}
                  <small className="text-muted">Formato: +569 seguido de 8 dígitos (ej: +56912345678).</small>
                </div>

                <button type="submit" className="btn btn-add-cart w-100">
                  {isAuthenticated ? 'Realizar pedido' : 'Enviar pedido'}
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