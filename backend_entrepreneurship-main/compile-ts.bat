@echo off
echo Compilando TypeScript...
echo.

echo Verificando sintaxis del servicio...
call npx tsc --noEmit src/simulator/bussiness/services/producto-precio-venta.service.ts

echo.
echo Compilación completada!
echo.
pause
