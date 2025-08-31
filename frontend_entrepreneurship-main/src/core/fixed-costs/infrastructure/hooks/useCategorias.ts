import { useState, useEffect } from 'react';
import { categoriaActivoFijoService, CategoriaActivoFijo } from '../services/categoria-activo-fijo.service';

export const useCategorias = (negocioId?: number) => {
  const [categorias, setCategorias] = useState<CategoriaActivoFijo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar categorías al montar el componente
  useEffect(() => {
    cargarCategorias();
  }, [negocioId]);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let categoriasData: CategoriaActivoFijo[];
      
      if (negocioId) {
        // Si hay un negocioId, obtener categorías específicas del negocio
        categoriasData = await categoriaActivoFijoService.getCategoriasPorNegocio(negocioId);
      } else {
        // Si no hay negocioId, obtener todas las categorías activas
        categoriasData = await categoriaActivoFijoService.getCategoriasActivas();
      }
      
      setCategorias(categoriasData);
    } catch (err) {
      setError('Error al cargar las categorías');
      console.error('Error al cargar categorías:', err);
    } finally {
      setLoading(false);
    }
  };

  const buscarCategorias = async (termino: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!termino.trim()) {
        // Si no hay término de búsqueda, cargar todas las categorías
        await cargarCategorias();
        return;
      }
      
      const categoriasEncontradas = await categoriaActivoFijoService.buscarCategorias(termino);
      setCategorias(categoriasEncontradas);
    } catch (err) {
      setError('Error al buscar categorías');
      console.error('Error al buscar categorías:', err);
    } finally {
      setLoading(false);
    }
  };

  const recargarCategorias = () => {
    cargarCategorias();
  };

  return {
    categorias,
    loading,
    error,
    buscarCategorias,
    recargarCategorias,
    cargarCategorias
  };
};
