# Servicios de CategoriaActivoFijo - Documentación Completa

## 📋 **Descripción General**

Se han creado servicios completos para gestionar las categorías de activos fijos en el sistema. Estos servicios proporcionan una API REST completa para operaciones CRUD, búsquedas, estadísticas y análisis por negocio.

## 🏗️ **Arquitectura de Servicios**

### **1. CategoriaActivoFijoService**
Servicio principal que maneja toda la lógica de negocio para las categorías de activos fijos.

### **2. CategoriaActivoFijoController**
Controlador REST que expone los endpoints de la API.

### **3. CategoriaActivoFijoMapper**
Clase utilitaria para transformar datos entre diferentes formatos.

## 🚀 **Endpoints de la API**

### **Operaciones CRUD Básicas**

#### **Crear Categoría**
```http
POST /categorias-activo-fijo
Content-Type: application/json

{
  "nombre": "Equipos de Cocina",
  "descripcion": "Equipos para preparar alimentos",
  "icono": "🍳",
  "color": "#FF6B6B",
  "activo": true
}
```

#### **Obtener Todas las Categorías**
```http
GET /categorias-activo-fijo
```

#### **Obtener Categoría por ID**
```http
GET /categorias-activo-fijo/:id
```

#### **Obtener Categoría por Nombre**
```http
GET /categorias-activo-fijo/nombre/:nombre
```

#### **Actualizar Categoría**
```http
PATCH /categorias-activo-fijo/:id
Content-Type: application/json

{
  "descripcion": "Nueva descripción actualizada"
}
```

#### **Eliminar Categoría**
```http
DELETE /categorias-activo-fijo/:id
```

### **Endpoints Especializados**

#### **Categorías Activas**
```http
GET /categorias-activo-fijo/activas
```

#### **Categorías con Costos Fijos**
```http
GET /categorias-activo-fijo/with-costos
```

#### **Estadísticas Generales**
```http
GET /categorias-activo-fijo/stats
```

#### **Búsqueda por Término**
```http
GET /categorias-activo-fijo/search?q=equipos
```

#### **Cambiar Estado Activo/Inactivo**
```http
PATCH /categorias-activo-fijo/:id/toggle-status
```

### **Endpoints por Negocio**

#### **Categorías de un Negocio Específico**
```http
GET /categorias-activo-fijo/negocio/:negocioId
```

#### **Resumen de Categorías por Negocio**
```http
GET /categorias-activo-fijo/negocio/:negocioId/resumen
```

## 🔧 **Funcionalidades del Servicio**

### **1. Gestión de Categorías**
- ✅ Crear nuevas categorías
- ✅ Actualizar categorías existentes
- ✅ Eliminar categorías (solo si no tienen costos asociados)
- ✅ Cambiar estado activo/inactivo
- ✅ Validación de nombres únicos

### **2. Consultas y Búsquedas**
- ✅ Obtener todas las categorías
- ✅ Filtrar por estado activo
- ✅ Búsqueda por nombre o descripción
- ✅ Búsqueda insensible a mayúsculas/minúsculas
- ✅ Ordenamiento alfabético

### **3. Relaciones con Costos Fijos**
- ✅ Obtener categorías con costos asociados
- ✅ Filtrar por negocio específico
- ✅ Calcular totales y estadísticas
- ✅ Validación de integridad referencial

### **4. Análisis y Estadísticas**
- ✅ Conteo total de categorías
- ✅ Conteo de categorías activas/inactivas
- ✅ Top categorías por cantidad de costos
- ✅ Resumen financiero por negocio
- ✅ Cálculo de porcentajes y totales

### **5. Validaciones de Seguridad**
- ✅ Verificación de existencia de entidades
- ✅ Validación de datos de entrada
- ✅ Prevención de eliminación con dependencias
- ✅ Manejo de errores robusto

## 📊 **Estructura de Respuestas**

### **Respuesta Estándar**
```json
{
  "message": "Mensaje descriptivo de la operación",
  "data": {
    // Datos de la respuesta
  },
  "total": 5
}
```

### **Respuesta con Estadísticas**
```json
{
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "total": 8,
    "activas": 7,
    "inactivas": 1,
    "topCategorias": [
      {
        "categoria_id": 1,
        "nombre": "Equipos de Cocina",
        "icono": "🍳",
        "color": "#FF6B6B",
        "total_costos": 5
      }
    ]
  }
}
```

### **Respuesta por Negocio**
```json
{
  "message": "Categorías del negocio Restaurante ABC obtenidas exitosamente",
  "data": [
    {
      "categoria_id": 1,
      "nombre": "Equipos de Cocina",
      "icono": "🍳",
      "color": "#FF6B6B",
      "total_costos": 3,
      "monto_total": 1500.00
    }
  ],
  "total": 1
}
```

## 🛡️ **Manejo de Errores**

### **Tipos de Errores**
- **NotFoundException**: Entidad no encontrada
- **ConflictException**: Conflicto (ej: nombre duplicado)
- **BadRequestException**: Datos inválidos o error de negocio

### **Ejemplos de Respuestas de Error**
```json
{
  "statusCode": 404,
  "message": "Categoría con ID 999 no encontrada",
  "error": "Not Found"
}
```

```json
{
  "statusCode": 409,
  "message": "Ya existe una categoría con ese nombre",
  "error": "Conflict"
}
```

## 🔍 **Casos de Uso Comunes**

### **1. Configuración Inicial**
```typescript
// Crear categorías predefinidas para un nuevo negocio
const categorias = [
  { nombre: 'Equipos de Cocina', icono: '🍳', color: '#FF6B6B' },
  { nombre: 'Mobiliario', icono: '🪑', color: '#4ECDC4' }
];

for (const categoria of categorias) {
  await categoriaService.create(categoria);
}
```

### **2. Asignación de Categorías**
```typescript
// Asignar categoría a un costo fijo existente
const costoFijo = await prisma.costosFijos.update({
  where: { costo_fijo_id: 1 },
  data: { categoria_id: categoriaId }
});
```

### **3. Análisis por Negocio**
```typescript
// Obtener resumen de costos por categoría para un negocio
const resumen = await categoriaService.getResumenByNegocio(negocioId);
console.log(`Total general: $${resumen.data.total_general}`);
```

### **4. Búsqueda Inteligente**
```typescript
// Buscar categorías relacionadas con equipos
const resultados = await categoriaService.search('equipos');
console.log(`Encontradas ${resultados.total} categorías`);
```

## 📈 **Métricas y Rendimiento**

### **Optimizaciones Implementadas**
- ✅ Consultas optimizadas con Prisma
- ✅ Uso de índices en campos de búsqueda
- ✅ Paginación implícita para grandes volúmenes
- ✅ Caché de consultas frecuentes

### **Monitoreo Recomendado**
- Tiempo de respuesta de endpoints
- Uso de memoria en consultas complejas
- Frecuencia de uso de cada endpoint
- Errores y excepciones

## 🔄 **Integración con Otros Servicios**

### **Servicios Relacionados**
- **CostosFijosService**: Gestión de costos fijos
- **BusinessService**: Información de negocios
- **AnalisisService**: Análisis financieros

### **Flujos de Integración**
1. **Creación de Negocio** → Crear categorías predefinidas
2. **Gestión de Costos** → Asignar categorías automáticamente
3. **Análisis Financiero** → Agrupar costos por categoría
4. **Reportes** → Generar resúmenes categorizados

## 🚀 **Próximas Mejoras**

### **Funcionalidades Planificadas**
- [ ] Caché Redis para consultas frecuentes
- [ ] Paginación avanzada con filtros
- [ ] Exportación a Excel/PDF
- [ ] Historial de cambios
- [ ] Notificaciones de cambios
- [ ] API GraphQL alternativa

### **Optimizaciones Técnicas**
- [ ] Compresión de respuestas
- [ ] Rate limiting por usuario
- [ ] Métricas de rendimiento
- [ ] Logs estructurados
- [ ] Tests de integración

## 📚 **Ejemplos de Uso**

### **Frontend - React**
```typescript
// Hook personalizado para categorías
const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categorias-activo-fijo');
      const data = await response.json();
      setCategorias(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { categorias, loading, fetchCategorias };
};
```

### **Backend - NestJS**
```typescript
// Inyección del servicio en otro controlador
@Controller('costos-fijos')
export class CostosFijosController {
  constructor(
    private readonly costosService: CostosFijosService,
    private readonly categoriaService: CategoriaActivoFijoService
  ) {}

  @Get(':id/with-categoria')
  async findWithCategoria(@Param('id') id: string) {
    const costo = await this.costosService.findById(parseInt(id));
    if (costo.data.categoria_id) {
      const categoria = await this.categoriaService.findById(costo.data.categoria_id);
      return { ...costo, categoria: categoria.data };
    }
    return costo;
  }
}
```

## 🎯 **Conclusión**

Los servicios de `CategoriaActivoFijo` proporcionan una base sólida y completa para la gestión de categorías de activos fijos en el sistema. Con funcionalidades avanzadas de búsqueda, análisis y estadísticas, estos servicios permiten una gestión eficiente y organizada de los costos fijos del negocio.

La implementación sigue las mejores prácticas de NestJS y Prisma, proporcionando una API REST robusta, segura y escalable para todas las operaciones relacionadas con categorías de activos fijos.
