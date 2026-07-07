// src/pages/ProductosPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { getCollection, addDocument, updateDocument, deleteDocument } from '@/services/firestoreService';
import { Producto } from '@/interfaces';
import SearchBar from '@/components/common/SearchBar';
import ProductoForm from '@/components/productos/ProductForm';
import ProductoList from '@/components/productos/ProductList';

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await getCollection<Producto>('productos');
      setProductos(data);
      setError('');
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (producto: Omit<Producto, 'id'>) => {
    try {
      if (editingProduct) {
        await updateDocument('productos', editingProduct.id, producto);
      } else {
        await addDocument('productos', producto);
      }
      await cargarProductos();
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      setError('Error al guardar producto');
    }
  };

  const handleEdit = (producto: Producto) => {
    setEditingProduct(producto);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este producto?')) {
      try {
        await deleteDocument('productos', id);
        await cargarProductos();
      } catch (err) {
        setError('Error al eliminar producto');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (loading) return <div className="text-center py-5">Cargando productos...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Productos</h4>
        <button
          className="btn" style={{ backgroundColor: '#6f42c1', color: 'white' }}
          onClick={() => setShowForm(true)}
        >
          <i className="bi bi-plus-circle me-1"></i>
          Nuevo Producto
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <SearchBar
        placeholder="Buscar productos por nombre o categoría..."
        value={search}
        onChange={setSearch}
      />

      {showForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h5>
            <ProductoForm
              producto={editingProduct || undefined}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      <ProductoList
        productos={filteredProductos}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}