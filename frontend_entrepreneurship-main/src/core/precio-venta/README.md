# Sección Precio de Venta

## Descripción
Esta sección permite analizar los costos totales de cada producto, generar precios de venta sugeridos por IA y permitir que el cliente ajuste los precios según su estrategia de mercado.

## Funcionalidades

### 1. Análisis de Costos Totales
- Calcula el costo total de cada producto incluyendo:
  - Costos variables específicos del producto
  - Costos adicionales del negocio (empaquetado, etc.)

### 2. Precios Sugeridos por IA
- Genera precios de venta basados en un margen estándar del 20%
- Considera todos los costos para calcular el precio mínimo rentable

### 3. Ajuste de Precios por el Cliente
- Permite editar los precios de venta directamente en la tabla
- Actualiza en tiempo real la rentabilidad y ganancia por producto

### 4. Análisis de Rentabilidad
- Muestra la rentabilidad de cada producto con indicadores visuales
- Verde: ≥30% (Excelente)
- Amarillo: 20-29% (Buena)
- Rojo: <20% (Mejorar)

## Estructura de Archivos

```
src/core/precio-venta/
├── domain/
│   └── models/
│       └── precio-venta.model.ts      # Interfaces del dominio
├── infrastructure/
│   ├── services/
│   │   └── precio-venta.service.ts    # Servicio de API
│   └── ui/
│       └── PrecioVentaPage.tsx        # Componente principal
└── index.ts                           # Exportaciones del módulo
```

## Rutas de API

### Backend
- `GET /api/v1/productos-precio-venta/:negocioId/analisis-completo` - Análisis completo
- `PUT /api/v1/productos-precio-venta/:negocioId/producto/:productoId` - Actualizar precio

### Frontend
- `/precio-venta` - Página principal de la sección

## Integración

Esta sección se integra entre "Costos Variables" y "Análisis de Rentabilidad" en el flujo del simulador, proporcionando un análisis intermedio de precios y rentabilidad antes del análisis final.
