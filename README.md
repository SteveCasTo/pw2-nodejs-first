# PW2 Node.js Project

Proyecto backend desarrollado con Node.js, Express, TypeScript y MongoDB Atlas para un sistema de exámenes educativos.

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

El servidor estará disponible en **http://localhost:4000**

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

# Code Quality
npm run lint         # Ejecuta ESLint
npm run lint:fix     # Corrige errores de ESLint automáticamente
npm run format       # Formatea código con Prettier
npm run format:check # Verifica formateo sin modificar
```

## 🔧 Configuración

### Variables de Entorno

Archivo `.env`:

```env
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:3000
```

### TypeScript Path Aliases

El proyecto usa path aliases para imports más limpios:

```typescript
import { connectDB } from '@config/database';
import { RangoEdad } from '@models/rangoEdad.model';
import { rangoEdadService } from '@services/rangoEdad.service';
import { errorHandler } from '@middlewares/errorHandler';
```

## 🐳 Docker

### Servicios en Docker Compose

- **mongodb**: Base de datos MongoDB local (puerto 27017) - para desarrollo sin Atlas
- **backend**: API de Node.js (puerto 4000)

**Nota**: Para producción se recomienda usar MongoDB Atlas en lugar del contenedor local.

## 📚 API Endpoints

### Rangos de Edad (Ejemplo CRUD)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/rangos-edad` | Obtener todos los rangos de edad |
| GET | `/api/rangos-edad/:id` | Obtener un rango por ID |
| POST | `/api/rangos-edad` | Crear nuevo rango de edad |
| PUT | `/api/rangos-edad/:id` | Actualizar rango existente |
| DELETE | `/api/rangos-edad/:id` | Eliminar rango de edad |

#### Ejemplo de Request (POST)

```json
{
  "nombre_rango": "Adolescentes",
  "edad_minima": 13,
  "edad_maxima": 17,
  "activo": true
}
```

### Testing con Postman

1. Importa la colección de Postman (si está disponible)
2. Configura la variable `baseUrl` a `http://localhost:4000`
3. Prueba los endpoints de CRUD

## 📚 Funcionalidades Implementadas

- [x] Conexión a MongoDB Atlas
- [x] Estructura MVC completa y modular
- [x] 22 modelos Mongoose con esquemas completos
- [x] CRUD completo de Rangos de Edad (ejemplo funcional)
- [x] Middleware global de manejo de errores
- [x] Configuración Docker para desarrollo
- [x] TypeScript con strict mode
- [x] ESLint + Prettier configurados
- [x] Path aliases para imports limpios

## 🚧 Próximos Pasos

- [ ] Implementar autenticación JWT
- [ ] Agregar validación de datos con Zod
- [ ] Implementar testing con Jest
- [ ] Desarrollar frontend con React
- [ ] Agregar más CRUDs para otras entidades
- [ ] Implementar paginación y filtros
- [ ] Configurar CI/CD
- [ ] Documentación con Swagger/OpenAPI

## 🤝 Contribuir

1. **Branch naming**: `feature/nombre-feature`, `fix/nombre-fix`
2. **Code style**: El código debe pasar ESLint y Prettier
3. **Pull Requests**: Describe claramente los cambios realizados
4. **Testing**: Asegúrate de probar tu código antes de hacer push

## 👥 Equipo

- [Añadir nombres del equipo]

## 📄 Licencia

ISC

---

## 🆘 Troubleshooting

### Error de conexión a MongoDB
- Verifica que tu MongoDB Atlas URI sea correcta
- Asegúrate de que tu IP esté en la whitelist de Atlas
- Verifica usuario y contraseña

### Puerto 4000 en uso
```bash
# Windows
netstat -ano | findstr :4000

# Cambiar puerto en .env
PORT=5000
```

### Errores de TypeScript
```bash
# Limpiar y reconstruir
rm -rf dist node_modules
npm install
npm run build
```
