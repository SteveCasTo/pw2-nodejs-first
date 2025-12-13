# 📦 GUÍA DE INSTALACIÓN - FULL STACK

> 💡 **Tip VS Code**: Presiona `Ctrl+Shift+V` (Windows/Linux) o `Cmd+Shift+V` (Mac) para ver este documento con formato preview.

> 📖 **Guía Completa de Configuración:** Ver [CONFIGURATION.md](./CONFIGURATION.md) para instrucciones detalladas de MongoDB Atlas, Gmail y todas las variables de entorno.

Esta guía cubre la instalación completa del proyecto **frontend (React + TypeScript + Vite)** y **backend (Node.js + Express + MongoDB)**.

---

## 🔧 Prerrequisitos

- **Node.js** 20.x - 22.x LTS (requerido)
- **npm** >= 10.x
- **Git**
- **OpenSSL** (para generar certificados SSL)

> ⚠️ **IMPORTANTE**: Este proyecto requiere Node.js 20-22 debido a dependencias nativas (spdy). Node.js 23+ no es compatible.

### Instalar Node.js 20 LTS con nvm y utilizarlo (recomendado)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
nvm alias default 20
```

Verificar instalación:

```bash
node --version  # Debe mostrar v20.x.x
npm --version
git --version
```

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/SteveCasTo/pw2-nodejs-first.git
cd pw2-nodejs-first
```

### 2. Ejecutar el instalador automático (Linux/Mac)

```bash
chmod +x install.sh
./install.sh
```

El instalador realizará automáticamente:
- ✅ Verificación de Node.js 20-22 (bloqueará si usas Node.js 23+)
- ✅ Instalación de dependencias npm del **backend**
- ✅ Instalación de dependencias npm del **frontend**
- ✅ Creación de archivo `backend/.env` desde `.env.example`
- ✅ Creación automática de `frontend/.env` con `VITE_API_URL=http://localhost:3000`
- ✅ Generación obligatoria de certificados SSL (requiere OpenSSL)
- ✅ Verificación de estructura del backend y frontend

---

## ⚙️ Configuración Post-Instalación

### Backend (.env)

**⚠️ Después del instalador, DEBES configurar:**

El instalador creará `backend/.env` con valores de ejemplo. **Debes modificarlo** con tus credenciales reales:

```bash
cd backend
nano .env  # o usa tu editor preferido
```

**Variables obligatorias a configurar:**

| Variable | Descripción | Dónde obtenerla |
|----------|-------------|-----------------|
| `MONGO_URI` | Connection string de MongoDB Atlas | [Guía MongoDB →](./CONFIGURATION.md#-mongodb-atlas) |
| `JWT_SECRET` | Clave secreta para tokens (64+ caracteres aleatorios) | [Generador →](https://randomkeygen.com/) |
| `EMAIL_USER` | Tu correo de Gmail | Tu cuenta |
| `EMAIL_PASSWORD` | Contraseña de aplicación de Gmail (16 caracteres) | [Guía Gmail →](./CONFIGURATION.md#-configuración-de-email-gmail) |

📖 **Guía completa de configuración:** [CONFIGURATION.md](./CONFIGURATION.md)

### Frontend (.env)

El instalador crea automáticamente `frontend/.env` con:

```env
VITE_API_URL=http://localhost:3000
```

**Solo modifica si:**
- Cambias el puerto del backend (diferente a 3000)
- Usas HTTPS: `VITE_API_URL=https://localhost:3001`
- Despliegas en producción: `VITE_API_URL=https://tu-dominio.com`

---

### 3. Cargar datos iniciales

```bash
cd backend
npm run seed
```

Esto crea usuarios de prueba:

| Rol | Email | Password |
|-----|-------|----------|
| Superadmin | admin@sistema.com | Admin123!@# |
| Editor | editor@sistema.com | Editor123!@# |
| Organizador | organizador@sistema.com | Organizador123!@# |
| Estudiante | estudiante@sistema.com | Estudiante123!@# |

### 4. Iniciar los servidores

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

> 🔒 **Nota sobre HTTPS:** Al acceder a `https://localhost:3001` o `https://localhost:3002`, el navegador mostrará advertencia de seguridad porque los certificados son autofirmados. Esto es normal en desarrollo. Haz clic en "Avanzado" → "Continuar al sitio".

---

## 🛠️ Instalación Manual (Windows/MacOS)

Si el instalador automático no funciona en tu sistema, sigue estos pasos:

### Backend

**1. Instalar dependencias**
```bash
cd backend
npm install
```

**2. Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `backend/.env` con tus credenciales. **Guía completa:** [CONFIGURATION.md](./CONFIGURATION.md)

**3. Generar certificados SSL**
```bash
cd certs

# Windows (Git Bash o WSL)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes -subj "/C=XX/ST=Dev/L=Local/O=DevTeam/OU=Development/CN=localhost"

# MacOS/Linux
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes -subj "/C=XX/ST=Dev/L=Local/O=DevTeam/OU=Development/CN=localhost"

cd ..
```

**4. Cargar datos iniciales**
```bash
npm run seed
```

**5. Iniciar servidor**
```bash
npm run dev
```

### Frontend

**1. Instalar dependencias**
```bash
cd frontend
npm install
```

**2. Configurar variables de entorno**

El frontend funciona con valores por defecto. Solo crea `.env` si necesitas cambiar la URL del backend:

```bash
VITE_API_URL=http://localhost:3000
```

**3. Iniciar servidor de desarrollo**
```bash
npm run dev
```

**4. Acceder a la aplicación**

Abre tu navegador en: **http://localhost:5173**

---

## 📋 Usuarios de Prueba

Después de ejecutar `npm run seed`, tendrás estos usuarios:

| Rol | Email | Password |
|-----|-------|----------|
| **Superadmin** | admin@sistema.com | Admin123!@# |
| **Editor** | editor@sistema.com | Editor123!@# |
| **Organizador** | organizador@sistema.com | Organizador123!@# |
| **Estudiante** | estudiante@sistema.com | Estudiante123!@# |

---

## 🧪 Probar Endpoints

Consulta `docs/PRUEBAS.md` para la guía completa de endpoints.

**Ejemplo rápido - Health Check:**

```bash
curl http://localhost:3000/health
```

**Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo_electronico":"admin@sistema.com","password":"Admin123!@#"}'
```

---

## 🐳 Ejecución con Docker

Docker Compose levanta **frontend y backend** simultáneamente con hot-reload habilitado.

### Iniciar servicios

```bash
# Desde la raíz del proyecto
docker-compose up --build

# Modo detached (background)
docker-compose up -d
```

### Servicios disponibles

- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3000 (HTTP)
- **Backend**: https://localhost:3001 (HTTPS)
- **Backend**: https://localhost:3002 (HTTP/2)

### Ver logs

```bash
# Todos los servicios
docker-compose logs -f

# Solo frontend
docker-compose logs -f frontend

# Solo backend
docker-compose logs -f backend
```

### Detener contenedores

```bash
docker-compose down

# Eliminar volúmenes también
docker-compose down -v
```

### Rebuilding después de cambios

```bash
# Rebuild solo si cambiaron dependencias (package.json)
docker-compose up --build

# Forzar rebuild completo
docker-compose build --no-cache
docker-compose up
```

> 💡 **Hot Reload:** Los cambios en código fuente se reflejan automáticamente sin necesidad de rebuilding (tanto frontend como backend).

---

## 🆘 Solución de Problemas

### Frontend

#### Error: CORS policy - No 'Access-Control-Allow-Origin'

**Causa:** El backend no está configurado para permitir peticiones desde el frontend.

**Solución:**
1. Verifica que el backend esté corriendo en el puerto correcto (3000)
2. Revisa `backend/src/app.ts` que incluya `http://localhost:5173` en CORS
3. Si cambiaste el puerto del frontend, actualiza CORS en el backend

#### Login redirige de vuelta al login (Firefox)

**Causa:** Firefox Enhanced Tracking Protection bloqueando localStorage.

**Solución:**
1. Abre DevTools con **F12**
2. Ve a la pestaña **Console**
3. Busca mensajes de error con emojis (🔍 ✅ ❌)
4. Prueba localStorage manualmente:
   ```javascript
   localStorage.setItem('test', 'firefox');
   localStorage.getItem('test');
   ```
5. Si da error, ve a `about:preferences#privacy`
6. Cambia "Enhanced Tracking Protection" de **"Strict"** a **"Standard"**
7. O agrega `localhost` a las excepciones
8. Reinicia Firefox y prueba nuevamente

#### Vite no inicia - Error: EADDRINUSE

**Causa:** El puerto 5173 ya está en uso.

**Solución:**
```bash
# Cambiar puerto en vite.config.ts
export default defineConfig({
  server: {
    port: 5174  // Cambiar a otro puerto
  }
})
```

O matar el proceso que usa el puerto:
```bash
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

### Backend

#### Error: MongoServerError: Authentication failed

**Causa:** Usuario o contraseña incorrectos en `MONGO_URI`.

**Solución:**
1. Verifica que el usuario y contraseña sean correctos
2. Asegúrate de que el usuario tenga permisos de lectura/escritura
3. Si la contraseña tiene caracteres especiales (`@`, `#`, `$`, etc.), codifícalos:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`

#### Error: MongoServerError: IP not whitelisted

**Causa:** Tu IP no está permitida en MongoDB Atlas.

**Solución:**
1. Ve a "Network Access" en MongoDB Atlas
2. Agrega `0.0.0.0/0` para permitir todas las IPs (desarrollo)

#### Error: Invalid login credentials (Email)

**Causa:** Contraseña de aplicación incorrecta o verificación en 2 pasos no activada.

**Solución:**
1. Verifica que tengas la verificación en 2 pasos activada
2. Genera una nueva contraseña de aplicación
3. Asegúrate de copiar los 16 caracteres completos

#### Error: EADDRINUSE - Puerto en uso

**Causa:** Ya hay un proceso usando el puerto 3000, 3001 o 3002.

**Solución:**
```bash
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

O cambiar los puertos en `backend/.env`:
```env
PORT=3003
PORT_HTTPS=3004
PORT_HTTP2=3005
```

### Docker

#### Error: Cannot connect to Docker daemon

**Causa:** Docker Desktop no está corriendo.

**Solución:**
1. Inicia Docker Desktop
2. Espera que aparezca "Docker Engine running" en el icono de la bandeja
3. Vuelve a ejecutar `docker-compose up`

#### Error: port is already allocated

**Causa:** Los puertos 3000 o 5173 ya están en uso en tu sistema.

**Solución:**
1. Cambia los puertos en `docker-compose.yml`:
   ```yaml
   frontend:
     ports:
       - "5174:5173"  # Cambiar puerto externo
   
   backend:
     ports:
       - "3003:3000"  # Cambiar puerto externo
   ```
2. Actualiza `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:3003
   ```

---