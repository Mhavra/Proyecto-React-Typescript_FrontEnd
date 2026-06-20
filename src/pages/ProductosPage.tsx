/**
 * PRODUCTOS PAGE - Gestión de productos
 * 
 * Funcionalidades:
 * - Listado de productos con búsqueda
 * - Crear, editar y eliminar productos
 * 
 * @page /productos
 */

'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { storage, STORAGE_KEYS } from '@/services/localStorageService';
import { Producto } from '@/interfaces';
import SearchBar from '@/components/common/SearchBar';
import ProductoForm from '@/components/productos/ProductoForm';
import ProductoList from '@/components/productos/ProductoList';

export default function ProductosPage() {
  const [productos, setProductos] = useLocalStorage<Producto[]>(STORAGE_KEYS.PRODUCTOS, []);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);

  /**
   * Filtra productos por nombre o categoría
   */
  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria.toLowerCase().includes(search.toLowerCase())
  );

  /**
   * Maneja la creación/edición de un producto
   */
  const handleSave = (producto: Omit<Producto, 'id'>) => {
    if (editingProduct) {
      // Editar
      storage.updateItem<Producto>(STORAGE_KEYS.PRODUCTOS, editingProduct.id, producto);
      setProductos(storage.get<Producto>(STORAGE_KEYS.PRODUCTOS));
    } else {
      // Crear
      storage.addItem<Producto>(STORAGE_KEYS.PRODUCTOS, producto);
      setProductos(storage.get<Producto>(STORAGE_KEYS.PRODUCTOS));
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  /**
   * Maneja la edición de un producto
   */
  const handleEdit = (producto: Producto) => {
    setEditingProduct(producto);
    setShowForm(true);
  };

  /**
   * Maneja la eliminación de un producto
   */
  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este producto?')) {
      storage.deleteItem<Producto>(STORAGE_KEYS.PRODUCTOS, id);
      setProductos(storage.get<Producto>(STORAGE_KEYS.PRODUCTOS));
    }
  };

  /**
   * Cancela el formulario
   */
  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

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