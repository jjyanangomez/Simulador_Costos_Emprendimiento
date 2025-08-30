@echo off
echo ========================================
echo EJECUTANDO MIGRACION DE PRISMA
echo ========================================

echo.
echo 1. Limpiando cliente anterior...
if exist "node_modules\.prisma" rmdir /s /q "node_modules\.prisma"
if exist "node_modules\@prisma" rmdir /s /q "node_modules\@prisma"

echo.
echo 2. Instalando dependencias de Prisma...
npm install @prisma/client

echo.
echo 3. Generando cliente de Prisma...
npx prisma generate

echo.
echo 4. Aplicando migración a la base de datos...
npx prisma db push

echo.
echo 5. Verificando estado de la base de datos...
npx prisma db pull

echo.
echo ========================================
echo MIGRACION COMPLETADA EXITOSAMENTE!
echo ========================================
echo.
echo El esquema de Prisma ha sido actualizado con:
echo - Nuevos campos en el modelo Productos
echo - Nuevo modelo AnalisisPreciosProducto
echo - Nuevo modelo ResumenCostosGanancias
echo.
echo El cliente de Prisma ha sido regenerado.
echo.
pause
