// 🏢 FUNCIONES ESPECÍFICAS PARA MANEJAR EL NOMBRE DEL NEGOCIO
// Estas funciones permiten guardar y recuperar solo el nombre del negocio

import { useState, useEffect } from 'react';

// Clave para localStorage
const BUSINESS_NAME_KEY = 'businessName';
const BUSINESS_NAME_HISTORY_KEY = 'businessNameHistory';

// ===== FUNCIONES BÁSICAS =====

/**
 * 💾 Guarda el nombre del negocio
 * @param businessName - Nombre del negocio a guardar
 * @returns boolean - Éxito de la operación
 */
export function saveBusinessName(businessName: string): boolean {
  try {
    if (!businessName || businessName.trim() === '') {
      console.warn('⚠️ Nombre del negocio vacío, no se guardará');
      return false;
    }

    const cleanName = businessName.trim();
    localStorage.setItem(BUSINESS_NAME_KEY, cleanName);
    
    // Guardar en historial
    addToBusinessNameHistory(cleanName);
    
    console.log('✅ Nombre del negocio guardado:', cleanName);
    return true;
  } catch (error) {
    console.error('❌ Error al guardar nombre del negocio:', error);
    return false;
  }
}

/**
 * 📖 Recupera el nombre del negocio guardado
 * @returns string | null - Nombre del negocio o null si no existe
 */
export function getBusinessName(): string | null {
  try {
    const name = localStorage.getItem(BUSINESS_NAME_KEY);
    return name ? name.trim() : null;
  } catch (error) {
    console.error('❌ Error al recuperar nombre del negocio:', error);
    return null;
  }
}

/**
 * ✅ Verifica si hay un nombre de negocio guardado
 * @returns boolean - True si existe un nombre guardado
 */
export function hasBusinessName(): boolean {
  const name = getBusinessName();
  return name !== null && name !== '';
}

/**
 * 🗑️ Elimina el nombre del negocio guardado
 * @returns boolean - Éxito de la operación
 */
export function clearBusinessName(): boolean {
  try {
    localStorage.removeItem(BUSINESS_NAME_KEY);
    console.log('🗑️ Nombre del negocio eliminado');
    return true;
  } catch (error) {
    console.error('❌ Error al eliminar nombre del negocio:', error);
    return false;
  }
}

/**
 * 🔄 Actualiza el nombre del negocio (alias para saveBusinessName)
 * @param newName - Nuevo nombre del negocio
 * @returns boolean - Éxito de la operación
 */
export function updateBusinessName(newName: string): boolean {
  return saveBusinessName(newName);
}

// ===== FUNCIONES AVANZADAS =====

/**
 * 📋 Obtiene el historial de nombres de negocio
 * @returns string[] - Array de nombres anteriores
 */
export function getBusinessNameHistory(): string[] {
  try {
    const history = localStorage.getItem(BUSINESS_NAME_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('❌ Error al obtener historial:', error);
    return [];
  }
}

/**
 * ➕ Agrega un nombre al historial
 * @private
 * @param name - Nombre a agregar al historial
 */
function addToBusinessNameHistory(name: string): void {
  try {
    const history = getBusinessNameHistory();
    
    // No agregar duplicados
    if (history.includes(name)) {
      return;
    }
    
    // Mantener solo los últimos 10 nombres
    const updatedHistory = [name, ...history].slice(0, 10);
    localStorage.setItem(BUSINESS_NAME_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('❌ Error al agregar al historial:', error);
  }
}

/**
 * 🔤 Formatea el nombre del negocio
 * @param name - Nombre a formatear
 * @returns string - Nombre formateado
 */
export function formatBusinessName(name: string): string {
  if (!name) return '';
  
  return name
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * ✅ Valida si un nombre de negocio es válido
 * @param name - Nombre a validar
 * @returns { isValid: boolean, message?: string }
 */
export function validateBusinessName(name: string): { isValid: boolean, message?: string } {
  if (!name || name.trim() === '') {
    return { isValid: false, message: 'El nombre no puede estar vacío' };
  }
  
  if (name.length < 3) {
    return { isValid: false, message: 'El nombre debe tener al menos 3 caracteres' };
  }
  
  if (name.length > 50) {
    return { isValid: false, message: 'El nombre no puede exceder 50 caracteres' };
  }
  
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9]+$/.test(name)) {
    return { isValid: false, message: 'El nombre solo puede contener letras, números y espacios' };
  }
  
  return { isValid: true };
}

/**
 * 🎯 Obtiene el nombre formateado para mostrar
 * @returns string - Nombre formateado o mensaje por defecto
 */
export function getFormattedBusinessName(): string {
  const name = getBusinessName();
  if (!name) {
    return 'Mi Negocio';
  }
  return formatBusinessName(name);
}

/**
 * 📊 Obtiene información completa del nombre del negocio
 * @returns object - Información completa
 */
export function getBusinessNameInfo(): {
  name: string | null;
  hasName: boolean;
  formattedName: string;
  history: string[];
  lastUpdated: string | null;
} {
  const name = getBusinessName();
  const history = getBusinessNameHistory();
  
  return {
    name,
    hasName: name !== null,
    formattedName: getFormattedBusinessName(),
    history,
    lastUpdated: name ? new Date().toISOString() : null
  };
}

// ===== HOOK PERSONALIZADO =====

/**
 * 🎣 Hook personalizado para manejar el nombre del negocio
 * @returns Objeto con estado y funciones para manejar el nombre
 */
export function useBusinessName() {
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar nombre al montar el componente
  useEffect(() => {
    setIsLoading(true);
    const name = getBusinessName();
    setBusinessName(name);
    setIsLoading(false);
  }, []);

  // Función para guardar nombre y actualizar estado
  const saveName = (name: string): boolean => {
    const success = saveBusinessName(name);
    if (success) {
      setBusinessName(name);
    }
    return success;
  };

  // Función para limpiar nombre y actualizar estado
  const clearName = (): boolean => {
    const success = clearBusinessName();
    if (success) {
      setBusinessName(null);
    }
    return success;
  };

  // Función para actualizar nombre
  const updateName = (newName: string): boolean => {
    return saveName(newName);
  };

  return {
    // Estado
    businessName,
    hasName: businessName !== null,
    formattedName: businessName ? formatBusinessName(businessName) : 'Mi Negocio',
    isLoading,
    
    // Funciones
    saveName,
    updateName,
    clearName,
    
    // Utilidades
    validateName: validateBusinessName,
    formatName: formatBusinessName,
    getHistory: getBusinessNameHistory,
    getInfo: getBusinessNameInfo
  };
}

// ===== FUNCIONES DE INTEGRACIÓN =====

/**
 * 🔗 Guarda el nombre desde los datos completos del análisis
 * @returns boolean - Éxito de la operación
 */
export function saveBusinessNameFromAnalysis(): boolean {
  try {
    const analysisData = localStorage.getItem('businessAnalysisData');
    if (!analysisData) {
      console.warn('⚠️ No hay datos de análisis disponibles');
      return false;
    }
    
    const data = JSON.parse(analysisData);
    if (data.businessName) {
      return saveBusinessName(data.businessName);
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error al extraer nombre del análisis:', error);
    return false;
  }
}

/**
 * 🎯 Función rápida para obtener el nombre desde cualquier lugar
 * @returns string - Nombre del negocio o "Mi Negocio" por defecto
 */
export function getBusinessNameQuick(): string {
  const name = getBusinessName();
  return name || 'Mi Negocio';
}

/**
 * 📝 Función para mostrar el nombre en componentes
 * @param prefix - Prefijo opcional (ej: "Bienvenido a")
 * @param suffix - Sufijo opcional (ej: "- Dashboard")
 * @returns string - Nombre formateado con prefijos/sufijos
 */
export function displayBusinessName(prefix: string = '', suffix: string = ''): string {
  const name = getFormattedBusinessName();
  return `${prefix}${prefix ? ' ' : ''}${name}${suffix ? ' ' : ''}${suffix}`.trim();
}
