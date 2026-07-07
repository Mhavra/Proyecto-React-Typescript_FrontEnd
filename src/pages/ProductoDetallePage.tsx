// src/pages/ProductoDetallePage.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocument, deleteDocument } from '@/services/firestoreService';
import { Producto } from '@/interfaces';
import ProductoDetalle from '@/components/productos/ProductoDetalle';

export default function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducto = async () => {
      if (!id) {
        navigate('/productos');
        return;
      }
      try {
        const data = await getDocument<Producto>('productos', id);
        if (data) {
          setProducto(data);
        } else {
          navigate('/productos');
        }
      } catch (err) {
        setError('Error al cargar producto');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id, navigate]);

  const handleEdit = () => {
    if (producto) navigate(`/productos/${producto.id}/editar`);
  };

  const handleDelete = async () => {
    if (producto && confirm('¿Eliminar este producto?')) {
      try {
        await deleteDocument('productos', producto.id);
        navigate('/productos');
      } catch (err) {
        setError('Error al eliminar producto');
      }
    }
  };

  const handleBack = () => navigate('/productos');

  if (loading) return <div className="text-center py-5">Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!producto) return <div className="text-center py-5">Producto no encontrado</div>;

  return (
    <ProductoDetalle
      producto={producto}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBack={handleBack}
    />
  );
}