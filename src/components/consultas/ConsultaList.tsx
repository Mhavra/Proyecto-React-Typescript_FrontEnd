/**
 * CONSULTA LIST - Listado de consultas
 * 
 * @component
 * @param props.consultas - Lista de consultas
 * @param props.onCambiarEstado - Función para cambiar estado
 * @param props.onDelete - Función para eliminar
 */

'use client';

import { useState } from 'react';
import { Consulta } from '@/interfaces';

interface ConsultaListProps {
  consultas: Consulta[];
  onCambiarEstado: (id: number, nuevoEstado: 'leida' | 'respondida', respuesta?: string) => void;
  onDelete: (id: number) => void;
}

export default function ConsultaList({ consultas, onCambiarEstado, onDelete }: ConsultaListProps) {
  const [respondiendoId, setRespondiendoId] = useState<number | null>(null);
  const [respuestaTexto, setRespuestaTexto] = useState('');

  const handleResponder = (id: number) => {
    if (respondiendoId === id) {
      // Enviar respuesta
      if (respuestaTexto.trim()) {
        onCambiarEstado(id, 'respondida', respuestaTexto.trim());
        setRespondiendoId(null);
        setRespuestaTexto('');
      } else {
        alert('Escribe una respuesta antes de enviar.');
      }
    } else {
      setRespondiendoId(id);
      const consulta = consultas.find(c => c.id === id);
      setRespuestaTexto(consulta?.respuesta || '');
    }
  };

  if (consultas.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <i className="bi bi-inbox fs-1 d-block mb-3"></i>
        <p>No hay consultas que coincidan con el filtro</p>
      </div>
    );
  }

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      no_leida: 'bg-danger text-white',
      leida: 'bg-warning text-dark',
      respondida: 'bg-success text-white',
    };
    return colors[estado] || 'bg-secondary text-white';
  };

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
                    {respondiendoId === consulta.id ? (
                      <div className="d-flex flex-column gap-1">
                        <textarea
                          className="form-control form-control-sm"
                          rows={2}
                          placeholder="Escribe tu respuesta..."
                          value={respuestaTexto}
                          onChange={(e) => setRespuestaTexto(e.target.value)}
                        />
                        <div className="d-flex gap-1 justify-content-end">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleResponder(consulta.id)}
                          >
                            <i className="bi bi-send"></i> Enviar
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => {
                              setRespondiendoId(null);
                              setRespuestaTexto('');
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
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
                            onClick={() => handleResponder(consulta.id)}
                            className="btn btn-sm btn-info me-1"
                            title="Responder"
                          >
                            <i className="bi bi-reply"></i>
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(consulta.id)}
                          className="btn btn-sm btn-outline-danger"
                          title="Eliminar consulta"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </>
                    )}
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