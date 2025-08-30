@echo off
echo Ejecutando migración de Prisma...
echo.

echo Limpiando cliente anterior...
if exist node_modules\.prisma rmdir /s /q node_modules\.prisma

echo Generando cliente de Prisma...
call npx prisma generate

echo.
echo Aplicando cambios a la base de datos...
call npx prisma db push --accept-data-loss

echo.
echo Migración completada exitosamente!
echo.
pause
