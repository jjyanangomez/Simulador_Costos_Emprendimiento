# 🧠 Sistema de Análisis de IA para Costos Fijos

## 📋 Descripción

Este módulo implementa un sistema completo de análisis automático de costos fijos usando inteligencia artificial. El sistema valida costos, detecta elementos faltantes y genera recomendaciones personalizadas basadas en el tipo de negocio y ubicación.

## 🎯 Funcionalidades Principales

### 1. **Análisis Automático de IA**
- ✅ Validación de rangos de mercado por ubicación
- ✅ Detección de costos faltantes esenciales
- ✅ Análisis de completitud y riesgo
- ✅ Recomendaciones personalizadas por tipo de negocio

### 2. **Validaciones Inteligentes**
- **Rangos de Mercado**: Ajustados por ubicación (Centro Histórico, La Mariscal, etc.)
- **Costos por Categoría**: Validación específica para arriendo, personal, servicios, etc.
- **Frecuencias de Pago**: Conversión automática a costos mensuales equivalentes

### 3. **Detección de Costos Faltantes**
- **Alta Importancia**: Arriendo, servicios básicos, personal
- **Media Importancia**: Licencias, seguros
- **Baja Importancia**: Costos adicionales opcionales

### 4. **Puntuación y Evaluación**
- **Score General**: 0-100 puntos
- **Nivel de Riesgo**: Bajo, Medio, Alto
- **Completitud**: Porcentaje de costos cubiertos

## 🏗️ Arquitectura del Sistema

### **Estructura de Archivos**
```
src/core/fixed-costs/
├── domain/
│   └── types.ts                 # Interfaces y tipos TypeScript
├── infrastructure/
│   ├── services/
│   │   └── ai-analysis.service.ts # Lógica de análisis de IA
│   └── ui/
│       ├── FixedCostsPage.tsx   # Página principal de entrada
│       └── FixedCostsSummaryPage.tsx # Página de resumen y análisis
└── index.ts                     # Exportaciones principales
```

### **Flujo de Datos**
1. **Usuario ingresa costos** → `FixedCostsPage.tsx`
2. **Al hacer clic en "Guardar"** → Se ejecuta análisis de IA
3. **Análisis completo** → Se guarda en localStorage
4. **Redirección** → `FixedCostsSummaryPage.tsx`
5. **Usuario puede editar** → Regresa a `FixedCostsPage.tsx` con datos preservados

## 🔧 Implementación Técnica

### **Servicio de Análisis de IA**
```typescript
// Ejemplo de uso
const analysis = await AIAnalysisService.analyzeFixedCosts(costs, businessData);
```

**Características:**
- Simulación de delay de procesamiento (1.5s)
- Validaciones basadas en rangos de mercado ecuatoriano
- Factores de ajuste por ubicación geográfica
- Detección inteligente de costos faltantes

### **Tipos de Datos**
```typescript
interface FixedCost {
  name: string;
  description?: string;
  amount: number;
  frequency: 'mensual' | 'semestral' | 'anual';
  category: string;
}

interface AIAnalysisResult {
  summary: CostSummary;
  validations: CostValidation[];
  missingCosts: MissingCost[];
  recommendations: string[];
  overallAssessment: string;
  score: number;
}
```

## 📊 Rangos de Mercado Implementados

### **Costos por Categoría (USD/mes)**
| Categoría | Mínimo | Máximo | Unidad |
|-----------|--------|--------|---------|
| Arriendo | 800 | 5,000 | USD/mes |
| Personal | 425 | 2,000 | USD/mes/empleado |
| Servicios | 150 | 800 | USD/mes |
| Publicidad | 200 | 2,000 | USD/mes |
| Seguros | 100 | 800 | USD/mes |

### **Factores de Ubicación**
- **Centro Histórico**: ×1.3 (más caro)
- **La Mariscal**: ×1.2
- **La Floresta**: ×1.1
- **Cumbayá**: ×0.9
- **Tumbaco**: ×0.8
- **Valle de los Chillos**: ×0.7 (más barato)

## 🚀 Uso del Sistema

### **1. Configuración del Negocio**
```typescript
// Los datos del negocio deben estar en localStorage
const businessData = {
  businessName: "Mi Restaurante",
  businessType: "restaurante",
  location: "Centro Histórico",
  size: "Microempresa",
  employeeCount: 5,
  description: "Restaurante de comida tradicional"
};
```

### **2. Ingreso de Costos Fijos**
- Usuario completa el formulario en `FixedCostsPage`
- Sistema valida en tiempo real con IA
- Al guardar, se ejecuta análisis completo

### **3. Visualización del Resumen**
- Puntuación general y nivel de riesgo
- Validaciones específicas por costo
- Costos faltantes recomendados
- Recomendaciones personalizadas

### **4. Edición y Continuidad**
- Usuario puede regresar a editar costos
- Los datos se preservan en localStorage
- Continuar al siguiente paso del flujo

## 🎨 Componentes de UI

### **FixedCostsPage**
- Formulario dinámico para costos fijos
- Validaciones en tiempo real
- Integración con análisis de IA
- Preservación de datos en localStorage

### **FixedCostsSummaryPage**
- Resumen visual completo del análisis
- Puntuación y métricas
- Validaciones y recomendaciones
- Botones de acción (editar/continuar)

## 🔄 Flujo de Navegación

```
Business Setup → Fixed Costs → [Análisis IA] → Fixed Costs Summary → Variable Costs
                ↑                                    ↓
                └────────── [Editar Costos] ←────────┘
```

## 💾 Persistencia de Datos

### **localStorage Keys**
- `businessSetupData`: Configuración del negocio
- `fixedCostsData`: Costos fijos ingresados
- `fixedCostsSummary`: Resumen completo con análisis

### **Preservación de Estado**
- Al regresar de la página de resumen, los costos se restauran automáticamente
- El análisis previo se mantiene disponible
- No se pierden datos durante la navegación

## 🚨 Manejo de Errores

- Validación de datos del negocio antes del análisis
- Toast notifications para feedback del usuario
- Fallback a página de error si no hay datos
- Logs de consola para debugging

## 🔮 Futuras Mejoras

- **Integración con Backend**: Análisis real de IA
- **Machine Learning**: Aprendizaje de patrones de costos
- **Comparativas**: Benchmarking con negocios similares
- **Alertas**: Notificaciones de costos anómalos
- **Exportación**: Reportes en PDF/Excel

## 📝 Notas de Desarrollo

- El sistema está diseñado para ser extensible
- Las validaciones se pueden personalizar fácilmente
- Los rangos de mercado se pueden ajustar por región
- El análisis se puede expandir con nuevas categorías de costo
