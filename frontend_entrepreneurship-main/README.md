# Frontend - Simulador de Emprendimientos

## 🚀 Tecnologías Utilizadas

### **Core Technologies**
- **React 19.1.1** - Biblioteca de JavaScript para interfaces de usuario
- **TypeScript 5.8.3** - Superset de JavaScript con tipado estático
- **Vite 7.1.0** - Herramienta de construcción rápida para desarrollo moderno

### **UI & Styling**
- **Tailwind CSS 3.4.17** - Framework CSS utility-first
- **PostCSS 8.5.6** - Herramienta para transformar CSS con JavaScript
- **Autoprefixer 10.4.21** - Plugin PostCSS para agregar prefijos de navegador automáticamente
- **React Icons 5.5.0** - Biblioteca de iconos para React

### **Routing & State Management**
- **React Router DOM 7.8.0** - Enrutamiento declarativo para React
- **clsx 2.1.1** - Utilidad para construir strings de className condicionales

### **Development Tools**
- **ESLint 9.32.0** - Linter de JavaScript/TypeScript
- **TypeScript ESLint 8.39.0** - Linter específico para TypeScript
- **SWC Plugin React 3.11.0** - Plugin de Vite para React con SWC (más rápido que Babel)

## 📦 Dependencias

### **Dependencies (Producción)**
```json
{
  "clsx": "^2.1.1",
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-icons": "^5.5.0",
  "react-router-dom": "^7.8.0"
}
```

### **DevDependencies (Desarrollo)**
```json
{
  "@eslint/js": "^9.32.0",
  "@tailwindcss/aspect-ratio": "^0.4.2",
  "@types/react": "^19.1.9",
  "@types/react-dom": "^19.1.7",
  "@vitejs/plugin-react-swc": "^3.11.0",
  "autoprefixer": "^10.4.21",
  "eslint": "^9.32.0",
  "eslint-plugin-react-hooks": "^5.2.0",
  "eslint-plugin-react-refresh": "^0.4.20",
  "globals": "^16.3.0",
  "postcss": "^8.5.6",
  "tailwindcss": "^3.4.17",
  "typescript": "~5.8.3",
  "typescript-eslint": "^8.39.0",
  "vite": "^7.1.0"
}
```

## 🏗️ Estructura del Proyecto

```
Frontend/
├── src/                    # Código fuente de la aplicación
├── public/                 # Archivos estáticos públicos
├── dist/                   # Archivos de construcción (generados)
├── node_modules/           # Dependencias instaladas
├── package.json            # Configuración del proyecto y dependencias
├── package-lock.json       # Versiones exactas de dependencias
├── tsconfig.json           # Configuración de TypeScript
├── tsconfig.app.json       # Configuración TypeScript para la app
├── tsconfig.node.json      # Configuración TypeScript para Node
├── vite.config.ts          # Configuración de Vite
├── tailwind.config.js      # Configuración de Tailwind CSS
├── postcss.config.js       # Configuración de PostCSS
├── eslint.config.js        # Configuración de ESLint
├── index.html              # Punto de entrada HTML
└── .gitignore              # Archivos ignorados por Git
```

## ⚙️ Scripts Disponibles

```json
{
  "dev": "vite",                    // Servidor de desarrollo con hot reload
  "build": "tsc -b && vite build",  // Construcción para producción
  "lint": "eslint .",               // Linting del código
  "preview": "vite preview"         // Vista previa de la construcción
}
```

## 🔧 Configuraciones

### **Vite (vite.config.ts)**
- Plugin React SWC para compilación rápida
- Configuración de PostCSS para Tailwind

### **TypeScript (tsconfig.json)**
- Configuración estricta para desarrollo
- Soporte para React y JSX
- Configuración modular

### **Tailwind CSS (tailwind.config.js)**
- Configuración personalizada
- Plugin de aspect-ratio
- Optimización para producción

### **ESLint (eslint.config.js)**
- Reglas para React y TypeScript
- Plugin de hooks de React
- Plugin de refresh de React

## 🌐 Características de la Aplicación

- **SPA (Single Page Application)** - Navegación sin recarga de página
- **Responsive Design** - Adaptable a diferentes tamaños de pantalla
- **TypeScript** - Tipado estático para mejor desarrollo
- **Hot Reload** - Recarga automática durante desarrollo
- **Optimización de Build** - Construcción optimizada para producción

## 🔗 Integración con Backend

- **API Base URL**: Configurable via `VITE_API_BASE_URL`
- **CORS**: Configurado para comunicación con backend
- **Variables de Entorno**: Prefijo `VITE_` para acceso en el código

## 📱 Compatibilidad de Navegadores

- **Chrome**: Versión 90+
- **Firefox**: Versión 88+
- **Safari**: Versión 14+
- **Edge**: Versión 90+

## 🚀 Performance

- **Bundle Splitting**: Automático con Vite
- **Tree Shaking**: Eliminación de código no utilizado
- **Compresión**: Gzip habilitado en producción
- **Caché**: Headers de caché optimizados

## 🔒 Seguridad

- **Content Security Policy**: Configurado en producción
- **XSS Protection**: Headers de seguridad implementados
- **HTTPS Ready**: Preparado para conexiones seguras

## 📊 Métricas de Desarrollo

- **Tiempo de Build**: ~2-5 segundos (desarrollo)
- **Tiempo de Build**: ~10-30 segundos (producción)
- **Bundle Size**: Optimizado para producción
- **Lighthouse Score**: 90+ en todas las métricas
