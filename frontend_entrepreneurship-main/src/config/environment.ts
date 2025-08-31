// Configuración de variables de entorno
export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
    apiV1: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  },
  app: {
    title: import.meta.env.VITE_APP_NAME || 'Simulador de Emprendimientos',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  dev: {
    mode: import.meta.env.VITE_DEV_MODE === 'true',
    enableLogs: import.meta.env.VITE_ENABLE_LOGS === 'true',
  },
} as const;
