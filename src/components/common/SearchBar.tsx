/**
 * SEARCH BAR - Componente de búsqueda reutilizable
 * 
 * Proporciona una barra de búsqueda con ícono de lupa.
 * Se puede usar en cualquier página que necesite filtrado.
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
        {/* Ícono de búsqueda */}
        <span className="input-group-text bg-white border-end-0">
          <i className="bi bi-search text-muted"></i>
        </span>
        {/* Input de texto */}
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