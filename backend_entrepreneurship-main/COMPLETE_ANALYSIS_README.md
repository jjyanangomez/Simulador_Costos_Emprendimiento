# Sistema de Análisis Completo - Documentación

## 📋 Descripción

Este sistema permite guardar y recuperar todos los resultados de análisis de IA (costos analizados, riesgos detectados, plan de acción) en una sola tabla de base de datos, evitando múltiples llamadas a la IA cada vez que el usuario accede a los resultados.

## 🗄️ Nueva Tabla de Base de Datos

### `Resultados_Analisis_Completo`

```sql
CREATE TABLE "Resultados_Analisis_Completo" (
  "resultado_id" SERIAL PRIMARY KEY,
  "negocio_id" INTEGER NOT NULL,
  "modulo_id" INTEGER NOT NULL,
  "analisis_id" INTEGER NOT NULL,
  "fecha_analisis" TIMESTAMP DEFAULT NOW(),
  "costos_analizados" JSON,
  "riesgos_detectados" JSON,
  "plan_accion" JSON,
  "resumen_analisis" JSON,
  "estado_guardado" VARCHAR(50) DEFAULT 'guardado',
  UNIQUE("negocio_id", "modulo_id", "analisis_id")
);
```

## 🔌 Nuevos Endpoints

### 1. Guardar Análisis Completo

**Endpoint:** `POST /api/v1/ai/save-complete-results`

**Cuerpo de la petición:**
```json
{
  "negocioId": 1,
  "moduloId": 2,
  "analisisId": 3,
  "costosAnalizados": [
    {
      "nombre_costo": "Seguro de responsabilidad civil",
      "valor_recibido": "$500",
      "rango_estimado": "$400-$600",
      "evaluacion": "Aceptable",
      "comentario": "Precio dentro del rango esperado"
    }
  ],
  "riesgosDetectados": [
    {
      "riesgo": "Falta de seguro de responsabilidad civil",
      "causa_directa": "No se consideró este tipo de seguro",
      "impacto_potencial": "Alto - podría resultar en pérdidas financieras significativas"
    }
  ],
  "planAccion": [
    {
      "titulo": "Implementar seguro de responsabilidad civil",
      "descripcion": "Contratar un seguro que cubra daños a terceros",
      "prioridad": "Alta"
    }
  ],
  "resumenAnalisis": {
    "puntuacion_global": 7,
    "recomendaciones": ["Implementar seguros", "Optimizar costos"]
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Análisis completo guardado exitosamente",
  "data": {
    "resultadoId": 1,
    "negocioId": 1,
    "moduloId": 2,
    "analisisId": 3,
    "fechaAnalisis": "2024-01-15T10:30:00Z",
    "estadoGuardado": "guardado"
  }
}
```

### 2. Obtener Análisis Completo

**Endpoint:** `GET /api/v1/ai/get-complete-results/{negocioId}/{moduloId}`

**Respuesta:**
```json
{
  "success": true,
  "message": "Resultados de análisis encontrados",
  "data": {
    "resultadoId": 1,
    "negocioId": 1,
    "moduloId": 2,
    "analisisId": 3,
    "fechaAnalisis": "2024-01-15T10:30:00Z",
    "costosAnalizados": [...],
    "riesgosDetectados": [...],
    "planAccion": [...],
    "resumenAnalisis": {...},
    "estadoGuardado": "guardado"
  }
}
```

### 3. Endpoints Alternativos

También están disponibles endpoints alternativos en `/api/v1/complete-analysis-results/`:

- `POST /api/v1/complete-analysis-results/save-complete`
- `GET /api/v1/complete-analysis-results/negocio/{negocioId}/modulo/{moduloId}`

## 🎯 Casos de Uso

### 1. Guardar Resultados después del Análisis de IA

```typescript
// En el frontend, después de obtener resultados de IA
const saveData = {
  negocioId: 1,
  moduloId: 2,
  analisisId: 3,
  costosAnalizados: costosFromAI,
  riesgosDetectados: riesgosFromAI,
  planAccion: planFromAI,
  resumenAnalisis: resumenFromAI
};

const response = await fetch('/api/v1/ai/save-complete-results', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(saveData)
});
```

### 2. Cargar Resultados Guardados

```typescript
// Al cargar la página de resultados
const response = await fetch('/api/v1/ai/get-complete-results/1/2');
const result = await response.json();

if (result.success) {
  // Usar los resultados guardados en lugar de llamar a la IA
  displayResults(result.data);
} else {
  // No hay resultados guardados, proceder con análisis de IA
  performAIAnalysis();
}
```

## 🔄 Flujo de Trabajo Recomendado

1. **Primera vez que el usuario accede:**
   - Realizar análisis de IA
   - Guardar resultados en la nueva tabla
   - Mostrar resultados al usuario

2. **Visitas posteriores:**
   - Verificar si existen resultados guardados
   - Si existen, cargarlos y mostrarlos
   - Si no existen, proceder con análisis de IA

## 🛠️ Implementación en Frontend

### Hook Personalizado

```typescript
import { useCompleteAnalysis } from './hooks/useCompleteAnalysis';

const { saveCompleteAnalysis, getCompleteAnalysis, loading, error } = useCompleteAnalysis();

// Guardar resultados
const savedResult = await saveCompleteAnalysis({
  negocioId: 1,
  moduloId: 2,
  analisisId: 3,
  costosAnalizados: [...],
  riesgosDetectados: [...],
  planAccion: [...]
});

// Obtener resultados
const results = await getCompleteAnalysis(1, 2);
```

### Componente de Botón "Guardar y Continuar"

```typescript
import { SaveAndContinueButton } from './components/SaveAndContinueButton';

<SaveAndContinueButton
  negocioId={1}
  moduloId={2}
  analisisId={3}
  costosAnalizados={costosData}
  riesgosDetectados={riesgosData}
  planAccion={planData}
  onSuccess={() => navigate('/next-page')}
  onError={(error) => showError(error)}
/>
```

## 🚀 Beneficios

1. **Rendimiento:** Evita múltiples llamadas a la IA
2. **Costo:** Reduce el uso de tokens de IA
3. **Velocidad:** Carga instantánea de resultados guardados
4. **Consistencia:** Mismos resultados cada vez
5. **Escalabilidad:** Mejor manejo de carga del servidor

## 🔧 Configuración

### Variables de Entorno

Asegúrate de que las siguientes variables estén configuradas:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/database
API_KEY=your_google_gemini_api_key
```

### Migración de Base de Datos

```bash
cd backend_entrepreneurship
npx prisma migrate dev --name add_complete_analysis_results
```

## 📝 Notas Importantes

- Los resultados se guardan con una clave única por `negocio_id`, `modulo_id` y `analisis_id`
- Si ya existe un resultado para la misma combinación, se actualiza
- El estado por defecto es "guardado"
- Los datos se almacenan como JSON para máxima flexibilidad
- Se incluyen logs detallados para debugging

## 🐛 Troubleshooting

### Error: "No se pudo guardar el análisis"

1. Verificar conexión a la base de datos
2. Revisar logs del servidor
3. Verificar que todos los campos requeridos estén presentes

### Error: "No se encontraron resultados"

1. Verificar que los IDs sean correctos
2. Confirmar que se haya guardado previamente un análisis
3. Revisar la tabla `Resultados_Analisis_Completo`

### Error de migración

```bash
# Regenerar el cliente de Prisma
npx prisma generate

# Verificar el estado de la base de datos
npx prisma db push
```
