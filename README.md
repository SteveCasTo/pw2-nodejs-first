# PW2 Node.js Project

Backend completo con Node.js, Express, TypeScript y MongoDB Atlas para sistema de exámenes educativos. Incluye servidores HTTP, HTTPS y HTTP/2 simultáneos.

---

## 👥 Equipo

- Castro Tejada Steven Lisandro
- Soliz Alcocer Leandro Wilson

---

## 📚 Documentación

> 💡 **Tip**: Si usas Visual Studio Code, abre cualquier archivo `.md` y presiona `Ctrl+Shift+V` (Windows/Linux) o `Cmd+Shift+V` (Mac) para ver el formato con preview.

Todos los documentos están ubicados en la carpeta **`docs/`**:

- 📦 **[docs/INSTALLATION.md](./docs/INSTALLATION.md)** - Guía de instalación rápida
- ⚙️ **[docs/CONFIGURATION.md](./docs/CONFIGURATION.md)** - Configuración detallada (MongoDB, Gmail, variables de entorno)
- 🧪 **[docs/PRUEBAS.md](./docs/PRUEBAS.md)** - Guía completa de endpoints y testing

---

## 🚀 Inicio Rápido

```bash
# 1. Clonar repositorio
git clone https://github.com/SteveCasTo/pw2-nodejs-first.git
cd pw2-nodejs-first

# 2. Ejecutar instalador (Linux/Mac)
chmod +x install.sh
./install.sh

# 3. Configurar variables de entorno
cd backend
nano .env  # Ver CONFIGURATION.md para guía completa

# 4. Cargar datos de prueba
npm run seed

# 5. Iniciar servidor
npm run dev
```

**Servidores disponibles:**
- 🌐 HTTP: `http://localhost:3000`
- 🔒 HTTPS: `https://localhost:3001`
- ⚡ HTTP/2: `https://localhost:3002`

---

## 🚀 Tecnologías

### Backend
- **Node.js** v20.x con **TypeScript**
- **Express.js** v5 - Framework web
- **MongoDB Atlas** con **Mongoose** - Base de datos NoSQL
- **Docker** & **Docker Compose** - Containerización

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Commitizen** - Commits convencionales
- **Commitlint** - Validación de commits
- **Nodemon** - Hot reload en desarrollo
- **ts-node** - Ejecución TypeScript directa

## 📁 Estructura del Proyecto

```
pw2-nodejs-first/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuraciones (DB, variables de entorno)
│   │   ├── controllers/    # Controladores HTTP
│   │   ├── middlewares/    # Middlewares personalizados
│   │   ├── models/         # Modelos de Mongoose (esquemas)
│   │   ├── routes/         # Definición de rutas API
│   │   ├── services/       # Lógica de negocio
│   │   ├── types/          # Interfaces y tipos TypeScript
│   │   ├── utils/          # Funciones auxiliares
│   │   ├── app.ts          # Configuración de Express
│   │   └── server.ts       # Entry point del servidor
│   ├── Dockerfile          # Dockerfile para producción
│   ├── Dockerfile.dev      # Dockerfile para desarrollo
│   ├── package.json
│   ├── tsconfig.json
│   ├── eslint.config.mjs
│   └── .env.example
├── docker-compose.yml
└── README.md
```

## 🗄️ Estructura de Base de Datos

El proyecto incluye 22 colecciones MongoDB basadas en el siguiente esquema:

**Entidades Principales:**
- `usuarios` - Usuarios del sistema
- `privilegios` - Roles y permisos
- `categorias` y `subcategorias` - Organización de contenido
- `preguntas` - Preguntas de exámenes (múltiples tipos)
- `examenes` - Definición de exámenes
- `intentos_examen` - Intentos de usuarios
- `rangos_edad` - Rangos de edad objetivo
- `niveles_dificultad` - Niveles de dificultad

**Entidades de Soporte:**
- `opciones_pregunta` - Opciones para preguntas de selección
- `pares_emparejamiento` - Pares para preguntas de emparejamiento
- `contenidos` - Archivos multimedia
- `respuestas_*` - Diferentes tipos de respuestas
- Y más...

## 🛠️ Instalación

### Prerrequisitos
- **Node.js** >= 20.x
- **npm** o **yarn**
- **Docker** y **Docker Compose** (opcional)
- Cuenta en **MongoDB Atlas** (o MongoDB local)

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

Edita el archivo `.env` y configura tu **MongoDB Atlas URI**:
```env
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

## 🚀 Uso

### Desarrollo Local

```bash
cd backend
npm run dev
```

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
npm run build        # Compila TypeScript a JavaScript
npm start            # Inicia servidor compilado

# Calidad de Código
npm run lint         # Ejecuta ESLint
npm run lint:fix     # Corrige errores de ESLint automáticamente
npm run format       # Formatea código con Prettier
npm run format:check # Verifica formateo sin modificar
```

## 🤝 Contribuir

1. **Branch naming**: `feature/nombre-feature`, `fix/nombre-fix`
2. **Code style**: El código debe pasar ESLint y Prettier