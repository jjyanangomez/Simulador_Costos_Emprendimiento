// Configuración de variables de entorno
export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  },
  app: {
    title: import.meta.env.VITE_APP_TITLE || 'Simulador de Emprendimientos',
  },
} as const;
