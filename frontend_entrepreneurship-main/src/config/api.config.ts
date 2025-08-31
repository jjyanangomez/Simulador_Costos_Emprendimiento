// Configuración de la API
export const API_CONFIG = {
  // URL base del backend
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  
  // Endpoints de categorías
  CATEGORIAS: {
    ACTIVAS: '/api/v1/categorias-activo-fijo/activas',
    POR_NEGOCIO: (negocioId: number) => `/api/v1/categorias-activo-fijo/negocio/${negocioId}`,
    BUSCAR: (termino: string) => `/api/v1/categorias-activo-fijo/search?q=${encodeURIComponent(termino)}`,
  },
  
  // Endpoints de costos fijos
  COSTOS_FIJOS: {
    BASE: '/api/v1/costos-fijos',
    POR_NEGOCIO: (negocioId: number) => `/api/v1/costos-fijos/negocio/${negocioId}`,
  },
  
  // Timeout para las peticiones
  TIMEOUT: 10000, // 10 segundos
};

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BACKEND_URL}${endpoint}`;
};
