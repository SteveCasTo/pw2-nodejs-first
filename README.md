# PW2 Node.js Project

Proyecto backend desarrollado con Node.js, Express, TypeScript y MongoDB.

## 🚀 Tecnologías

### Backend
- **Node.js** con **TypeScript**
- **Express.js** - Framework web
- **MongoDB** con **Mongoose** - Base de datos
- **Docker** & **Docker Compose** - Containerización

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting
- **Commitizen** - Commits convencionales
- **Commitlint** - Validación de commits

## 📁 Estructura del Proyecto

```
pw2-nodejs-first/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuraciones (DB, etc)
│   │   ├── controllers/    # Controladores
│   │   ├── middlewares/    # Middlewares personalizados
│   │   ├── models/         # Modelos de Mongoose
│   │   ├── routes/         # Rutas de la API
│   │   ├── services/       # Lógica de negocio
│   │   ├── types/          # Types de TypeScript
│   │   ├── utils/          # Utilidades
│   │   └── index.ts        # Entry point
│   ├── .husky/             # Git hooks
│   ├── Dockerfile          # Dockerfile para producción
│   ├── Dockerfile.dev      # Dockerfile para desarrollo
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── docker-compose.yml
└── README.md
```

## 🛠️ Instalación

### Prerrequisitos
- Node.js >= 20.x
- npm o yarn
- Docker y Docker Compose (opcional)

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd pw2-nodejs-first
```

2. **Instalar dependencias del backend**
```bash
cd backend
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```
Edita el archivo `.env` con tus configuraciones.

4. **Inicializar Husky**
```bash
npm run prepare
```

## 🚀 Uso

### Desarrollo Local

```bash
cd backend
npm run dev
```

El servidor estará disponible en `http://localhost:4000`

### Desarrollo con Docker

```bash
# Desde la raíz del proyecto
docker-compose up

# En modo detached (background)
docker-compose up -d

# Detener contenedores
docker-compose down
```

### Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor con nodemon y hot-reload

# Producción
npm run build        # Compila TypeScript
npm start            # Inicia servidor en producción

# Linting y Formateo
npm run lint         # Ejecuta ESLint
npm run lint:fix     # Corrige errores de ESLint automáticamente
npm run format       # Formatea código con Prettier
npm run format:check # Verifica formateo

# Commits
npm run commit       # Inicia Commitizen para commits convencionales
```

## 📝 Convenciones de Commits

Este proyecto usa **Conventional Commits** con Commitizen. Para hacer un commit:

```bash
git add .
npm run commit
```

Tipos de commit disponibles:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bugs
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan el código)
- `refactor`: Refactorización de código
- `perf`: Mejoras de rendimiento
- `test`: Agregar o modificar tests
- `build`: Cambios en el sistema de build
- `ci`: Cambios en CI/CD
- `chore`: Otras tareas

## 🔧 Configuración

### TypeScript Path Aliases

El proyecto usa path aliases para imports más limpios:

```typescript
import { example } from '@config/example';
import { User } from '@models/User';
```

### Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```env
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/pw2_db
CORS_ORIGIN=http://localhost:3000
```

## 🐳 Docker

### Servicios en Docker Compose

- **mongodb**: Base de datos MongoDB (puerto 27017)
- **backend**: API de Node.js (puerto 4000)
- **frontend**: React app (puerto 3000) - _Preparado para implementación futura_

## 🤝 Contribuir

Este es un proyecto en equipo. Por favor sigue estas guías:

1. **Branch naming**: `feature/nombre-feature`, `fix/nombre-fix`
2. **Commits**: Usa `npm run commit` para commits convencionales
3. **Code style**: El código debe pasar ESLint y Prettier antes de commit (automático con Husky)

## 👥 Equipo

- [Añadir nombres del equipo]

## 📄 Licencia

ISC

### Backend
- **Node.js** con **TypeScript**
- **Express.js** - Framework web
- **MongoDB** con **Mongoose** - Base de datos
- **Docker** & **Docker Compose** - Containerización

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting
- **Commitizen** - Commits convencionales
- **Commitlint** - Validación de commits

## 📁 Estructura del Proyecto

```
pw2-nodejs-first/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuraciones (DB, etc)
│   │   ├── controllers/    # Controladores
│   │   ├── middlewares/    # Middlewares personalizados
│   │   ├── models/         # Modelos de Mongoose
│   │   ├── routes/         # Rutas de la API
│   │   ├── services/       # Lógica de negocio
│   │   ├── types/          # Types de TypeScript
│   │   ├── utils/          # Utilidades
│   │   ├── app.ts          # Configuración de Express
│   │   └── server.ts       # Entry point
│   ├── .husky/             # Git hooks
│   ├── Dockerfile          # Dockerfile para producción
│   ├── Dockerfile.dev      # Dockerfile para desarrollo
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── docker-compose.yml
└── README.md
```

## 🛠️ Instalación

### Prerrequisitos
- Node.js >= 20.x
- npm o yarn
- Docker y Docker Compose (opcional)

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd pw2-nodejs-first
```

2. **Instalar dependencias del backend**
```bash
cd backend
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```
Edita el archivo `.env` con tus configuraciones.

4. **Inicializar Husky**
```bash
npm run prepare
```

## 🚀 Uso

### Desarrollo Local

```bash
# Iniciar MongoDB localmente (si no usas Docker)
# Asegúrate de tener MongoDB instalado y corriendo en localhost:27017

# Iniciar el servidor en modo desarrollo
cd backend
npm run dev
```

El servidor estará disponible en `http://localhost:4000`

### Desarrollo con Docker

```bash
# Desde la raíz del proyecto
docker-compose up

# En modo detached (background)
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Detener contenedores
docker-compose down
```

### Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor con nodemon y hot-reload

# Producción
npm run build        # Compila TypeScript
npm start            # Inicia servidor en producción

# Linting y Formateo
npm run lint         # Ejecuta ESLint
npm run lint:fix     # Corrige errores de ESLint automáticamente
npm run format       # Formatea código con Prettier
npm run format:check # Verifica formateo

# Commits
npm run commit       # Inicia Commitizen para commits convencionales
```

## 📝 Convenciones de Commits

Este proyecto usa **Conventional Commits** con Commitizen. Para hacer un commit:

```bash
git add .
npm run commit
```

Tipos de commit disponibles:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bugs
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan el código)
- `refactor`: Refactorización de código
- `perf`: Mejoras de rendimiento
- `test`: Agregar o modificar tests
- `build`: Cambios en el sistema de build
- `ci`: Cambios en CI/CD
- `chore`: Otras tareas

## 🔧 Configuración

### TypeScript Path Aliases

El proyecto usa path aliases para imports más limpios:

```typescript
import { exampleController } from '@controllers/example.controller';
import { connectDB } from '@config/database';
import { formatDate } from '@utils/helpers';
```

### Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```env
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/pw2_db
CORS_ORIGIN=http://localhost:3000
```

## 🐳 Docker

### Servicios en Docker Compose

- **mongodb**: Base de datos MongoDB (puerto 27017)
- **backend**: API de Node.js (puerto 4000)
- **frontend**: React app (puerto 3000) - _Preparado para implementación futura_

### Acceso a MongoDB en Docker

```bash
# Entrar al contenedor de MongoDB
docker exec -it pw2-mongodb mongosh

# Autenticarse
use admin
db.auth("admin", "admin123")

# Ver bases de datos
show dbs
```

## 🤝 Contribuir

Este es un proyecto en equipo. Por favor sigue estas guías:

1. **Branch naming**: `feature/nombre-feature`, `fix/nombre-fix`
2. **Commits**: Usa `npm run commit` para commits convencionales
3. **Code style**: El código debe pasar ESLint y Prettier antes de commit (automático con Husky)
4. **Pull Requests**: Describe claramente los cambios realizados

## 📚 Próximos Pasos

- [ ] Implementar autenticación JWT
- [ ] Agregar validación de datos (joi/zod)
- [ ] Implementar testing (Jest)
- [ ] Desarrollar frontend con React
- [ ] Configurar CI/CD

## 👥 Equipo

- [Añadir nombres del equipo]

## 📄 Licencia

ISC
