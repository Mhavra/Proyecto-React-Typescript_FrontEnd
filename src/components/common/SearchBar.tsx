/**
 * SEARCH BAR - Componente de búsqueda reutilizable
 */

'use client';
/*aqui se le da los props, que son los parámetros que recibe el componente */ 
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