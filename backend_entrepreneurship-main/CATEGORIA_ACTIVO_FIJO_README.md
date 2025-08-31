# CategoriaActivoFijo - Nueva Funcionalidad

## Descripción
Se ha agregado una nueva tabla `CategoriaActivoFijo` al esquema de la base de datos para categorizar mejor los costos fijos del negocio. Esta funcionalidad permite organizar los activos fijos en categorías específicas con iconos y colores para una mejor visualización.

## Cambios Realizados

### 1. Nueva Tabla: CategoriaActivoFijo
- **categoria_id**: Identificador único autoincremental
- **nombre**: Nombre de la categoría (único)
- **descripcion**: Descripción opcional de la categoría
- **icono**: Emoji o símbolo representativo de la categoría
- **color**: Color hexadecimal para la categoría (formato #RRGGBB)
- **activo**: Estado activo/inactivo de la categoría
- **fecha_creacion**: Fecha de creación automática

### 2. Modificación de la Tabla CostosFijos
- Se agregó el campo `categoria_id` como llave foránea opcional
- Se estableció la relación con `CategoriaActivoFijo`
- La relación es opcional, por lo que los costos fijos existentes no se ven afectados

## Archivos Creados/Modificados

### Archivos Modificados:
- `prisma/schema.prisma` - Esquema de Prisma actualizado

### Archivos Creados:
- `prisma/migrations/20250830190331_add_categoria_activo_fijo/migration.sql` - Migración SQL
- `prisma/seed-categorias-activo-fijo.js` - Script de seed con categorías de ejemplo
- `run-categoria-migration.bat` - Script batch para Windows
- `run-categoria-migration.ps1` - Script PowerShell
- `CATEGORIA_ACTIVO_FIJO_README.md` - Este archivo de documentación

## Categorías Predefinidas

El script de seed incluye las siguientes categorías de ejemplo:

1. **Equipos de Cocina** 🍳 - #FF6B6B
2. **Mobiliario** 🪑 - #4ECDC4
3. **Equipos de Refrigeración** ❄️ - #45B7D1
4. **Equipos de Limpieza** 🧹 - #96CEB4
5. **Equipos de Seguridad** 🔒 - #FFEAA7
6. **Equipos de Oficina** 💻 - #DDA0DD
7. **Equipos de Ventilación** 💨 - #98D8C8
8. **Equipos de Iluminación** 💡 - #F7DC6F

## Instalación y Configuración

### Opción 1: Script Automático (Recomendado)
```bash
# En Windows (CMD)
run-categoria-migration.bat

# En Windows (PowerShell)
.\run-categoria-migration.ps1
```

### Opción 2: Comandos Manuales
```bash
# 1. Generar cliente de Prisma
npx prisma generate

# 2. Ejecutar migración
npx prisma migrate deploy

# 3. Ejecutar seed
node prisma/seed-categorias-activo-fijo.js
```

## Uso en el Código

### Crear una nueva categoría:
```typescript
const nuevaCategoria = await prisma.categoriaActivoFijo.create({
  data: {
    nombre: 'Nueva Categoría',
    descripcion: 'Descripción de la categoría',
    icono: '🚀',
    color: '#FF0000',
    activo: true
  }
});
```

### Asignar categoría a un costo fijo:
```typescript
const costoFijo = await prisma.costosFijos.update({
  where: { costo_fijo_id: 1 },
  data: {
    categoria_id: nuevaCategoria.categoria_id
  }
});
```

### Consultar costos fijos con categoría:
```typescript
const costosConCategoria = await prisma.costosFijos.findMany({
  include: {
    CategoriaActivoFijo: true
  }
});
```

## Beneficios

1. **Mejor Organización**: Los costos fijos se pueden agrupar por categorías lógicas
2. **Visualización Mejorada**: Iconos y colores facilitan la identificación rápida
3. **Análisis Categorizado**: Permite análisis financieros por tipo de activo
4. **Flexibilidad**: Los costos existentes no se ven afectados (campo opcional)
5. **Escalabilidad**: Fácil agregar nuevas categorías según las necesidades del negocio

## Notas Importantes

- La migración es segura y no afecta los datos existentes
- El campo `categoria_id` es opcional en `CostosFijos`
- Las categorías tienen nombres únicos para evitar duplicados
- Se incluyen categorías de ejemplo que cubren los casos más comunes
- La relación permite `NULL` para mantener compatibilidad con datos existentes

## Soporte

Para cualquier problema o pregunta sobre esta nueva funcionalidad, revisar:
1. Los logs de la migración
2. El esquema de Prisma actualizado
3. La documentación de Prisma sobre relaciones
