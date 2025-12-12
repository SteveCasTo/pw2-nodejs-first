# PW2 Full-Stack Project

Aplicación completa con **React + TypeScript** frontend y **Node.js + Express** backend para sistema de exámenes educativos. Incluye autenticación JWT, animaciones con Framer Motion, y servidores HTTP, HTTPS y HTTP/2 simultáneos.

---

## 👥 Equipo

- Castro Tejada Steven Lisandro
- Soliz Alcocer Leandro Wilson

---

## 📚 Documentación

> 💡 **Tip**: Si usas Visual Studio Code, abre cualquier archivo `.md` y presiona `Ctrl+Shift+V` (Windows/Linux) o `Cmd+Shift+V` (Mac) para ver el formato con preview.

Todos los documentos están ubicados en la carpeta **`docs/`**:

- 📦 **[docs/INSTALLATION.md](./docs/INSTALLATION.md)** - Guía completa de instalación, configuración y arquitectura del frontend
- ⚙️ **[docs/CONFIGURATION.md](./docs/CONFIGURATION.md)** - Configuración de MongoDB Atlas, Gmail y variables de entorno
- 🧪 **[docs/PRUEBAS.md](./docs/PRUEBAS.md)** - Guía completa de endpoints y testing

---

## 🚀 Inicio Rápido

> 📖 **Guía de Instalación Completa:** Ver **[docs/INSTALLATION.md](./docs/INSTALLATION.md)** para instrucciones detalladas de instalación, configuración, arquitectura del frontend, uso de componentes, animaciones, y troubleshooting.

### Resumen de Instalación

1. **Clonar** el repositorio
2. **Ejecutar** `./install.sh` (Linux/Mac) o instalación manual
3. **Configurar** variables de entorno (MongoDB, JWT, Email)
4. **Iniciar** backend (`npm run dev` en `backend/`)
5. **Iniciar** frontend (`npm run dev` en `frontend/`)

**Acceder a:**
- 🎨 Frontend: `http://localhost:5173`
- 🌐 Backend: `http://localhost:3000`

---

## 🚀 Tecnologías

### Frontend
- **React** 19.2.0 con **TypeScript** - Framework UI moderno
- **Vite** 7.2.7 - Build tool ultrarrápido con HMR
- **Tailwind CSS** v4 - Framework CSS utility-first
- **Framer Motion** 12.23.26 - Animaciones fluidas
- **React Router** 7.10.1 - Navegación SPA
- **Axios** 1.13.2 - Cliente HTTP con interceptores

### Backend
- **Node.js** v20.x con **TypeScript** - Runtime JavaScript
- **Express.js** v5 - Framework web minimalista
- **MongoDB Atlas** con **Mongoose** - Base de datos NoSQL
- **JWT** - Autenticación sin estado
- **Nodemailer** - Envío de emails (Gmail)
- **Docker** & **Docker Compose** - Containerización

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Commitizen** - Commits convencionales
- **Commitlint** - Validación de commits
- **Nodemon** - Hot reload en desarrollo
- **ts-node** - Ejecución TypeScript directa

---

## 📁 Estructura del Proyecto

```
pw2-nodejs-first/
├── frontend/                    # Aplicación React
│   ├── public/                  # Assets estáticos
│   ├── src/
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── auth/            # Login, ProtectedRoute
│   │   │   ├── common/          # Button, Input, Modal
│   │   │   ├── dashboard/       # Cards de módulos
│   │   │   └── layout/          # Header, ParallaxBackground
│   │   ├── context/             # AuthContext (estado global)
│   │   ├── pages/               # Páginas de la aplicación
│   │   │   ├── LoginPage.tsx    # Página de login animada
│   │   │   ├── DashboardPage.tsx # Dashboard principal
│   │   │   └── CategoriasPage.tsx # CRUD de categorías
│   │   ├── services/            # Lógica de negocio
│   │   │   ├── api.ts           # Cliente Axios configurado
│   │   │   ├── authService.ts   # Autenticación (login/logout)
│   │   │   └── dataService.ts   # CRUD endpoints (todas las entidades)
│   │   ├── types/               # Interfaces TypeScript
│   │   ├── App.tsx              # Componente raíz
│   │   └── main.tsx             # Entry point
│   ├── Dockerfile               # Producción (Nginx)
│   ├── Dockerfile.dev           # Desarrollo (Vite)
│   ├── nginx.conf               # Config Nginx para SPA
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── vite.config.ts
│
├── backend/                     # API REST
│   ├── src/
│   │   ├── config/              # Configuraciones (DB, env)
│   │   ├── controllers/         # Controladores HTTP
│   │   ├── middlewares/         # Middlewares personalizados
│   │   ├── models/              # Modelos Mongoose (22 colecciones)
│   │   ├── routes/              # Definición de rutas API
│   │   ├── services/            # Lógica de negocio
│   │   ├── types/               # Interfaces TypeScript
│   │   ├── utils/               # Funciones auxiliares
│   │   ├── app.ts               # Configuración Express
│   │   ├── server.ts            # Entry point (HTTP/HTTPS/HTTP2)
│   │   └── seed.ts              # Datos iniciales
│   ├── certs/                   # Certificados SSL
│   ├── Dockerfile               # Producción
│   ├── Dockerfile.dev           # Desarrollo
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── docker-compose.yml           # Orquestación (frontend + backend)
├── install.sh                   # Instalador automático (Linux/Mac)
└── README.md
```

---

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

## 🚀 Uso

### Desarrollo Local

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev       # Inicia servidor en puerto 3000/3001/3002
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev       # Inicia Vite en puerto 5173
```

Accede a: **http://localhost:5173**

### Desarrollo con Docker

```bash
# Iniciar ambos servicios (frontend + backend)
docker-compose up --build

# Modo detached (background)
docker-compose up -d

# Ver logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Detener contenedores
docker-compose down
```

El Docker Compose levanta:
- **Frontend**: http://localhost:5173 (hot-reload habilitado)
- **Backend**: http://localhost:3000 (nodemon habilitado)

### Comandos Disponibles

**Backend:**
```bash
npm run dev          # Desarrollo con nodemon
npm run build        # Compilar TypeScript
npm start            # Ejecutar versión compilada
npm run seed         # Cargar datos iniciales
npm run clean        # Limpiar base de datos
npm run lint         # Verificar código
npm run lint:fix     # Corregir errores ESLint
npm run format       # Formatear con Prettier
```

**Frontend:**
```bash
npm run dev          # Desarrollo con Vite (HMR)
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Verificar código
```

---

## 🤝 Contribuir

### Branch Naming
- `feature/nombre-feature` - Nuevas funcionalidades
- `fix/nombre-fix` - Corrección de bugs
- `docs/nombre-doc` - Cambios en documentación

### Code Style
El código debe pasar ESLint y Prettier antes de commit:

```bash
# Backend
cd backend
npm run lint:fix
npm run format

# Frontend
cd frontend
npm run lint:fix
```

---