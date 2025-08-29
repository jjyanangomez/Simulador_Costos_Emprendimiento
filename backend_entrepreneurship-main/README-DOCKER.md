# 🐳 Docker - Backend Simulador de Emprendimientos

## 🪟 Para Usuarios de Windows

Si estás en Windows, usa el script de PowerShell:

```powershell
# Ejecutar script de inicio para Windows
.\start-backend.ps1
```

O sigue la guía paso a paso manual:

```powershell
# 1. Verificar Docker Desktop esté ejecutándose
docker --version

# 2. Crear archivo .env
copy env.example .env

# 3. Instalar dependencias y compilar
npm install
npm run build

# 4. Iniciar contenedores
docker-compose up --build -d

# 5. Ver logs
docker-compose logs -f
```

---

## 📋 Índice

- [Requisitos Previos](#requisitos-previos)
- [Guía Paso a Paso](#guía-paso-a-paso)
- [Verificación de Funcionamiento](#verificación-de-funcionamiento)
- [Servicios Incluidos](#servicios-incluidos)
- [Configuración](#configuración)
- [Comandos Útiles](#comandos-útiles)
- [Troubleshooting](#troubleshooting)
- [Limpieza](#limpieza)

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Docker Desktop** (Windows/Mac) o **Docker Engine** (Linux)
- **Docker Compose** (incluido en Docker Desktop)
- **Node.js** (versión 18 o superior)
- **npm** (incluido con Node.js)
- **Git** (para clonar el repositorio)

### Verificar Instalación
```bash
# Verificar Docker
docker --version

# Verificar Docker Compose
docker-compose --version

# Verificar Node.js
node --version

# Verificar npm
npm --version
```

## 🚀 Guía Paso a Paso

### Paso 1: Preparar el Entorno

```bash
# 1. Navegar al directorio del proyecto
cd Backend

# 2. Verificar que estés en el directorio correcto
ls -la
# Deberías ver: Dockerfile, docker-compose.yml, package.json, etc.
```

### Paso 2: Crear Archivo de Variables de Entorno

```bash
# 3. Crear archivo .env desde el ejemplo
cp env.example .env

# 4. Verificar que se creó correctamente
ls -la .env
```

### Paso 3: Instalar Dependencias

```bash
# 5. Instalar todas las dependencias de Node.js
npm install

# 6. Verificar que las dependencias se instalaron correctamente
ls -la node_modules
```

### Paso 4: Compilar la Aplicación

```bash
# 7. Compilar el proyecto TypeScript a JavaScript
npm run build

# 8. Verificar que se creó la carpeta dist
ls -la dist/
# Deberías ver: dist/src/main.js, dist/src/app.module.js, etc.
```

### Paso 5: Verificar Configuración

```bash
# 9. Ejecutar verificación de configuración
./scripts/quick-check.sh

# Si no tienes permisos de ejecución:
chmod +x scripts/*.sh
./scripts/quick-check.sh
```

**Resultado esperado:**
```
🔍 [QUICK-CHECK] Verificando configuración del backend...
✅ [QUICK-CHECK] Docker encontrado
✅ [QUICK-CHECK] Docker Compose encontrado
✅ [QUICK-CHECK] Node.js encontrado
✅ [QUICK-CHECK] npm encontrado
✅ [QUICK-CHECK] Todos los archivos necesarios están presentes
✅ [QUICK-CHECK] Archivo .env encontrado
✅ [QUICK-CHECK] Dependencias instaladas
✅ [QUICK-CHECK] Aplicación compilada
✅ [QUICK-CHECK] Permisos de scripts configurados
✅ [QUICK-CHECK] Puerto 3000 disponible
✅ [QUICK-CHECK] Puerto 5432 disponible
✅ [QUICK-CHECK] Puerto 5050 disponible
🎉 [QUICK-CHECK] Verificación completada exitosamente
```

### Paso 6: Detener Contenedores Existentes (si los hay)

```bash
# 10. Detener cualquier contenedor que pueda estar ejecutándose
docker-compose down --remove-orphans

# 11. Verificar que no hay contenedores ejecutándose
docker-compose ps
```

### Paso 7: Construir e Iniciar los Contenedores

```bash
# 12. Construir e iniciar todos los servicios
docker-compose up --build -d

# 13. Verificar que los contenedores se están ejecutando
docker-compose ps
```

**Resultado esperado:**
```
Name                    Command               State           Ports
--------------------------------------------------------------------------------
krakedev_backend       ./scripts/init.sh                    Up      0.0.0.0:3000->3000/tcp
krakedev_pgadmin       /entrypoint.sh                       Up      0.0.0.0:5050->80/tcp
krakedev_postgres      docker-entrypoint.sh postgres       Up      0.0.0.0:5432->5432/tcp
```

### Paso 8: Esperar a que los Servicios Estén Listos

```bash
# 14. Ver logs para monitorear el progreso
docker-compose logs -f

# Esperar hasta ver mensajes como:
# ✅ [INIT] Base de datos lista
# ✅ [INIT] Seed completado
# 🚀 [INIT] Iniciando aplicación...
```

**⏱️ Tiempo estimado:** 2-3 minutos para la primera ejecución

### Paso 9: Verificar Funcionamiento

```bash
# 15. Verificar que todos los servicios estén funcionando
docker-compose ps

# 16. Probar la API
curl http://localhost:3000/api/v1/

# 17. Verificar Swagger
curl http://localhost:3000/api/docs
```

## ✅ Verificación de Funcionamiento

### Verificación Automática

```bash
# Ejecutar script de verificación de salud
./scripts/health-check.sh
```

### Verificación Manual

| Servicio | URL | Estado Esperado |
|----------|-----|-----------------|
| **Backend API** | `http://localhost:3000/api/v1/` | Respuesta JSON |
| **Swagger Docs** | `http://localhost:3000/api/docs` | Documentación API |
| **pgAdmin** | `http://localhost:5050` | Interfaz web |

### Credenciales pgAdmin

- **Email:** `admin@krakedev.com`
- **Password:** `admin123`

## 📋 Servicios Incluidos

| Servicio | Puerto | Descripción | URL |
|----------|--------|-------------|-----|
| **Backend** | 3000 | API NestJS | `http://localhost:3000` |
| **PostgreSQL** | 5432 | Base de datos | `localhost:5432` |
| **pgAdmin** | 5050 | Gestión de BD | `http://localhost:5050` |

## 🔧 Configuración

### Variables de Entorno
El archivo `.env` se crea automáticamente desde `env.example` con valores por defecto:

```bash
# Base de datos
DATABASE_URL="postgresql://postgres:admin123@postgres:5432/simulador_emprendimientos?schema=public"
POSTGRES_PASSWORD=admin123

# API Keys
API_KEY="tu-api-key-de-google-ai"

# JWT
JWT_SECRET="your-secret-key-change-in-production"
```

### Personalización
Edita el archivo `.env` para cambiar configuraciones:
```bash
nano .env
```

## 📜 Comandos Útiles

### Gestión de Servicios
```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f
```

### Gestión de Base de Datos
```bash
# Ejecutar migraciones manualmente
docker exec krakedev_backend npx prisma migrate deploy

# Ejecutar seed manualmente
docker exec krakedev_backend npm run seed

# Acceder a PostgreSQL
docker exec -it krakedev_postgres psql -U postgres -d simulador_emprendimientos

# Backup de base de datos
docker exec krakedev_postgres pg_dump -U postgres simulador_emprendimientos > backup.sql
```

### Desarrollo
```bash
# Entrar al contenedor del backend
docker exec -it krakedev_backend sh

# Ver logs específicos
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f pgadmin
```

## 🔍 Verificación de Salud

### Endpoints de Verificación
- **API Principal**: `http://localhost:3000/api/v1/`
- **Documentación Swagger**: `http://localhost:3000/api/docs`
- **pgAdmin**: `http://localhost:5050`

### Script de Verificación
```bash
# Verificar que todo esté funcionando
./scripts/health-check.sh
```

## 🛠️ Troubleshooting

### Problemas Comunes

#### 1. Error de conexión a la base de datos
```bash
# Verificar que PostgreSQL esté ejecutándose
docker-compose ps

# Ver logs de PostgreSQL
docker-compose logs postgres

# Verificar conectividad
docker exec krakedev_backend nc -z postgres 5432
```

#### 2. Puerto ya en uso
```bash
# Verificar puertos en uso
netstat -tulpn | grep :3000

# Cambiar puerto en .env
BACKEND_PORT=3001
```

#### 3. Error de permisos en scripts
```bash
# Hacer scripts ejecutables
chmod +x scripts/*.sh
```

#### 4. Error de memoria
```bash
# Aumentar memoria de Docker
# En Docker Desktop: Settings > Resources > Memory
```

#### 5. Error de compilación
```bash
# Limpiar y reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 6. Error de dependencias
```bash
# Verificar versión de Node.js
node --version

# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules
npm install
```

### Logs y Debugging
```bash
# Ver logs del backend
docker-compose logs -f backend

# Ver logs de PostgreSQL
docker-compose logs -f postgres

# Ver logs de pgAdmin
docker-compose logs -f pgadmin

# Entrar al contenedor del backend
docker exec -it krakedev_backend sh

# Verificar estado de servicios
docker-compose ps
```

## 🧹 Limpieza

### Limpieza Completa
```bash
# Detener y eliminar todo
docker-compose down --volumes --remove-orphans

# Limpiar imágenes no utilizadas
docker image prune -f

# Limpiar volúmenes no utilizados
docker volume prune -f

# Limpiar dependencias locales
rm -rf node_modules dist
```

### Limpieza Selectiva
```bash
# Solo detener contenedores
docker-compose down

# Detener y eliminar imágenes
docker-compose down --rmi all

# Detener y eliminar volúmenes
docker-compose down --volumes
```

## 📊 Monitoreo

### Métricas de Contenedores
```bash
# Ver uso de recursos
docker stats

# Ver información detallada
docker inspect krakedev_backend

# Ver logs en tiempo real
docker-compose logs -f --tail=100
```

## 🔒 Seguridad

### Buenas Prácticas
1. **Cambiar contraseñas por defecto** en `.env`
2. **Usar secrets** para API keys en producción
3. **Limitar acceso** a pgAdmin
4. **Usar redes Docker** para aislamiento
5. **Ejecutar como usuario no-root**

### Verificación de Seguridad
```bash
# Verificar usuario del contenedor
docker exec krakedev_backend whoami

# Verificar permisos
docker exec krakedev_backend ls -la

# Verificar variables de entorno
docker exec krakedev_backend env | grep -E "(API_KEY|JWT_SECRET)"
```

## 📝 Notas Importantes

1. **Primera ejecución**: El seed se ejecuta automáticamente
2. **Persistencia**: Los datos se guardan en volúmenes Docker
3. **Logs**: Se muestran en tiempo real con emojis
4. **Health checks**: Verificación automática de servicios
5. **Migraciones**: Se ejecutan automáticamente al iniciar
6. **Compilación**: Se requiere antes de ejecutar Docker

## 🆘 Soporte

Si encuentras problemas:

1. Ejecuta verificación: `./scripts/quick-check.sh`
2. Verifica los logs: `docker-compose logs -f`
3. Ejecuta health check: `./scripts/health-check.sh`
4. Revisa la configuración en `.env`
5. Limpia y reconstruye: `docker-compose down && docker-compose up --build -d`

## 🎯 Comandos de Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Compilar aplicación
npm run build

# 3. Verificar configuración
./scripts/quick-check.sh

# 4. Iniciar servicios
docker-compose up --build -d

# 5. Ver logs
docker-compose logs -f

# 6. Verificar funcionamiento
curl http://localhost:3000/api/v1/

# 7. Abrir Swagger
open http://localhost:3000/api/docs
```

## 🎉 ¡Listo!

Una vez completados todos los pasos, tendrás:

- ✅ **Backend API** funcionando en `http://localhost:3000`
- ✅ **Base de datos PostgreSQL** con datos de prueba
- ✅ **pgAdmin** para gestión de base de datos
- ✅ **Documentación Swagger** completa
- ✅ **Datos de prueba** incluidos automáticamente

¡Tu backend está completamente dockerizado y listo para usar!
