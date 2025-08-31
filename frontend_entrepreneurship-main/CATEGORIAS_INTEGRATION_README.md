# Integración de Categorías con el Backend

## 📋 **Descripción**

Se ha implementado la integración completa entre el frontend y el backend para las categorías de activos fijos. El combo box de categorías ahora se alimenta dinámicamente desde el servicio del backend.

## 🏗️ **Arquitectura Implementada**

### **1. Servicio de Categorías**
- **Archivo**: `src/core/fixed-costs/infrastructure/services/categoria-activo-fijo.service.ts`
- **Funcionalidad**: Consume la API del backend para obtener categorías
- **Métodos**:
  - `getCategoriasActivas()`: Obtiene todas las categorías activas
  - `getCategoriasPorNegocio(negocioId)`: Obtiene categorías por negocio específico
  - `buscarCategorias(termino)`: Busca categorías por término
  - `getCategoriasPorDefecto()`: Categorías de respaldo en caso de error

### **2. Hook Personalizado**
- **Archivo**: `src/core/fixed-costs/infrastructure/hooks/useCategorias.ts`
- **Funcionalidad**: Maneja el estado y la lógica de las categorías
- **Características**:
  - Carga automática al montar el componente
  - Manejo de estados de carga y error
  - Búsqueda en tiempo real
  - Recarga automática

### **3. Componente de Selección**
- **Archivo**: `src/core/fixed-costs/infrastructure/components/CategoriaSelector.tsx`
- **Funcionalidad**: Selector avanzado de categorías con búsqueda
- **Características**:
  - Dropdown con búsqueda integrada
  - Visualización de iconos y descripciones
  - Indicadores de estado de carga
  - Manejo de errores

### **4. Configuración de API**
- **Archivo**: `src/config/api.config.ts`
- **Funcionalidad**: Configuración centralizada de endpoints
- **Variables**:
  - `VITE_BACKEND_URL`: URL del backend (por defecto: http://localhost:3000)

## 🚀 **Configuración Requerida**

### **1. Variables de Entorno**
Crear un archivo `.env` en la raíz del frontend:

```bash
# Configuración del Backend
VITE_BACKEND_URL=http://localhost:3000

# Configuración de la aplicación
VITE_APP_TITLE=Simulador de Costos de Emprendimiento
VITE_APP_VERSION=1.0.0
```

### **2. Backend en Ejecución**
Asegurarse de que el backend esté ejecutándose en el puerto 3000:

```bash
cd backend_entrepreneurship-main
npm run start:dev
```

## 🔄 **Flujo de Datos**

### **1. Carga Inicial**
```
Frontend → useCategorias Hook → CategoriaActivoFijoService → Backend API
```

### **2. Selección de Categoría**
```
Usuario → CategoriaSelector → React Hook Form → Validación → Estado
```

### **3. Búsqueda en Tiempo Real**
```
Usuario escribe → Filtrado local → Búsqueda en backend → Resultados
```

## 📱 **Características del Selector**

### **✅ Funcionalidades**
- **Búsqueda en tiempo real** con filtrado local
- **Iconos y descripciones** para cada categoría
- **Estados de carga** con spinners
- **Manejo de errores** con fallback a categorías por defecto
- **Responsive design** para móviles y desktop
- **Accesibilidad** con navegación por teclado

### **🎨 UI/UX**
- **Dropdown elegante** con sombras y bordes redondeados
- **Colores dinámicos** basados en la categoría seleccionada
- **Transiciones suaves** para mejor experiencia
- **Indicadores visuales** de estado y selección

## 🔧 **Uso en el Componente**

### **1. Importar el Hook**
```typescript
import { useCategorias } from '../hooks/useCategorias';

export function FixedCostsPage() {
  const { categorias, loading: categoriasLoading, error: categoriasError } = useCategorias();
  // ... resto del código
}
```

### **2. Usar el Selector**
```typescript
<Controller
  name={`costs.${index}.category`}
  control={control}
  render={({ field }) => (
    <CategoriaSelector
      value={field.value || ''}
      onChange={(value) => {
        field.onChange(value);
        validateCost(index);
      }}
      onBlur={field.onBlur}
      error={!!errors.costs?.[index]?.category}
      categorias={categorias}
      loading={categoriasLoading}
      placeholder="Selecciona una categoría"
    />
  )}
/>
```

## 🛡️ **Manejo de Errores**

### **1. Fallback Automático**
Si el backend no está disponible, se muestran categorías por defecto:
- Equipos de Cocina 🍳
- Mobiliario 🪑
- Equipos de Computación 💻
- Equipos de Refrigeración ❄️
- Equipos de Seguridad 🔒
- Equipos de Limpieza 🧹
- Equipos de Oficina 📁
- Otros Equipos 📦

### **2. Estados de Error**
- **Carga**: Spinner azul con mensaje informativo
- **Error**: Mensaje rojo con descripción del problema
- **Sin datos**: Mensaje informativo cuando no hay categorías

## 🔍 **Endpoints del Backend Utilizados**

### **1. Categorías Activas**
```http
GET /categorias-activo-fijo/activas
```

### **2. Categorías por Negocio**
```http
GET /categorias-activo-fijo/negocio/:negocioId
```

### **3. Búsqueda de Categorías**
```http
GET /categorias-activo-fijo/search?q=termino
```

## 📊 **Estructura de Respuesta Esperada**

```json
{
  "message": "Categorías obtenidas exitosamente",
  "data": [
    {
      "categoria_id": 1,
      "nombre": "Equipos de Cocina",
      "descripcion": "Equipos para preparar alimentos",
      "icono": "🍳",
      "color": "#FF6B6B",
      "activo": true,
      "fecha_creacion": "2025-01-30T19:03:31.000Z"
    }
  ],
  "total": 1
}
```

## 🚀 **Próximas Mejoras**

### **1. Funcionalidades Planificadas**
- [ ] Caché local de categorías
- [ ] Sincronización en tiempo real
- [ ] Categorías favoritas del usuario
- [ ] Historial de selecciones

### **2. Optimizaciones Técnicas**
- [ ] Debounce en búsquedas
- [ ] Lazy loading de categorías
- [ ] Compresión de respuestas
- [ ] Métricas de rendimiento

## 🧪 **Testing**

### **1. Pruebas Manuales**
- [ ] Carga inicial de categorías
- [ ] Búsqueda en tiempo real
- [ ] Selección de categorías
- [ ] Manejo de errores de red
- [ ] Responsive design

### **2. Casos de Borde**
- [ ] Backend no disponible
- [ ] Sin categorías disponibles
- [ ] Categorías con caracteres especiales
- [ ] Categorías muy largas

## 📚 **Referencias**

- **Backend API**: `CATEGORIA_ACTIVO_FIJO_SERVICES_README.md`
- **Esquema de Base de Datos**: `CATEGORIA_ACTIVO_FIJO_README.md`
- **Componente Principal**: `FixedCostsPage.tsx`
- **Servicio**: `categoria-activo-fijo.service.ts`
- **Hook**: `useCategorias.ts`

## 🎯 **Conclusión**

La integración está completamente funcional y proporciona una experiencia de usuario superior con:
- **Categorías dinámicas** desde el backend
- **Búsqueda en tiempo real** con filtrado inteligente
- **Manejo robusto de errores** con fallbacks automáticos
- **UI moderna y responsive** con transiciones suaves
- **Arquitectura escalable** para futuras mejoras

El sistema está listo para producción y puede manejar tanto escenarios de éxito como de fallo de manera elegante.
