@echo off
echo Compilando solo el servicio...
echo.

echo Verificando sintaxis del servicio...
call npx tsc --noEmit src/simulator/bussiness/services/producto-precio-venta.service.ts

echo.
echo Compilación del servicio completada!
echo.
pause
