# Módulo de Punto de Equilibrio

## 📋 Descripción

Este módulo permite analizar el punto de equilibrio de un negocio basándose en las recetas disponibles y los costos fijos y variables. Proporciona una interfaz interactiva para calcular cuántas ventas de cada receta son necesarias para cubrir costos y obtener ganancias.

## 🎯 Funcionalidades Principales

### 1. **Análisis de Recetas**
- Muestra todas las recetas disponibles dinámicamente desde la base de datos
- Incluye información detallada de cada receta:
  - Nombre y producto asociado
  - Precio de venta
  - Tiempo de preparación
  - Personal requerido
  - Costos adicionales

### 2. **Cálculo de Punto de Equilibrio**
- Calcula automáticamente las ventas necesarias para cada receta
- Considera costos fijos y variables del negocio
- Permite establecer una ganancia objetivo mensual
- Distribuye la carga de ventas entre todas las recetas disponibles

### 3. **Controles Interactivos**
- Slider para ajustar la ganancia objetivo
- Campos editables para modificar cantidades de ventas por receta
- Cálculos en tiempo real de ingresos, costos y ganancias

### 4. **Análisis Financiero**
- Resumen completo de costos e ingresos
- Cálculo de ganancia real vs. objetivo
- Porcentaje de contribución de cada receta al equilibrio
- Recomendaciones automáticas basadas en el análisis

## 🏗️ Arquitectura

### **Frontend**
```
src/core/equilibrium/
├── domain/models/          # Modelos de dominio
│   └── Recipe.ts          # Interfaces de receta y equilibrio
├── infrastructure/
│   ├── hooks/             # Hooks personalizados
│   │   └── useEquilibrium.ts
│   ├── services/          # Servicios de API
│   │   └── equilibrium.service.ts
│   └── ui/                # Componentes de interfaz
│       └── EquilibriumPage.tsx
```

### **Backend**
```
backend_entrepreneurship-main/src/mvc/
├── controllers/
│   ├── productos.controller.ts      # Endpoint /recetas/all
│   ├── costos-fijos.controller.ts  # Endpoint /costos-fijos/total
│   └── costos-variables.controller.ts # Endpoint /costos-variables/total
├── services/
│   ├── productos.service.ts         # Método findAllRecetas()
│   ├── costos-fijos.service.ts     # Método getTotalByNegocioId()
│   └── costos-variables.service.ts # Método getTotalByNegocioId()
└── models/dto/
    ├── create-costo-variable.dto.ts
    └── update-costo-variable.dto.ts
```

## 🔌 Endpoints de API

### **Recetas**
- `GET /recetas/all` - Obtener todas las recetas disponibles

### **Costos Fijos**
- `GET /costos-fijos/total?negocioId={id}` - Obtener total de costos fijos

### **Costos Variables**
- `GET /costos-variables/total?negocioId={id}` - Obtener total de costos variables

## 📊 Cálculos Realizados

### **Punto de Equilibrio**
```
Costos Totales = Costos Fijos + Costos Variables
Ingresos Necesarios = Costos Totales + Ganancia Objetivo
```

### **Distribución de Ventas**
```
Ventas por Receta = Ingresos Necesarios / Número de Recetas / Margen de Contribución
Margen de Contribución = Precio Venta - Costos Variables
```

### **Ganancia Real**
```
Ganancia Real = Ingresos Totales - Costos Totales
```

## 🎨 Características de la UI

### **Diseño Responsivo**
- Grid adaptativo para diferentes tamaños de pantalla
- Cards organizadas para mejor legibilidad
- Colores diferenciados por tipo de información

### **Indicadores Visuales**
- Barras de progreso para contribución al equilibrio
- Colores diferenciados para ganancias positivas/negativas
- Iconos descriptivos para cada sección

### **Interactividad**
- Campos editables en tiempo real
- Cálculos automáticos al modificar valores
- Feedback visual inmediato

## 🚀 Uso

### **1. Acceso**
- Navegar a la sección "Equilibrio" en el menú principal
- La página se carga automáticamente con los datos disponibles

### **2. Configuración de Ganancia**
- Ajustar la ganancia objetivo mensual en el campo correspondiente
- Los cálculos se actualizan automáticamente

### **3. Análisis de Recetas**
- Revisar las cantidades de ventas calculadas para cada receta
- Modificar manualmente las cantidades si es necesario
- Observar cómo cambian los totales en tiempo real

### **4. Interpretación de Resultados**
- Revisar el resumen financiero completo
- Analizar las recomendaciones generadas
- Identificar oportunidades de optimización

## 🔧 Configuración

### **Datos de Ejemplo**
- Si no hay datos en la base de datos, se muestran recetas de ejemplo
- Costos fijos: $5,000 mensuales
- Costos variables: $1,500 mensuales
- Recetas: Hamburguesa, Pizza, Ensalada

### **Personalización**
- Modificar `mockRecipes` en `EquilibriumPage.tsx` para cambiar datos de ejemplo
- Ajustar `mockCostosFijos` y `mockCostosVariables` para diferentes escenarios

## 📈 Beneficios

### **Para Emprendedores**
- Visión clara de la rentabilidad del negocio
- Identificación de productos más rentables
- Planificación de ventas más precisa

### **Para la Gestión**
- Análisis de costos en tiempo real
- Evaluación de diferentes escenarios de ganancia
- Toma de decisiones basada en datos

## 🔮 Futuras Mejoras

### **Funcionalidades Planificadas**
- Gráficos de tendencias de ventas
- Comparación de diferentes períodos
- Exportación de reportes en PDF
- Integración con sistemas de inventario

### **Optimizaciones Técnicas**
- Caché de datos para mejor rendimiento
- Sincronización en tiempo real
- Notificaciones de alertas financieras
- Integración con APIs de terceros

## 🐛 Solución de Problemas

### **Error: "No se pudieron obtener las recetas"**
- Verificar que el backend esté ejecutándose
- Confirmar que existan recetas en la base de datos
- Revisar la conectividad de red

### **Cálculos Incorrectos**
- Verificar que los costos fijos y variables estén configurados
- Confirmar que las recetas tengan precios válidos
- Revisar la lógica de cálculo en el servicio

### **Datos No Se Actualizan**
- Verificar que el hook `useEquilibrium` esté funcionando
- Confirmar que los callbacks estén correctamente implementados
- Revisar la consola del navegador para errores

## 📝 Notas de Desarrollo

### **Estado Actual**
- ✅ Funcionalidad básica implementada
- ✅ UI responsive y atractiva
- ✅ Cálculos automáticos funcionando
- ✅ Datos de ejemplo para desarrollo

### **Próximos Pasos**
- 🔄 Integración completa con el backend
- 🔄 Manejo de errores robusto
- 🔄 Tests unitarios y de integración
- 🔄 Documentación de API completa
