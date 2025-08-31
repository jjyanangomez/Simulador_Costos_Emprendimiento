import { useState, useCallback } from 'react';
import { ItemsInversionService } from '../services/ItemsInversionService';
import { 
  ItemInversion, 
  CreateItemInversionDto, 
  UpdateItemInversionDto, 
  TotalInversionResponse 
} from '../models/ItemInversion';

interface UseItemsInversionReturn {
  items: ItemInversion[];
  loading: boolean;
  error: string | null;
  totalInversion: TotalInversionResponse | null;
  
  // Acciones
  createItem: (item: CreateItemInversionDto) => Promise<void>;
  updateItem: (id: number, item: UpdateItemInversionDto) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  loadItems: (negocioId?: number) => Promise<void>;
  loadTotalInversion: (negocioId: number) => Promise<void>;
  clearError: () => void;
}

export const useItemsInversion = (): UseItemsInversionReturn => {
  const [items, setItems] = useState<ItemInversion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalInversion, setTotalInversion] = useState<TotalInversionResponse | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createItem = useCallback(async (item: CreateItemInversionDto) => {
    try {
      setLoading(true);
      setError(null);
      
      const newItem = await ItemsInversionService.createItem(item);
      setItems(prev => [newItem, ...prev]);
      
      // Actualizar el total de inversión si tenemos negocio_id
      if (item.negocio_id) {
        await loadTotalInversion(item.negocio_id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (id: number, item: UpdateItemInversionDto) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedItem = await ItemsInversionService.updateItem(id, item);
      setItems(prev => prev.map(i => i.item_id === id ? updatedItem : i));
      
      // Actualizar el total de inversión si tenemos negocio_id
      if (item.negocio_id) {
        await loadTotalInversion(item.negocio_id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteItem = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      await ItemsInversionService.deleteItem(id);
      setItems(prev => prev.filter(i => i.item_id !== id));
      
      // Actualizar el total de inversión
      if (items.length > 0) {
        const negocioId = items[0].negocio_id;
        await loadTotalInversion(negocioId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [items]);

  const loadItems = useCallback(async (negocioId?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const loadedItems = await ItemsInversionService.getAllItems(negocioId);
      setItems(loadedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los items');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTotalInversion = useCallback(async (negocioId: number) => {
    try {
      setError(null);
      
      const total = await ItemsInversionService.getTotalInversion(negocioId);
      setTotalInversion(total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el total de inversión');
    }
  }, []);

  return {
    items,
    loading,
    error,
    totalInversion,
    createItem,
    updateItem,
    deleteItem,
    loadItems,
    loadTotalInversion,
    clearError,
  };
};
