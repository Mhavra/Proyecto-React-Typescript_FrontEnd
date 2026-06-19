/**
 * SEARCH BAR - Componente de búsqueda reutilizable
 * 
 * @component
 * @param props.placeholder - Texto del placeholder
 * @param props.value - Valor del input
 * @param props.onChange - Función al cambiar
 * @param props.className - Clases adicionales
 */

'use client';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SearchBar({
  placeholder = 'Buscar...',
  value,
  onChange,
  className = '',
}: SearchBarProps) {
  return (
    <div className={`mb-3 ${className}`}>
      <div className="input-group">
        <span className="input-group-text bg-white border-end-0">
          <i className="bi bi-search text-muted"></i>
        </span>
        <input
          type="text"
          className="form-control border-start-0"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}