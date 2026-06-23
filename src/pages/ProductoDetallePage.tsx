'use client';

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storage, STORAGE_KEYS } from '@/services/localStorageService';
import { Producto } from '@/interfaces';
import ProductoDetalle from '@/components/productos/ProductoDetalle';

export default function ProductoDetallePage() {
  // Obtener el ID de la URL
  const { id } = useParams<{ id: string }>(); //useParams para obtener el id del producto de la url, que es dinamica
  const navigate = useNavigate();
  // Estado del producto
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Efecto para cargar el producto al montar el componente
   * Valida que el ID sea numérico y exista en localStorage
   */
  useEffect(() => {
    const numericId = Number(id);
    // Si el ID no es numérico, redirigir a productos
    if (isNaN(numericId)) {
      navigate('/productos');
      return;
    }
    // Buscar el producto en localStorage
    const item = storage.getItemById<Producto>(STORAGE_KEYS.PRODUCTOS, numericId);
    if (item) {
      setProducto(item);
    } else {
      // Si no se encuentra, redirigir a productos
      navigate('/productos');
    }
    setLoading(false);
  }, [id, navigate]);

  /**
   * Redirige a la página de edición del producto
   */
  const handleEdit = () => {
    if (producto) navigate(`/productos/${producto.id}/editar`);
  };

  /**
   * Elimina el producto (con confirmación)
   * Redirige al listado de productos después de eliminar
   */
  const handleDelete = () => {
    if (producto && confirm('¿Eliminar este producto?')) {
      storage.deleteItem<Producto>(STORAGE_KEYS.PRODUCTOS, producto.id);
      navigate('/productos');
    }
  };

  /**
   * Vuelve al listado de productos
   */
  const handleBack = () => navigate('/productos');

  // Mostrar loading mientras se carga el producto
  if (loading) {
    return <div className="text-center py-5">Cargando...</div>;
  }

  // Si no hay producto, mostrar mensaje de error
  if (!producto) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">Producto no encontrado</p>
        <button className="btn btn-primary" onClick={handleBack}>Volver a productos</button>
      </div>
    );
  }

  // Renderizar el componente de detalle
  return (
    <ProductoDetalle
      producto={producto}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBack={handleBack}
    />
  );
}