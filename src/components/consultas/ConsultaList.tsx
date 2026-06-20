/**
 * CONSULTA LIST - Listado de consultas
 * 
 * @component
 * @param props.consultas - Lista de consultas
 * @param props.onCambiarEstado - Función para cambiar estado
 * @param props.onDelete - Función para eliminar
 */

'use client';

import { Consulta } from '@/interfaces';

interface ConsultaListProps {
  consultas: Consulta[];
  onCambiarEstado: (id: number, nuevoEstado: 'leida' | 'respondida') => void;
  onDelete: (id: number) => void;
}

export default function ConsultaList({ consultas, onCambiarEstado, onDelete }: ConsultaListProps) {
  if (consultas.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <i className="bi bi-inbox fs-1 d-block mb-3"></i>
        <p>No hay consultas que coincidan con el filtro</p>
      </div>
    );
  }

  /**
   * Obtiene la clase CSS según el estado
   */
  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      no_leida: 'bg-danger text-white',
      leida: 'bg-warning text-dark',
      respondida: 'bg-success text-white',
    };
    return colors[estado] || 'bg-secondary text-white';
  };

  /**
   * Obtiene el texto legible del estado
   */
  const getEstadoTexto = (estado: string) => {
    const textos: Record<string, string> = {
      no_leida: 'No leída',
      leida: 'Leída',
      respondida: 'Respondida',
    };
    return textos[estado] || estado;
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Motivo</th>
                <th>Fecha / Hora</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {consultas.map((consulta) => (
                <tr key={consulta.id}>
                  <td>{consulta.nombre}</td>
                  <td>{consulta.apellido}</td>
                  <td>{consulta.email}</td>
                  <td style={{ maxWidth: 150 }} className="text-truncate">
                    {consulta.motivo}
                  </td>
                  <td>
                    {consulta.fecha}
                    <br />
                    <small className="text-muted">{consulta.hora}</small>
                  </td>
                  <td>
                    <span className={`badge ${getEstadoColor(consulta.estado)}`}>
                      {getEstadoTexto(consulta.estado)}
                    </span>
                  </td>
                  <td className="text-end">
                    {consulta.estado === 'no_leida' && (
                      <button
                        onClick={() => onCambiarEstado(consulta.id, 'leida')}
                        className="btn btn-sm btn-warning me-1"
                        title="Marcar como leída"
                      >
                        <i className="bi bi-envelope-open"></i>
                      </button>
                    )}
                    {consulta.estado === 'leida' && (
                      <button
                        onClick={() => onCambiarEstado(consulta.id, 'respondida')}
                        className="btn btn-sm btn-success me-1"
                        title="Marcar como respondida"
                      >
                        <i className="bi bi-check2-circle"></i>
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(consulta.id)}
                      className="btn btn-sm btn-outline-danger"
                      title="Eliminar consulta"
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