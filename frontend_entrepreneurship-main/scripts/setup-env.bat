@echo off
echo 🔧 Configurando variables de entorno para el Frontend...

REM Crear archivo .env si no existe
if not exist ".env" (
    echo 📝 Creando archivo .env...
    (
        echo VITE_API_BASE_URL=http://localhost:3000/api/v1
        echo VITE_APP_TITLE=Simulador de Emprendimientos
    ) > .env
    echo ✅ Archivo .env creado exitosamente
) else (
    echo ✅ Archivo .env ya existe
)

REM Verificar contenido del archivo
echo 📋 Contenido del archivo .env:
type .env

echo.
echo 🚀 Para aplicar los cambios:
echo 1. Detener el servidor (Ctrl+C)
echo 2. Reiniciar: npm run dev
echo.
echo 🌐 URLs configuradas:
echo - Frontend: http://localhost:5173
echo - Backend: http://localhost:3000
echo - API Base: http://localhost:3000/api/v1

pause
