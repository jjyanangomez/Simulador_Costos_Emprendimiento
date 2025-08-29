# Backend Docker - Guía de Uso

## 🚀 Correcciones Implementadas

Se han corregido los siguientes problemas en el Dockerfile:

### ✅ Problemas Solucionados

1. **Dependencias faltantes**: Se agregó `bash` y `netcat-openbsd` para el script de inicialización
2. **Optimización de caché**: Mejor orden de copia de archivos para aprovechar la caché de Docker
3. **Seguridad**: Usuario no-root para ejecutar la aplicación
4. **Manejo de errores**: Script de inicialización mejorado con mejor manejo de errores
5. **Espera de base de datos**: El script espera a que la base de datos esté disponible
6. **Limpieza**: Eliminación de dependencias de desarrollo después de la compilación

## 📋 Archivos Creados/Modificados

- `Dockerfile` - Corregido y optimizado
- `scripts/init.sh` - Mejorado con mejor manejo de errores
- `.dockerignore` - Para optimizar la construcción
- `env.example` - Ejemplo de variables de entorno
- `build-and-run.sh` - Script para Linux/Mac
- `build-and-run.ps1` - Script para Windows PowerShell

## 🔧 Cómo Usar

### Opción 1: Usando Docker Compose (Recomendado)

```bash
# Desde el directorio raíz del proyecto
docker-compose up --build backend
```

### Opción 2: Construcción Manual

#### En Windows (PowerShell):
```powershell
cd Backend
.\build-and-run.ps1
```

#### En Linux/Mac:
```bash
cd Backend
chmod +x build-and-run.sh
./build-and-run.sh
```

#### Manual:
```bash
cd Backend
docker build -t backend-simulador .
docker run -d --name backend-simulador -p 3000:3000 backend-simulador
```

## ⚙️ Variables de Entorno

Copia `env.example` a `.env` y configura las variables:

```bash
cp env.example .env
```

Variables importantes:
- `DATABASE_URL` - URL de conexión a PostgreSQL (ej: postgresql://postgres:admin123@localhost:5432/simulador_emprendimientos?schema=public)
- `API_KEY` - Clave de API de Google AI
- `PORT` - Puerto del servidor (default: 3000)

## 🔍 Verificación

Para verificar que el backend está funcionando:

```bash
# Ver logs
docker logs -f backend-simulador

# Verificar conectividad
curl http://localhost:3000/health

# Verificar estado del contenedor
docker ps
```

## 🐛 Solución de Problemas

### Error: "No se pudo conectar a la base de datos"
- Verifica que PostgreSQL esté ejecutándose
- Verifica la URL de conexión en `DATABASE_URL`
- Asegúrate de que el contenedor de PostgreSQL esté en la misma red

### Error: "Permission denied" en scripts
- En Windows: Ejecuta PowerShell como administrador
- En Linux/Mac: `chmod +x scripts/init.sh`

### Error: "Module not found"
- Verifica que todas las dependencias estén instaladas
- Reconstruye la imagen: `docker build --no-cache -t backend-simulador .`

## 📝 Notas Importantes

1. El backend espera a que PostgreSQL esté disponible antes de iniciar
2. Las migraciones se ejecutan automáticamente al iniciar
3. El seed de datos se ejecuta si está disponible
4. La aplicación se ejecuta en modo producción por defecto
5. Los logs se muestran en tiempo real para debugging
