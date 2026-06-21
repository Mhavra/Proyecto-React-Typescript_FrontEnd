'use client';

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storage, STORAGE_KEYS } from '@/services/localStorageService';
import { Producto } from '@/interfaces';
import ProductoDetalle from '@/components/productos/ProductoDetalle';

export default function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      navigate('/productos');
      return;
    }
    const item = storage.getItemById<Producto>(STORAGE_KEYS.PRODUCTOS, numericId);
    if (item) {
      setProducto(item);
    } else {
      navigate('/productos');
    }
    setLoading(false);
  }, [id, navigate]);

  const handleEdit = () => {
    if (producto) navigate(`/productos/${producto.id}/editar`);
  };

  const handleDelete = () => {
    if (producto && confirm('¿Eliminar este producto?')) {
      storage.deleteItem<Producto>(STORAGE_KEYS.PRODUCTOS, producto.id);
      navigate('/productos');
    }
  };

  const handleBack = () => navigate('/productos');

  if (loading) {
    return <div className="text-center py-5">Cargando...</div>;
  }

  if (!producto) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">Producto no encontrado</p>
        <button className="btn btn-primary" onClick={handleBack}>Volver a productos</button>
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