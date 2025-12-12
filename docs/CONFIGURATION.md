# ⚙️ GUÍA DE CONFIGURACIÓN - FULL STACK

> 💡 **Tip VS Code**: Presiona `Ctrl+Shift+V` (Windows/Linux) o `Cmd+Shift+V` (Mac) para ver este documento con formato preview.

Esta guía explica cómo configurar todas las variables de entorno necesarias para el proyecto **frontend y backend**.

---

## 📋 Resumen de Configuración

El proyecto tiene **dos archivos de configuración**:

1. **`backend/.env`** - Configuración del servidor (MongoDB, JWT, Email, puertos)
2. **`frontend/.env`** - Configuración del cliente (URL del backend)

---

## 🎨 Configuración del Frontend

### Variables de Entorno

**Archivo:** `frontend/.env`

```env
# URL del backend API
VITE_API_URL=http://localhost:3000
```

### Descripción de Variables

| Variable | Valor por Defecto | Descripción |
|----------|-------------------|-------------|
| `VITE_API_URL` | `http://localhost:3000` | URL del servidor backend |

**Cuándo cambiar:**
- ✅ Si cambias el puerto del backend (ej: 3003)
- ✅ Si usas HTTPS: `https://localhost:3001`
- ✅ En producción: `https://api.tudominio.com`

> 🔴 **IMPORTANTE:** En Vite, todas las variables deben empezar con `VITE_` para ser accesibles en el código del cliente.

**Ejemplo de uso en código:**

```typescript
// src/services/api.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});
```

---

## 🔧 Configuración del Backend

Esta guía explica cómo configurar todas las variables de entorno necesarias para el backend.

---

## 📋 Variables de Entorno

El archivo `.env` contiene la configuración del servidor. Cada variable se explica a continuación:

### 🌍 Entorno de Ejecución

```env
NODE_ENV=development
```

**Descripción:** Define el entorno en el que se ejecuta la aplicación.
- `development` - Modo desarrollo (logs detallados, recarga automática)
- `production` - Modo producción (optimizado, sin logs sensibles)

---

### 🔌 Puertos del Servidor

```env
PORT=3000
PORT_HTTPS=3001
PORT_HTTP2=3002
```

**Descripción:** Puertos en los que correrán los 3 servidores simultáneos.
- `PORT` - Servidor HTTP estándar (sin cifrado)
- `PORT_HTTPS` - Servidor HTTPS con SSL/TLS (HTTP/1.1 cifrado)
- `PORT_HTTP2` - Servidor HTTP/2 con SSL/TLS (protocolo moderno, más rápido)

**Cuándo cambiar:** Solo si tienes conflictos de puertos con otros servicios. Recuerda actualizar también en `docker-compose.yml` si usas Docker.

---

## 🗄️ MongoDB Atlas

### Paso 1: Crear Cuenta en MongoDB Atlas

1. Ve a [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Crea una cuenta gratuita (no requiere tarjeta de crédito)
3. Verifica tu correo electrónico

### Paso 2: Crear un Cluster (Base de Datos)

1. Después de iniciar sesión, haz clic en **"Create"**
2. Selecciona **"M0 Free"** (cluster gratuito)
3. Elige un proveedor cloud (AWS, Google Cloud o Azure)
4. Selecciona la región más cercana a ti
5. Dale un nombre a tu cluster (ej: `WebFormsCluster`)
6. Haz clic en **"Create Deployment"** (tomará 1-3 minutos)

### Paso 3: Configurar Acceso de Red

1. En el menú lateral, ve a **"Network Access" & "IP Access List"**
2. Haz clic en **"Add IP Address"**
3. Selecciona **"Allow Access From Anywhere"** (para desarrollo)
   - Esto agrega `0.0.0.0/0` a la lista de IPs permitidas
4. Haz clic en **"Confirm"**

### Paso 4: Crear Usuario de Base de Datos

1. En el menú lateral, ve a **"Database & Network Acces"**
2. Haz clic en **"Add New Database User"**
3. Selecciona **"Password"** como método de autenticación
4. Ingresa:
   - **Username:** Tu nombre de usuario (ej: `webformsUser`)
   - **Password:** Una contraseña segura (guárdala, la necesitarás)
5. En "Database User Privileges", selecciona **"Read and write to any database"**
6. Haz clic en **"Add User"**

### Paso 5: Obtener Connection String (URI)

1. Regresa a **"Clusters"** en el menú lateral
2. En tu cluster, haz clic en **"Connect"**
3. Selecciona **"Connect your application"**
4. Asegúrate de que esté seleccionado:
   - **Driver:** Mongoose.js
   - **Version:** 7.0 or later
5. Copia el **Connection String**, se verá así:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=ClusterName
   ```

### Paso 6: Configurar en .env

Reemplaza la variable `MONGO_URI` en tu archivo `.env`:

```env
MONGO_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster0.xxxxx.mongodb.net/web_forms?retryWrites=true&w=majority&appName=WebForms
```

**Importante:**
- Reemplaza `<username>` con tu usuario de base de datos
- Reemplaza `<password>` con tu contraseña (sin los `<>`)
- Cambia `/?retryWrites` por `/web_forms?retryWrites` para especificar el nombre de tu base de datos

**Ejemplo completo:**
```env
MONGO_URI=mongodb+srv://webformsUser:MiPassword123@cluster0.abc12.mongodb.net/web_forms?retryWrites=true&w=majority&appName=WebForms
```

---

## 🔐 JWT (Autenticación)

```env
JWT_SECRET=tu_secreto_jwt_super_seguro_cambiar_en_produccion
JWT_EXPIRE=7d
```

### JWT_SECRET

**Descripción:** Clave secreta para firmar los tokens de autenticación (JSON Web Tokens).

**Cómo generar una clave segura:**

```bash
# Opción 1: Con Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Opción 2: Con OpenSSL
openssl rand -hex 64

# Opción 3: Generador online
# Visita: https://randomkeygen.com/ (sección "CodeIgniter Encryption Keys")
```

**Ejemplo:**
```env
JWT_SECRET=a8f5f167f44f4964e6c998dee827110c03e0245d4b6b4e5c8b5e5f5e5f5e5f5e5f5e5f5e5f5e
```

### JWT_EXPIRE

**Descripción:** Tiempo de expiración de los tokens de autenticación.

**Valores comunes:**
- `1h` - 1 hora
- `24h` - 24 horas
- `7d` - 7 días (valor actual)
- `30d` - 30 días

**Cuándo cambiar:** Para desarrollo, 7 días es cómodo. En producción, considera 1-24 horas por seguridad.

---

## 📧 Configuración de Email (Gmail)

El sistema envía emails para recuperación de contraseñas y notificaciones.

### Paso 1: Configurar tu Cuenta Gmail

1. Inicia sesión en tu cuenta de Gmail
2. Ve a tu cuenta de Google: [https://myaccount.google.com/](https://myaccount.google.com/)

### Paso 2: Activar Verificación en 2 Pasos

1. En el menú lateral, selecciona **"Seguridad"**
2. Busca **"Verificación en 2 pasos"** y actívala
3. Sigue los pasos para configurarla (necesitarás tu teléfono)

### Paso 3: Generar Contraseña de Aplicación

1. Una vez activada la verificación en 2 pasos, ingrea a **"Contraseñas de aplicaciones"**
   - Link directo: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Saldrá una sección llamada **"Tus contraseñas de aplicación"**
3. Ingresa el nombre para tu aplicación y haz click en **"Crear"**
4. Google te mostrará una contraseña de 16 caracteres: `xxxx xxxx xxxx xxxx`
5. **¡Cópiala inmediatamente!** No podrás verla de nuevo

### Paso 4: Configurar en .env

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=Sistema de Examenes <tu_email@gmail.com>
```

**Reemplaza:**
- `EMAIL_USER`: Tu dirección de Gmail completa
- `EMAIL_PASSWORD`: La contraseña de aplicación de 16 caracteres
- `EMAIL_FROM`: Nombre que aparecerá como remitente + tu email entre **"<>"**

**Ejemplo completo:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=miproyecto@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM=Sistema de Examenes <miproyecto@gmail.com>
```

## 🔗 URL del Backend

```env
BACKEND_URL=https://localhost:3000
```

**Descripción:** URL base del backend, usada para generar enlaces en emails (ej: links de recuperación de contraseña).

---

## 🔐 Certificados SSL

Los certificados SSL se generan automáticamente al ejecutar `./install.sh`.

Si necesitas generarlos manualmente:

```bash
cd backend/certs

# Generar certificados autofirmados (válidos por 1 año)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem \
  -sha256 -days 365 -nodes \
  -subj "/C=XX/ST=Dev/L=Local/O=DevTeam/OU=Development/CN=localhost"
```

**Archivos generados:**
- `key.pem` - Clave privada (¡nunca la compartas!)
- `cert.pem` - Certificado público

> ⚠️ **Nota:** Los certificados autofirmados mostrarán advertencia en el navegador. Esto es normal en desarrollo local. En producción, usa certificados de Let's Encrypt o similar.

---

## ✅ Verificar Configuración

### Backend

Después de configurar todo, verifica que el backend funcione:

```bash
cd backend
npm run dev
```

Si todo está correcto, verás:
```
✅ MongoDB conectado exitosamente
HTTP -> http://localhost:3000
HTTPS (HTTP/1.1) -> https://localhost:3001
HTTP/2 -> https://localhost:3002
```

**Probar endpoints:**

```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo_electronico":"admin@sistema.com","password":"Admin123!@#"}'
```

### Frontend

En otra terminal, verifica que el frontend funcione:

```bash
cd frontend
npm run dev
```

Verás:
```
  VITE v7.2.7  ready in 850 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Prueba manual:**
1. Abre http://localhost:5173 en tu navegador
2. Deberías ver la página de login "FormifyX"
3. Intenta hacer login con: `admin@sistema.com` / `Admin123!@#`
4. Si funciona, te redirige al dashboard

### Verificar Comunicación Frontend ↔ Backend

**En el navegador (DevTools - Console):**

Deberías ver estos logs al hacer login:
```
✅ Login exitoso: { token: "eyJhbG...", usuario: "admin@sistema.com" }
✅ Token guardado en localStorage
✅ Estado actualizado
```

**En el navegador (DevTools - Network):**

La petición POST a `/api/auth/login` debe devolver:
- Status: `200 OK`
- Response Body: `{ "success": true, "data": { "token": "...", "usuario": {...} } }`

**En el navegador (DevTools - Application → Storage → Local Storage):**

Deberías ver:
- `token`: `eyJhbGciOiJIUzI1NiIs...`
- `user`: `{"_id":"...","correo_electronico":"admin@sistema.com",...}`

---

## 🆘 Solución de Problemas

### Frontend

#### Error: CORS - Access-Control-Allow-Origin

**Causa:** El backend no permite peticiones desde `http://localhost:5173`.

**Solución:**
Verificar `backend/src/app.ts`:
```typescript
app.use(cors({
  origin: ['http://localhost:5173'], // Debe incluir frontend
  credentials: true
}));
```

#### Login no funciona - Token no se guarda

**Causa:** localStorage bloqueado (común en Firefox).

**Solución:**
1. Abre DevTools (F12) → Console
2. Prueba: `localStorage.setItem('test', 'value'); localStorage.getItem('test');`
3. Si falla, ve a `about:preferences#privacy`
4. Cambia "Enhanced Tracking Protection" a "Standard"

#### Vite no puede conectar con backend

**Causa:** `VITE_API_URL` mal configurado o backend no está corriendo.

**Solución:**
1. Verifica que backend esté corriendo en puerto 3000
2. Revisa `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
3. Reinicia Vite: `npm run dev`

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

---