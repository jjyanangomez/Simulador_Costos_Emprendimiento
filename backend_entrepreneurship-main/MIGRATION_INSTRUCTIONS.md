# 🚀 Instrucciones para Aplicar la Migración de Precio de Venta

## 📋 Cambios Realizados

Se han agregado los siguientes modelos y campos al schema de Prisma:

### 1. **Modelo Productos (Actualizado)**
- `precio_venta_cliente` - Precio establecido por el cliente
- `precio_venta_sugerido_ia` - Precio sugerido por IA
- `margen_ganancia_ia` - Margen sugerido por IA (%)
- `margen_ganancia_real` - Margen real del cliente (%)
- `ganancia_por_unidad` - Ganancia calculada por unidad
- `costo_total_producto` - Costo total del producto

### 2. **Nuevo Modelo: AnalisisPreciosProducto**
- Análisis detallado de precios por producto
- Costos desglosados (materia prima, mano de obra, adicionales)
- Comparación entre precios sugeridos y del cliente
- Métricas de rentabilidad por producto

### 3. **Nuevo Modelo: ResumenCostosGanancias**
- Resumen general de costos y ganancias del negocio
- Métricas de rentabilidad total
- Análisis de productos más y menos rentables

## 🔧 Pasos para Aplicar la Migración

### Opción 1: Usar el Script Automático
```bash
# En Windows (PowerShell)
.\run-migration.ps1

# En Windows (CMD)
run-migration.bat
```

### Opción 2: Comandos Manuales
```bash
# 1. Generar el cliente de Prisma
npx prisma generate

# 2. Aplicar la migración a la base de datos
npx prisma migrate deploy

# 3. Verificar el estado
npx prisma migrate status
```

### Opción 3: Ejecutar SQL Directamente
Si prefieres ejecutar el SQL directamente en tu base de datos PostgreSQL:

1. Abre tu cliente de base de datos (pgAdmin, DBeaver, etc.)
2. Ejecuta el contenido del archivo: `prisma/migrations/20250830133255_add_precio_venta_models/migration.sql`

## ✅ Verificación

Después de aplicar la migración, verifica que:

1. **Los nuevos campos** estén en la tabla `Productos`
2. **Las nuevas tablas** se hayan creado:
   - `AnalisisPreciosProducto`
   - `ResumenCostosGanancias`
3. **Las relaciones** estén correctamente establecidas

## 🐛 Solución de Problemas

### Error: "Cannot find module 'prisma'"
```bash
npm install prisma --save-dev
```

### Error: "Database connection failed"
Verifica que tu variable de entorno `DATABASE_URL` esté configurada correctamente en `.env`

### Error: "Permission denied"
En Windows, ejecuta PowerShell como Administrador o cambia la política de ejecución:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📊 Uso de los Nuevos Modelos

### Ejemplo de Consulta para Productos con Precios:
```sql
SELECT 
  p.nombre_producto,
  p.costo_total_producto,
  p.precio_venta_sugerido_ia,
  p.precio_venta_cliente,
  p.ganancia_por_unidad,
  p.margen_ganancia_real
FROM "Productos" p
WHERE p.negocio_id = 1;
```

### Ejemplo de Consulta para Resumen de Ganancias:
```sql
SELECT 
  rcg.costo_total_general,
  rcg.ganancia_total_real,
  rcg.rentabilidad_total_negocio,
  rcg.producto_mas_rentable
FROM "ResumenCostosGanancias" rcg
WHERE rcg.negocio_id = 1;
```

## 🎯 Próximos Pasos

1. **Aplicar la migración** usando uno de los métodos anteriores
2. **Actualizar el frontend** para usar los nuevos campos
3. **Implementar la lógica** de cálculo de precios sugeridos por IA
4. **Crear endpoints** en el backend para manejar los nuevos modelos

---

**Nota**: Esta migración es compatible con el schema existente y no afecta la funcionalidad actual.
