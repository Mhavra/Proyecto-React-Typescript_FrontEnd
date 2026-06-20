/**
 * PRODUCTO FORM - Formulario de productos
 * 
 * @component
 * @param props.producto - Producto a editar (opcional)
 * @param props.onSave - Función al guardar
 * @param props.onCancel - Función al cancelar
 */

'use client';

import { useState, useEffect } from 'react';
import { Producto } from '@/interfaces';

interface ProductoFormProps {
  producto?: Producto;
  onSave: (producto: Omit<Producto, 'id'>) => void;
  onCancel: () => void;
}

export default function ProductoForm({ producto, onSave, onCancel }: ProductoFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    precio: 0,
    imagen: '',
    descripcion: '',
    cantidad: 0,
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: producto.precio,
        imagen: producto.imagen,
        descripcion: producto.descripcion,
        cantidad: producto.cantidad,
      });
    }
  }, [producto]);

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-12 col-md-6 mb-3">
          <label className="form-label fw-semibold">Nombre</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del producto"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
        </div>
        <div className="col-12 col-md-6 mb-3">
          <label className="form-label fw-semibold">Categoría</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ej: Vintage"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            required
          />
        </div>
        <div className="col-12 col-md-6 mb-3">
          <label className="form-label fw-semibold">Precio (CLP)</label>
          <input
            type="number"
            className="form-control"
            placeholder="0"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
            required
            min="0"
          />
        </div>
        <div className="col-12 col-md-6 mb-3">
          <label className="form-label fw-semibold">Stock</label>
          <input
            type="number"
            className="form-control"
            placeholder="0"
            value={formData.cantidad}
            onChange={(e) => setFormData({ ...formData, cantidad: Number(e.target.value) })}
            required
            min="0"
          />
        </div>
        <div className="col-12 mb-3">
          <label className="form-label fw-semibold">URL de imagen</label>
          <input
            type="text"
            className="form-control"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={formData.imagen}
            onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
          />
        </div>
        <div className="col-12 mb-3">
          <label className="form-label fw-semibold">Descripción</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="Descripción del producto..."
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          />
        </div>
      </div>
      <div className="d-flex gap-2">
        <button type="submit" className="btn" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
          <i className="bi bi-save me-1"></i>
          Guardar
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}