import React, { useState } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { CategoriaActivoFijo } from '../services/categoria-activo-fijo.service';

interface CategoriaSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: boolean;
  categorias: CategoriaActivoFijo[];
  loading?: boolean;
  placeholder?: string;
}

export const CategoriaSelector: React.FC<CategoriaSelectorProps> = ({
  value,
  onChange,
  onBlur,
  error = false,
  categorias,
  loading = false,
  placeholder = "Selecciona una categoría"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar categorías basado en el término de búsqueda
  const filteredCategorias = categorias.filter(categoria =>
    categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (categoria.descripcion && categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Obtener la categoría seleccionada
  const selectedCategoria = categorias.find(cat => cat.nombre === value);

  const handleSelect = (categoria: CategoriaActivoFijo) => {
    onChange(categoria.nombre);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  return (
    <div className="relative">
      {/* Botón de selección */}
      <button
        type="button"
        onClick={handleToggle}
        onBlur={onBlur}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${isOpen ? 'ring-2 ring-primary-500 border-transparent' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedCategoria ? (
              <>
                {selectedCategoria.icono && (
                  <span className="text-lg">{selectedCategoria.icono}</span>
                )}
                <span className="text-gray-900">{selectedCategoria.nombre}</span>
                {selectedCategoria.descripcion && (
                  <span className="text-sm text-gray-500 ml-2">
                    - {selectedCategoria.descripcion}
                  </span>
                )}
              </>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Barra de búsqueda */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          {/* Lista de categorías */}
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2">Cargando categorías...</p>
              </div>
            ) : filteredCategorias.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No se encontraron categorías' : 'No hay categorías disponibles'}
              </div>
            ) : (
              filteredCategorias.map((categoria) => (
                <button
                  key={categoria.categoria_id}
                  type="button"
                  onClick={() => handleSelect(categoria)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    value === categoria.nombre ? 'bg-primary-50 border-r-2 border-primary-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {categoria.icono && (
                        <span className="text-lg">{categoria.icono}</span>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{categoria.nombre}</div>
                        {categoria.descripcion && (
                          <div className="text-sm text-gray-500">{categoria.descripcion}</div>
                        )}
                      </div>
                    </div>
                    {value === categoria.nombre && (
                      <Check className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
