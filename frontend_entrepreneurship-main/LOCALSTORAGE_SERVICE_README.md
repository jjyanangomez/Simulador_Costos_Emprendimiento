# Servicio de LocalStorage para Costos Fijos

## 📋 **Descripción**

Este servicio proporciona una interfaz completa para almacenar, recuperar y gestionar datos de costos fijos en el localStorage del navegador. Permite acceder a los datos desde cualquier parte de la aplicación de manera consistente y segura.

## 🏗️ **Arquitectura**

### **1. Servicio Principal (`LocalStorageService`)**
- Clase estática con métodos para operaciones CRUD
- Manejo de errores robusto
- Validación de datos
- Logging para debugging

### **2. Hook Personalizado (`useLocalStorage`)**
- Estado reactivo para componentes React
- Métodos optimizados con `useCallback`
- Carga automática de datos al montar
- Gestión de estado de carga

### **3. Componente de Ejemplo (`CostosFijosSummary`)**
- Demuestra el uso del hook
- Interfaz visual para mostrar datos
- Acciones para gestionar datos

## 🔧 **Instalación y Uso**

### **Importar el Servicio**
```typescript
import { LocalStorageService } from '../shared/services/localStorage.service';
import type { CostosFijosData, CostoFijo } from '../shared/services/localStorage.service';
```

### **Importar el Hook**
```typescript
import { useLocalStorage } from '../shared/hooks/useLocalStorage';
```

## 📊 **Interfaces de Datos**

### **CostoFijo**
```typescript
interface CostoFijo {
  name: string;
  description?: string;
  amount: number;
  frequency: 'mensual' | 'semestral' | 'anual';
  category: string;
}
```

### **CostosFijosData**
```typescript
interface CostosFijosData {
  costos: CostoFijo[];
  totalMonthly: number;
  totalYearly: number;
  costBreakdown: {
    mensual: number;
    semestral: number;
    anual: number;
  };
  fechaGuardado: string;
  negocioId?: string;
}
```

## 🚀 **Métodos del Servicio**

### **Operaciones Básicas**

#### **Guardar Costos Fijos**
```typescript
const data: CostosFijosData = {
  costos: [...],
  totalMonthly: 1200,
  totalYearly: 14400,
  costBreakdown: { mensual: 1200, semestral: 0, anual: 0 },
  fechaGuardado: new Date().toISOString(),
  negocioId: 'negocio-123'
};

LocalStorageService.guardarCostosFijos(data);
```

#### **Obtener Costos Fijos**
```typescript
const data = LocalStorageService.obtenerCostosFijos();
if (data) {
  console.log('Costos:', data.costos);
  console.log('Total mensual:', data.totalMonthly);
}
```

#### **Verificar Existencia**
```typescript
if (LocalStorageService.existenCostosFijos()) {
  console.log('Hay costos fijos guardados');
}
```

#### **Limpiar Datos**
```typescript
LocalStorageService.limpiarCostosFijos();
```

### **Métodos de Consulta**

#### **Obtener Solo Costos**
```typescript
const costos = LocalStorageService.obtenerCostos();
// Retorna: CostoFijo[]
```

#### **Obtener Totales**
```typescript
const totales = LocalStorageService.obtenerTotales();
if (totales) {
  console.log('Mensual:', totales.totalMonthly);
  console.log('Anual:', totales.totalYearly);
  console.log('Desglose:', totales.costBreakdown);
}
```

#### **Obtener Fecha de Guardado**
```typescript
const fecha = LocalStorageService.obtenerFechaGuardado();
if (fecha) {
  console.log('Guardado:', new Date(fecha).toLocaleDateString());
}
```

### **Métodos Avanzados**

#### **Verificar Actualización de Datos**
```typescript
if (LocalStorageService.datosEstanActualizados()) {
  console.log('Los datos están actualizados (menos de 24 horas)');
} else {
  console.log('Los datos pueden estar desactualizados');
}
```

#### **Obtener Estadísticas**
```typescript
const stats = LocalStorageService.obtenerEstadisticas();
console.log('Total costos:', stats.totalCostos);
console.log('Frecuencias:', stats.frecuenciasUtilizadas);
console.log('Categoría más usada:', stats.categoriaMasUsada);
console.log('Monto promedio:', stats.montoPromedio);
```

#### **Exportar/Importar Datos**
```typescript
// Exportar
const jsonData = LocalStorageService.exportarDatos();
console.log('Datos exportados:', jsonData);

// Importar
const success = LocalStorageService.importarDatos(jsonData);
if (success) {
  console.log('Datos importados correctamente');
}
```

## 🎣 **Uso del Hook Personalizado**

### **En un Componente React**
```typescript
import React from 'react';
import { useLocalStorage } from '../shared/hooks/useLocalStorage';

export const MiComponente: React.FC = () => {
  const {
    costosFijos,
    isLoading,
    totalCostos,
    totalMonthly,
    totalYearly,
    guardarCostosFijos,
    limpiarCostosFijos,
    obtenerEstadisticas
  } = useLocalStorage();

  const estadisticas = obtenerEstadisticas();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!costosFijos) {
    return <div>No hay datos</div>;
  }

  return (
    <div>
      <h2>Costos Fijos: {totalCostos}</h2>
      <p>Total Mensual: ${totalMonthly}</p>
      <p>Total Anual: ${totalYearly}</p>
      
      <button onClick={limpiarCostosFijos}>
        Limpiar Datos
      </button>
    </div>
  );
};
```

### **Métodos Disponibles en el Hook**
```typescript
const {
  // Estado
  costosFijos,        // Datos completos
  isLoading,          // Estado de carga
  
  // Métodos
  cargarCostosFijos,  // Recargar datos
  guardarCostosFijos, // Guardar nuevos datos
  limpiarCostosFijos, // Eliminar datos
  existenCostosFijos, // Verificar existencia
  obtenerCostos,      // Solo costos
  obtenerTotales,     // Solo totales
  obtenerEstadisticas, // Estadísticas
  datosEstanActualizados, // Verificar actualización
  exportarDatos,      // Exportar JSON
  importarDatos,      // Importar JSON
  
  // Utilidades
  totalCostos,        // Número de costos
  totalMonthly,       // Total mensual
  totalYearly,        // Total anual
  fechaGuardado,      // Fecha de guardado
  negocioId           // ID del negocio
} = useLocalStorage();
```

## 🔒 **Gestión de Negocios**

### **Guardar Negocio Actual**
```typescript
LocalStorageService.guardarNegocioActual('negocio-123');
```

### **Obtener Negocio Actual**
```typescript
const negocioId = LocalStorageService.obtenerNegocioActual();
if (negocioId) {
  console.log('Negocio actual:', negocioId);
}
```

## 📱 **Casos de Uso Comunes**

### **1. Dashboard Principal**
```typescript
// Mostrar resumen de costos fijos
const { totalCostos, totalMonthly, totalYearly } = useLocalStorage();
```

### **2. Formulario de Costos**
```typescript
// Guardar costos después de completar el formulario
const { guardarCostosFijos } = useLocalStorage();

const handleSubmit = async (data: CostosFijosData) => {
  const success = await guardarCostosFijos(data);
  if (success) {
    toast.success('Costos guardados correctamente');
  }
};
```

### **3. Análisis y Reportes**
```typescript
// Obtener estadísticas para análisis
const { obtenerEstadisticas } = useLocalStorage();
const stats = obtenerEstadisticas();

// Generar reporte
const reporte = {
  totalCostos: stats.totalCostos,
  frecuencias: stats.frecuenciasUtilizadas,
  categoriaMasUsada: stats.categoriaMasUsada,
  montoPromedio: stats.montoPromedio
};
```

### **4. Sincronización de Datos**
```typescript
// Verificar si los datos están actualizados
const { datosEstanActualizados, cargarCostosFijos } = useLocalStorage();

useEffect(() => {
  if (!datosEstanActualizados()) {
    // Los datos están desactualizados, recargar
    cargarCostosFijos();
  }
}, []);
```

## 🚨 **Manejo de Errores**

### **Errores Comunes**
```typescript
try {
  LocalStorageService.guardarCostosFijos(data);
} catch (error) {
  if (error instanceof Error) {
    console.error('Error al guardar:', error.message);
    // Mostrar mensaje al usuario
    toast.error('Error al guardar los datos');
  }
}
```

### **Verificación de Datos**
```typescript
const data = LocalStorageService.obtenerCostosFijos();
if (data && data.costos && Array.isArray(data.costos)) {
  // Los datos son válidos
  console.log('Datos válidos:', data.costos.length);
} else {
  // Los datos no son válidos
  console.log('Datos inválidos o corruptos');
  LocalStorageService.limpiarCostosFijos();
}
```

## 🔄 **Persistencia y Recuperación**

### **Recuperación Automática**
```typescript
// El hook carga automáticamente los datos al montar
useEffect(() => {
  // Los datos se cargan automáticamente
}, []);
```

### **Sincronización Manual**
```typescript
const { cargarCostosFijos } = useLocalStorage();

// Recargar datos manualmente
const handleRefresh = () => {
  cargarCostosFijos();
};
```

## 📊 **Monitoreo y Debugging**

### **Logs Automáticos**
El servicio registra automáticamente todas las operaciones:
```typescript
// Al guardar
console.log('Costos fijos guardados en localStorage:', data);

// Al recuperar
console.log('Costos fijos recuperados del localStorage:', data);

// Al limpiar
console.log('Costos fijos eliminados del localStorage');
```

### **Verificación de Estado**
```typescript
// Verificar el estado actual
console.log('Estado del localStorage:', {
  existenCostos: LocalStorageService.existenCostosFijos(),
  datosActualizados: LocalStorageService.datosEstanActualizados(),
  fechaGuardado: LocalStorageService.obtenerFechaGuardado()
});
```

## 🎯 **Mejores Prácticas**

### **1. Validación de Datos**
```typescript
// Siempre validar antes de usar
const data = LocalStorageService.obtenerCostosFijos();
if (data && data.costos.length > 0) {
  // Usar los datos
} else {
  // Manejar caso sin datos
}
```

### **2. Manejo de Errores**
```typescript
// Usar try-catch para operaciones críticas
try {
  LocalStorageService.guardarCostosFijos(data);
} catch (error) {
  // Fallback: mostrar mensaje al usuario
  console.error('Error crítico:', error);
}
```

### **3. Limpieza de Datos**
```typescript
// Limpiar datos cuando sea necesario
const handleLogout = () => {
  LocalStorageService.limpiarCostosFijos();
  // Otros datos de limpieza...
};
```

## 🔮 **Próximas Mejoras**

### **Funcionalidades Planificadas**
- [ ] **Cifrado**: Encriptar datos sensibles
- [ ] **Compresión**: Comprimir datos para ahorrar espacio
- [ ] **Sincronización**: Sincronizar con backend
- [ ] **Backup**: Backup automático de datos
- [ ] **Versionado**: Control de versiones de datos

### **Optimizaciones Técnicas**
- [ ] **Caché**: Caché inteligente de datos
- [ ] **Lazy Loading**: Carga diferida de datos pesados
- [ ] **Compression**: Compresión automática de datos
- [ ] **Validation**: Validación más robusta de datos

## 📚 **Ejemplos Completos**

### **Componente de Dashboard**
```typescript
import React from 'react';
import { useLocalStorage } from '../shared/hooks/useLocalStorage';
import { CostosFijosSummary } from '../shared/components/CostosFijosSummary';

export const Dashboard: React.FC = () => {
  const { existenCostosFijos } = useLocalStorage();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {existenCostosFijos() ? (
        <CostosFijosSummary />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">
            No hay costos fijos registrados. 
            Ve a la sección de costos fijos para comenzar.
          </p>
        </div>
      )}
    </div>
  );
};
```

### **Página de Análisis**
```typescript
import React from 'react';
import { useLocalStorage } from '../shared/hooks/useLocalStorage';

export const AnalisisPage: React.FC = () => {
  const { obtenerEstadisticas, exportarDatos } = useLocalStorage();
  const stats = obtenerEstadisticas();

  const handleExport = () => {
    const jsonData = exportarDatos();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'costos-fijos.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Análisis de Costos</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Estadísticas Generales</h3>
          <div className="space-y-2">
            <p>Total de costos: {stats.totalCostos}</p>
            <p>Frecuencias: {stats.frecuenciasUtilizadas.join(', ')}</p>
            <p>Categoría más usada: {stats.categoriaMasUsada}</p>
            <p>Monto promedio: ${stats.montoPromedio}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Acciones</h3>
          <button
            onClick={handleExport}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Exportar Datos
          </button>
        </div>
      </div>
    </div>
  );
};
```

## 🎯 **Conclusión**

El servicio de localStorage proporciona una base sólida y confiable para gestionar datos de costos fijos en toda la aplicación. Con su interfaz simple pero potente, permite a los desarrolladores implementar funcionalidades de persistencia de datos de manera eficiente y consistente.

La combinación del servicio estático y el hook personalizado ofrece flexibilidad para diferentes casos de uso, desde operaciones simples hasta implementaciones complejas de análisis y reportes.
