# 📦 GUÍA DE INSTALACIÓN

---

## 🔧 Prerrequisitos

- **Node.js** 20.x - 22.x LTS (requerido)
- **npm** >= 10.x
- **Git**

> ⚠️ **IMPORTANTE**: Este proyecto requiere Node.js 20-22 debido a dependencias nativas (spdy). Node.js 23+ no es compatible.

### Instalar Node.js 20 LTS con nvm (recomendado)

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

El instalador:
- Verifica prerrequisitos
- Instala dependencias
- Configura archivo `.env` con MongoDB Atlas ya configurado
- Genera certificados SSL

**Guarda y cierra el editor.**

### 4. Iniciar el servidor

```bash
cd backend
npm run dev
```

🎉 **¡Listo!** Los servidores estarán corriendo en:
- HTTP: `http://localhost:3000`
- HTTPS: `https://localhost:3001`
- HTTP/2: `https://localhost:3002`

Continúa con la sección [Cargar Datos Iniciales](#-cargar-datos-iniciales).

---

## 🛠️ Instalación Manual

**Si prefieres instalar paso a paso o estás en Windows/MacOS.**

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/SteveCasTo/pw2-nodejs-first.git
cd pw2-nodejs-first
```

### Paso 2: Instalar Dependencias del Backend

```bash
cd backend
npm install
```

**Esto instalará:**
- Express.js, Mongoose, TypeScript
- Herramientas de seguridad (helmet, cors, express-mongo-sanitize)
- Autenticación (bcryptjs, jsonwebtoken)
- Protocolo HTTP/2 (spdy)
- Herramientas de desarrollo (nodemon, ESLint, Prettier)

**Tiempo estimado:** 2-5 minutos dependiendo de tu conexión.

### Paso 3: Copiar Archivo de Variables de Entorno

```bash
# En el directorio backend/
cp .env.example .env
```
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

Los servidores estarán disponibles en:
- HTTP: `http://localhost:3000`
- HTTPS: `https://localhost:3001`
- HTTP/2: `https://localhost:3002`

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