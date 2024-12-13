import React from 'react';

interface SearchFilterProps {
  onSearch: (term: string) => void;
  onSort: (sortBy: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, onSort }) => {
  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="Buscar transacción..."
        onChange={(e) => onSearch(e.target.value)}
        className="search-input"
      />
      <select 
        onChange={(e) => onSort(e.target.value)}
        className="sort-select"
      >
        <option value="">Ordenar por</option>
        <option value="Fecha">Fecha</option>
        <option value="Descripción">Descripción</option>
      </select>
    </div>
  );
};

export default SearchFilter;


