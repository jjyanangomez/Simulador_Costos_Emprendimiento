@echo off
echo ========================================
echo Ejecutando migracion de CategoriaActivoFijo
echo ========================================

echo.
echo 1. Generando cliente de Prisma...
npx prisma generate

echo.
echo 2. Ejecutando migracion...
npx prisma migrate deploy

echo.
echo 3. Ejecutando seed de categorias...
node prisma/seed-categorias-activo-fijo.js

echo.
echo ========================================
echo Migracion completada exitosamente!
echo ========================================
pause
