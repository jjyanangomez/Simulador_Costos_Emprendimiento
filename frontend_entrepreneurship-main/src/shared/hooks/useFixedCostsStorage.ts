import { useEffect, useState } from 'react';
import { LocalStorageService } from '../services/LocalStorageService';

export function useFixedCostsStorage(
  businessData: any,
  essentialCosts: any[],
  reset: (data: any) => void,
  isFormInitialized: boolean,
  setIsFormInitialized: (value: boolean) => void
) {
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  useEffect(() => {
    if (businessData && !isFormInitialized && !hasLoadedFromStorage) {
      // PRIMERO: Intentar cargar costos fijos guardados en localStorage
      const businessId = businessData.businessName || 'default';
      const storedCosts = LocalStorageService.loadFixedCosts(businessId);
      
      if (storedCosts && storedCosts.length > 0) {
        // Usar los costos guardados en localStorage
        reset({ costs: storedCosts });
        console.log('📂 Formulario inicializado con costos guardados en localStorage:', storedCosts);
        setHasLoadedFromStorage(true);
        setIsFormInitialized(true);
        return; // IMPORTANTE: Salir aquí para NO cargar los costos esenciales
      }
      
      // SEGUNDO: Si no hay costos guardados válidos, usar los costos esenciales precargados
      if (essentialCosts.length > 0) {
        reset({
          costs: essentialCosts,
        });
        console.log('📝 Formulario inicializado con costos esenciales precargados');
      }
      
      setHasLoadedFromStorage(true);
      setIsFormInitialized(true);
    } else if (!businessData && !isFormInitialized) {
      // Si no hay datos del negocio, inicializar con un costo básico
      reset({
        costs: [{
          name: '',
          description: '',
          amount: 0,
          frequency: 'mensual' as const,
          category: '',
        }],
      });
      setIsFormInitialized(true);
      console.log('📝 Formulario inicializado sin datos del negocio');
    }
  }, [businessData, essentialCosts, isFormInitialized, reset, setIsFormInitialized, hasLoadedFromStorage]);

  return { hasLoadedFromStorage };
}
