/**
 * PRODUCTO FORM - Formulario de productos
 * 
 * @component
 * @param props.producto - Producto a editar (opcional)
 * @param props.onSave - Función al guardar
 * @param props.onCancel - Función al cancelar
 */

'use client';

import { FormEvent, useState, useEffect } from 'react';
import { Producto } from '@/interfaces';

interface ProductoFormProps {
  producto?: Producto;
  onSave: (producto: Omit<Producto, 'id'>) => void;
  onCancel: () => void;
}

export default function ProductoForm({ producto, onSave, onCancel }: ProductoFormProps) {
  // Estado del formulario
  const [formData, setFormData] = useState<Omit<Producto, 'id'>>({
    nombre: '',
    categoria: '',
    precio: 0,
    imagen: '',
    descripcion: '',
    stock: 0,
  });
  // Estado para vista previa de la imagen
  const [imagePreview, setImagePreview] = useState<string>('');

  /**
   * Efecto para cargar los datos del producto cuando se edita
   */
  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: producto.precio,
        imagen: producto.imagen,
        descripcion: producto.descripcion || '',
        stock: producto.stock || 0,
      });
      setImagePreview(producto.imagen);
    }
  }, [producto]);

  /**
   * Maneja la carga de imágenes
   * Convierte la imagen a base64 para almacenamiento en localStorage
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      setFormData({ ...formData, imagen: base64 });
    };
    reader.readAsDataURL(file);
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        {/* Campo: Nombre */}
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

        {/* Campo: Categoría */}
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

        {/* Campo: Precio */}
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

        {/* Campo: Stock */}
        <div className="col-12 col-md-6 mb-3">
          <label className="form-label fw-semibold">Stock</label>
          <input
            type="number"
            className="form-control"
            placeholder="0"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            required
            min="0"
          />
        </div>

        {/* Campo: Imagen (File input) */}
        <div className="col-12 mb-3">
          <label className="form-label fw-semibold">Imagen del producto</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />

          {/* Vista previa de la imagen */}
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Vista previa" style={{ maxWidth: '150px', maxHeight: '150px' }} />
            </div>
          )}
        </div>
      
        {/* Campo: Descripción */}
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

      {/* Botones de acción */}
      <div className="d-flex gap-2">
        <button type="submit" className="btn" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
          <i className="bi bi-save me-1"></i> Guardar
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}