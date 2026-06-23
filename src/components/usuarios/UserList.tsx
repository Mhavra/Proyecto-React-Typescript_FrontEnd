/**
 * USUARIO LIST - Listado de usuarios
 * 
 * @component
 */

'use client';

import { Usuario } from '@/interfaces';

interface UsuarioListProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: number) => void;
}

export default function UsuarioList({ usuarios, onEdit, onDelete }: UsuarioListProps) {
  // Si no hay usuarios, mostrar mensaje
  if (usuarios.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <i className="bi bi-inbox fs-1 d-block mb-3"></i>
        <p>No hay usuarios que coincidan con la búsqueda</p>
      </div>
    );
  }

  /**
   * Obtiene la clase CSS para el badge según el rol
   */
  const getRolColor = (rol: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-danger text-white',
      cliente: 'bg-success text-white',
    };
    return colors[rol] || 'bg-secondary text-white';
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    <span className="fw-semibold">{usuario.nombre}</span>
                  </td>
                  <td>{usuario.email}</td>
                  <td>
                    <span className={`badge ${getRolColor(usuario.rol)}`}>
                      {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
                    </span>
                  </td>
                  <td className="text-end">
                    {/* Botón de editar */}
                    <button
                      onClick={() => onEdit(usuario)}
                      className="btn btn-sm btn-outline-warning me-1"
                      title="Editar"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    {/* Botón de eliminar */}
                    <button
                      onClick={() => onDelete(usuario.id)}
                      className="btn btn-sm btn-outline-danger"
                      title="Eliminar"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}