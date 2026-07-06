// src/pages/ProductosPage.tsx
// Gestión de productos con Firestore.
// Los IDs se mantienen como number.

'use client';

import { useState } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { Producto } from '@/interfaces';
import SearchBar from '@/components/common/SearchBar';
import ProductoForm from '@/components/productos/ProductForm';
import ProductoList from '@/components/productos/ProductList';

export default function ProductosPage() {
  const { items: productos, loading, create, update, remove } = useFirestore<Producto>('productos');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);

  // Filtro en tiempo real por nombre o categoría
  const filteredProductos = productos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (producto: Omit<Producto, 'id'>) => {
    if (editingProduct) {
      await update(editingProduct.id, producto);
      setEditingProduct(null);
    } else {
      await create(producto);
    }
    setShowForm(false);
  };

  const handleEdit = (producto: Producto) => {
    setEditingProduct(producto);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar este producto?')) {
      await remove(id);
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