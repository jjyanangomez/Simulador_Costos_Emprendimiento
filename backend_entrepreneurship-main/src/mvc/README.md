# Arquitectura MVC - Simulador de Emprendimientos

## Estructura del Proyecto

La aplicación ha sido migrada a una arquitectura MVC (Model-View-Controller) siguiendo las mejores prácticas de NestJS.

### 📁 Estructura de Carpetas

```
src/mvc/
├── controllers/          # Controladores (C)
│   ├── ai.controller.ts
│   ├── business.controller.ts
│   ├── learning.controller.ts
│   ├── size.controller.ts
│   ├── module.controller.ts
│   ├── status.controller.ts
│   ├── financial-record.controller.ts
│   └── analysis_ai.controller.ts
├── services/            # Servicios de Lógica de Negocio
│   ├── ai.service.ts
│   ├── business.service.ts
│   ├── learning.service.ts
│   ├── size.service.ts
│   ├── module.service.ts
│   ├── status.service.ts
│   ├── financial-record.service.ts
│   └── analysis_ai.service.ts
├── models/              # Modelos (M)
│   ├── dto/            # Data Transfer Objects
│   ├── entities/       # Entidades de dominio
│   └── mappers/        # Mappers para conversión de datos
└── views/              # Vistas (V) - Para futuras implementaciones
```

## 🎯 Principios de la Arquitectura MVC

### Controllers (Controladores)
- **Responsabilidad**: Manejar las peticiones HTTP y respuestas
- **Ubicación**: `src/mvc/controllers/`
- **Funciones**:
  - Validar datos de entrada
  - Llamar a los servicios correspondientes
  - Formatear respuestas
  - Manejar errores HTTP

### Services (Servicios)
- **Responsabilidad**: Contener la lógica de negocio
- **Ubicación**: `src/mvc/services/`
- **Funciones**:
  - Implementar reglas de negocio
  - Interactuar con la base de datos
  - Procesar datos
  - Coordinar operaciones complejas

### Models (Modelos)
- **Responsabilidad**: Representar la estructura de datos
- **Ubicación**: `src/mvc/models/`
- **Componentes**:
  - **DTOs**: Objetos de transferencia de datos
  - **Entities**: Entidades de dominio
  - **Mappers**: Conversores entre capas de datos

## 🔧 Configuración

### Módulo Principal
El módulo `MvcModule` en `src/mvc/mvc.module.ts` centraliza todos los controladores, servicios y mappers.

### Configuración en AppModule
```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MvcModule, // Módulo MVC principal
  ],
})
export class AppModule {}
```

## 📋 APIs Disponibles

### AI
- `POST /api/v1/ai/analizar` - Analizar prompts con IA

### Business (Negocios)
- `POST /api/v1/negocios` - Crear negocio
- `GET /api/v1/negocios` - Listar todos los negocios
- `GET /api/v1/negocios/:id` - Obtener negocio por ID
- `GET /api/v1/negocios/usuario/:usuarioId` - Negocios por usuario
- `PUT /api/v1/negocios/:id` - Actualizar negocio
- `DELETE /api/v1/negocios/:id` - Eliminar negocio

### Learning (Aprendizaje)
- `POST /api/v1/learning` - Crear ruta de aprendizaje
- `GET /api/v1/learning` - Listar rutas de aprendizaje
- `GET /api/v1/learning/:id` - Obtener ruta por ID
- `PUT /api/v1/learning/:id` - Actualizar ruta
- `DELETE /api/v1/learning/:id` - Eliminar ruta

### Size (Tamaños)
- `POST /api/v1/sizes` - Crear tamaño de negocio
- `GET /api/v1/sizes` - Listar tamaños
- `GET /api/v1/sizes/:id` - Obtener tamaño por ID
- `PUT /api/v1/sizes/:id` - Actualizar tamaño
- `DELETE /api/v1/sizes/:id` - Eliminar tamaño

### Module (Módulos)
- `POST /api/v1/modules` - Crear módulo
- `GET /api/v1/modules` - Listar módulos
- `GET /api/v1/modules/:id` - Obtener módulo por ID
- `PUT /api/v1/modules/:id` - Actualizar módulo
- `DELETE /api/v1/modules/:id` - Eliminar módulo

### Status (Estados)
- `POST /api/v1/statuses` - Crear estado
- `GET /api/v1/statuses` - Listar estados
- `GET /api/v1/statuses/:id` - Obtener estado por ID
- `PUT /api/v1/statuses/:id` - Actualizar estado
- `DELETE /api/v1/statuses/:id` - Eliminar estado

### Financial Records (Registros Financieros)
- `POST /api/v1/financial-records` - Crear registro financiero
- `GET /api/v1/financial-records` - Listar registros
- `GET /api/v1/financial-records/:id` - Obtener registro por ID
- `PUT /api/v1/financial-records/:id` - Actualizar registro
- `DELETE /api/v1/financial-records/:id` - Eliminar registro

### Analysis AI (Análisis IA)
- `POST /api/v1/analisis-ia` - Crear análisis de IA
- `GET /api/v1/analisis-ia` - Listar análisis
- `GET /api/v1/analisis-ia/:id` - Obtener análisis por ID
- `PATCH /api/v1/analisis-ia/:id` - Actualizar análisis
- `DELETE /api/v1/analisis-ia/:id` - Eliminar análisis

## 🚀 Beneficios de la Migración

1. **Separación de Responsabilidades**: Cada componente tiene una responsabilidad clara
2. **Mantenibilidad**: Código más fácil de mantener y modificar
3. **Escalabilidad**: Estructura preparada para crecimiento
4. **Testabilidad**: Componentes aislados más fáciles de probar
5. **Reutilización**: Servicios pueden ser reutilizados por múltiples controladores

## 📝 Notas de Migración

- Todos los módulos originales han sido migrados a la nueva estructura
- Las rutas de importación han sido actualizadas automáticamente
- La funcionalidad existente se mantiene intacta
- Swagger documentation está disponible en `/api/docs`

## 🔄 Próximos Pasos

1. Implementar vistas para interfaz de usuario
2. Agregar validaciones adicionales
3. Implementar autenticación y autorización
4. Agregar logging y monitoreo
5. Optimizar consultas de base de datos
