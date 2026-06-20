/**
 * PRODUCTO DETALLE PAGE - Página de detalle de producto
 * 
 * Muestra la información detallada de un producto específico.
 * 
 * @page /productos/[id]
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { storage, STORAGE_KEYS } from '@/services/localStorageService';
import { Producto } from '@/interfaces';
import ProductoDetalle from '@/components/productos/ProductoDetalle';

export default function ProductoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Carga el producto usando el ID de la URL
   */
  useEffect(() => {
    const idParam = params.id;
    const id = typeof idParam === 'string' ? Number(idParam) : NaN;

    if (Number.isNaN(id)) {
      router.push('/productos');
      return;
    }

    const item = storage.getItemById<Producto>(STORAGE_KEYS.PRODUCTOS, id);
    if (item) {
      setProducto(item);
    } else {
      router.push('/productos');
    }
    setLoading(false);
  }, [params.id, router]);

  /**
   * Maneja la edición del producto
   */
  const handleEdit = () => {
    if (producto) {
      router.push(`/productos/${producto.id}/editar`);
    }
  };

  /**
   * Maneja la eliminación del producto
   */
  const handleDelete = () => {
    if (producto && confirm('¿Eliminar este producto?')) {
      storage.deleteItem<Producto>(STORAGE_KEYS.PRODUCTOS, producto.id);
      router.push('/productos');
    }
  };

  /**
   * Vuelve a la lista de productos
   */
  const handleBack = () => {
    router.push('/productos');
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">Producto no encontrado</p>
        <button className="btn btn-primary" onClick={handleBack}>
          Volver a productos
        </button>
      </div>
    );
  }

  return (
    <ProductoDetalle
      producto={producto}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBack={handleBack}
    />
  );
}