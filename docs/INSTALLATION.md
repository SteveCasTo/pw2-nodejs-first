# 📦 GUÍA DE INSTALACIÓN

> 📖 **Guía Completa de Configuración:** Ver [CONFIGURATION.md](./CONFIGURATION.md) para instrucciones detalladas de MongoDB Atlas, Gmail y todas las variables de entorno.

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

### 2. Ejecutar el instalador automático

```bash
chmod +x install.sh
./install.sh
```

El instalador realizará automáticamente:
- ✅ Verificación de Node.js 20-22 (bloqueará si usas Node.js 23+)
- ✅ Instalación de dependencias npm
- ✅ Creación de archivo `.env` desde `.env.example`
- ✅ Generación obligatoria de certificados SSL (requiere OpenSSL)
- ✅ Verificación de estructura del proyecto

**⚠️ Después del instalador, DEBES configurar:**

El instalador creará `.env` con valores de ejemplo. **Debes modificarlo** con tus credenciales reales:

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

### 4. Iniciar el servidor

```bash
npm run dev
```

Si la configuración es correcta, verás:

```
✅ MongoDB conectado exitosamente
HTTP -> http://localhost:3000
HTTPS (HTTP/1.1) -> https://localhost:3001
HTTP/2 -> https://localhost:3002
```

🎉 **¡Listo!** Los servidores están corriendo.

> 🔒 **Nota:** Al acceder a HTTPS/HTTP2, el navegador mostrará advertencia de seguridad porque los certificados son autofirmados. Esto es normal en desarrollo. Haz clic en "Avanzado" → "Continuar al sitio".

---

## 🛠️ Instalación Manual (Windows/MacOS)

Si el instalador automático no funciona en tu sistema, sigue estos pasos:

### 1. Clonar el repositorio

```bash
git clone https://github.com/SteveCasTo/pw2-nodejs-first.git
cd pw2-nodejs-first/backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `backend/.env` con tus credenciales. **Guía completa:** [CONFIGURATION.md](./CONFIGURATION.md)

### 4. Generar certificados SSL

```bash
cd certs

# Windows (Git Bash o WSL)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes -subj "/C=XX/ST=Dev/L=Local/O=DevTeam/OU=Development/CN=localhost"

# MacOS
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes -subj "/C=XX/ST=Dev/L=Local/O=DevTeam/OU=Development/CN=localhost"

cd ..
```

### 5. Cargar datos iniciales

```bash
npm run seed
```

### 6. Iniciar servidor

```bash
npm run dev
```

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

```bash
docker-compose up --build
```

O en modo detached:

```bash
docker-compose up -d
```

Detener contenedores:

```bash
docker-compose down
```

---

## 📚 Comandos Útiles

```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Compilar TypeScript
npm start            # Ejecutar versión compilada
npm run seed         # Cargar datos iniciales
npm run clean        # Limpiar base de datos
npm run lint         # Verificar código
npm run lint:fix     # Corregir errores
npm run format       # Formatear código
```