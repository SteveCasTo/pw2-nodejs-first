# 🧪 GUÍA DE PRUEBAS - API REST

> 💡 **Tip VS Code**: Presiona `Ctrl+Shift+V` (Windows/Linux) o `Cmd+Shift+V` (Mac) para ver este documento con formato preview.

## 🔐 Generar Certificados SSL (Opcional)

Si necesitas regenerar los certificados SSL para HTTPS/HTTP2, ejecuta:

```bash
cd backend/certs
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes -subj "/C=XX/ST=Dev/L=Local/O=DevTeam/OU=Development/CN=localhost"
```

**Nota:** Los certificados ya están incluidos en el repositorio. Solo regenera si han expirado o los eliminaste.

---

## 📋 Requisitos Previos
1. Ejecutar `npm run seed` para cargar datos iniciales
2. Servidor corriendo en:
   - HTTP: `http://localhost:3000`
   - HTTPS: `https://localhost:3001`
   - HTTP/2: `https://localhost:3002`

## 👥 CREDENCIALES DE USUARIOS

```
Superadmin:  admin@sistema.com       / Admin123!@#
Editor:      editor@sistema.com      / Editor123!@#
Organizador: organizador@sistema.com / Organizador123!@#
Estudiante:  estudiante@sistema.com  / Estudiante123!@#
```

---

## 🔓 ENDPOINTS PÚBLICOS (Sin autenticación)

### 1. Health Check
**GET** `http://localhost:3000/health`

---

## 🔐 AUTENTICACIÓN

### 2. Login - Superadmin
**POST** `http://localhost:3000/api/auth/login`
```json
{
  "correo_electronico": "admin@sistema.com",
  "password": "Admin123!@#"
}
```

### 3. Login - Editor
**POST** `http://localhost:3000/api/auth/login`
```json
{
  "correo_electronico": "editor@sistema.com",
  "password": "Editor123!@#"
}
```

### 4. Login - Organizador
**POST** `http://localhost:3000/api/auth/login`
```json
{
  "correo_electronico": "organizador@sistema.com",
  "password": "Organizador123!@#"
}
```

### 5. Login - Estudiante
**POST** `http://localhost:3000/api/auth/login`
```json
{
  "correo_electronico": "estudiante@sistema.com",
  "password": "Estudiante123!@#"
}
```

### 6. Obtener Mi Perfil
**GET** `http://localhost:3000/api/auth/me`
**Headers:** `Authorization: Bearer {TOKEN}`

### 7. Cambiar Contraseña
**PUT** `http://localhost:3000/api/auth/change-password`
**Headers:** `Authorization: Bearer {TOKEN}`
```json
{
  "currentPassword": "Editor123!@#",
  "newPassword": "NewSecure123!@#"
}
```

### 8. Registrar Usuario (Solo Superadmin)
**POST** `http://localhost:3000/api/auth/register`
**Headers:** `Authorization: Bearer {SUPERADMIN_TOKEN}`
```json
{
  "correo_electronico": "nuevo@test.com",
  "nombre": "Nuevo Usuario"
}
```

---

## 🎯 PRIVILEGIOS (Solo Superadmin)

### 9. Listar Privilegios
**GET** `http://localhost:3000/api/privilegios`
**Headers:** `Authorization: Bearer {SUPERADMIN_TOKEN}`

### 10. Obtener Privilegio por ID
**GET** `http://localhost:3000/api/privilegios/{id}`
**Headers:** `Authorization: Bearer {SUPERADMIN_TOKEN}`

### 11. Crear Privilegio
**POST** `http://localhost:3000/api/privilegios`
**Headers:** `Authorization: Bearer {SUPERADMIN_TOKEN}`
```json
{
  "nombre_privilegio": "moderador",
  "descripcion": "Usuario moderador con permisos limitados"
}
```

### 12. Actualizar Privilegio
**PUT** `http://localhost:3000/api/privilegios/{id}`
**Headers:** `Authorization: Bearer {SUPERADMIN_TOKEN}`
```json
{
  "descripcion": "Descripción actualizada del privilegio"
}
```

### 13. Desactivar Privilegio
**PATCH** `http://localhost:3000/api/privilegios/{id}/desactivar`
**Headers:** `Authorization: Bearer {SUPERADMIN_TOKEN}`

### 14. Eliminar Privilegio
**DELETE** `http://localhost:3000/api/privilegios/{id}`
**Headers:** `Authorization: Bearer {SUPERADMIN_TOKEN}`

---

## 👤 USUARIO-PRIVILEGIOS (Solo Superadmin)

### 15. Listar Asignaciones
**GET** `http://localhost:3000/api/usuario-privilegios`
**Headers:** `Authorization: Bearer {SUPERADMIN_TOKEN}`

### 16. Obtener por ID
**GET** `http://localhost:3000/api/usuario-privilegios/{id}`
**Headers:** `Authorization: Bearer {SUPERADMIN_TOKEN}`

### 17. Obtener Privilegios de un Usuario
**GET** `http://localhost:3000/api/usuario-privilegios/usuario/{userId}`
**Headers:** `Authorization: Bearer {SUPERADMIN_TOKEN}`

### 18. Asignar Privilegio a Usuario
**POST** `http://localhost:3000/api/usuario-privilegios`
**Headers:** `Authorization: Bearer {SUPERADMIN_TOKEN}`
```json
{
  "id_usuario": "{userId}",
  "id_privilegio": "{privilegioId}"
}
```

### 19. Eliminar Asignación
**DELETE** `http://localhost:3000/api/usuario-privilegios/{id}`
**Headers:** `Authorization: Bearer {SUPERADMIN_TOKEN}`

### 20. Eliminar por Usuario y Privilegio
**DELETE** `http://localhost:3000/api/usuario-privilegios/usuario/{userId}/privilegio/{privilegioId}`
**Headers:** `Authorization: Bearer {SUPERADMIN_TOKEN}`

---

## 📅 CICLOS

### 21. Listar Ciclos (Cualquier usuario autenticado)
**GET** `http://localhost:3000/api/ciclos`
**Headers:** `Authorization: Bearer {TOKEN}`

### 22. Obtener Ciclo por ID
**GET** `http://localhost:3000/api/ciclos/{id}`
**Headers:** `Authorization: Bearer {TOKEN}`

### 23. Crear Ciclo (Solo Superadmin)
**POST** `http://localhost:3000/api/ciclos`
**Headers:** `Authorization: Bearer {SUPERADMIN_TOKEN}`
```json
{
  "nombre_ciclo": "2026/1",
  "descripcion": "Primer ciclo 2026",
  "fecha_inicio": "2026-01-15",
  "fecha_fin": "2026-06-15"
}
```

### 24. Actualizar Ciclo (Solo Superadmin)
**PUT** `http://localhost:3000/api/ciclos/{id}`
**Headers:** `Authorization: Bearer {SUPERADMIN_TOKEN}`
```json
{
  "descripcion": "Descripción actualizada del ciclo"
}
```

### 25. Desactivar Ciclo (Solo Superadmin)
**PATCH** `http://localhost:3000/api/ciclos/{id}/desactivar`
**Headers:** `Authorization: Bearer {SUPERADMIN_TOKEN}`

### 26. Eliminar Ciclo (Solo Superadmin)
**DELETE** `http://localhost:3000/api/ciclos/{id}`
**Headers:** `Authorization: Bearer {SUPERADMIN_TOKEN}`

---

## 📊 RANGOS DE EDAD (Todos los usuarios autenticados)

### 27. Listar Rangos de Edad
**GET** `http://localhost:3000/api/rangos-edad`
**Headers:** `Authorization: Bearer {TOKEN}`

### 28. Obtener Rango por ID
**GET** `http://localhost:3000/api/rangos-edad/{id}`
**Headers:** `Authorization: Bearer {TOKEN}`

### 29. Crear Rango de Edad
**POST** `http://localhost:3000/api/rangos-edad`
**Headers:** `Authorization: Bearer {TOKEN}`
```json
{
  "nombre_rango": "18-25 años",
  "edad_minima": 18,
  "edad_maxima": 25
}
```

### 30. Actualizar Rango de Edad
**PUT** `http://localhost:3000/api/rangos-edad/{id}`
**Headers:** `Authorization: Bearer {TOKEN}`
```json
{
  "nombre_rango": "18-30 años actualizado",
  "edad_minima": 18,
  "edad_maxima": 30
}
```

### 31. Desactivar Rango de Edad
**PATCH** `http://localhost:3000/api/rangos-edad/{id}/desactivar`
**Headers:** `Authorization: Bearer {TOKEN}`

### 32. Eliminar Rango de Edad
**DELETE** `http://localhost:3000/api/rangos-edad/{id}`
**Headers:** `Authorization: Bearer {TOKEN}`

---

## 📁 CATEGORÍAS (Todos los usuarios autenticados)

### 33. Listar Categorías
**GET** `http://localhost:3000/api/categorias`
**Headers:** `Authorization: Bearer {TOKEN}`

### 34. Obtener Categoría por ID
**GET** `http://localhost:3000/api/categorias/{id}`
**Headers:** `Authorization: Bearer {TOKEN}`

### 35. Crear Categoría
**POST** `http://localhost:3000/api/categorias`
**Headers:** `Authorization: Bearer {TOKEN}`
```json
{
  "nombre_categoria": "Tecnología",
  "descripcion": "Actividades tecnológicas y programación"
}
```

### 36. Actualizar Categoría
**PUT** `http://localhost:3000/api/categorias/{id}`
**Headers:** `Authorization: Bearer {TOKEN}`
```json
{
  "descripcion": "Nueva descripción de la categoría"
}
```

### 37. Desactivar Categoría
**PATCH** `http://localhost:3000/api/categorias/{id}/desactivar`
**Headers:** `Authorization: Bearer {TOKEN}`

### 38. Eliminar Categoría
**DELETE** `http://localhost:3000/api/categorias/{id}`
**Headers:** `Authorization: Bearer {TOKEN}`

---

## 📂 SUBCATEGORÍAS (Todos los usuarios autenticados)

### 39. Listar Subcategorías
**GET** `http://localhost:3000/api/subcategorias`
**Headers:** `Authorization: Bearer {TOKEN}`

### 40. Obtener Subcategoría por ID
**GET** `http://localhost:3000/api/subcategorias/{id}`
**Headers:** `Authorization: Bearer {TOKEN}`

### 41. Crear Subcategoría
**POST** `http://localhost:3000/api/subcategorias`
**Headers:** `Authorization: Bearer {TOKEN}`
```json
{
  "nombre_subcategoria": "Física",
  "id_categoria": "{categoriaId}"
}
```

### 42. Actualizar Subcategoría
**PUT** `http://localhost:3000/api/subcategorias/{id}`
**Headers:** `Authorization: Bearer {TOKEN}`
```json
{
  "nombre_subcategoria": "Física Avanzada"
}
```

### 43. Desactivar Subcategoría
**PATCH** `http://localhost:3000/api/subcategorias/{id}/desactivar`
**Headers:** `Authorization: Bearer {TOKEN}`

### 44. Eliminar Subcategoría
**DELETE** `http://localhost:3000/api/subcategorias/{id}`
**Headers:** `Authorization: Bearer {TOKEN}`

---

## ⭐ NIVELES DE DIFICULTAD (Todos los usuarios autenticados)

### 45. Listar Niveles de Dificultad
**GET** `http://localhost:3000/api/niveles-dificultad`
**Headers:** `Authorization: Bearer {TOKEN}`

### 46. Obtener Nivel por ID
**GET** `http://localhost:3000/api/niveles-dificultad/{id}`
**Headers:** `Authorization: Bearer {TOKEN}`

### 47. Crear Nivel de Dificultad
**POST** `http://localhost:3000/api/niveles-dificultad`
**Headers:** `Authorization: Bearer {TOKEN}`
```json
{
  "nivel": "Muy Difícil",
  "descripcion": "Nivel extremadamente complejo"
}
```

### 48. Actualizar Nivel de Dificultad
**PUT** `http://localhost:3000/api/niveles-dificultad/{id}`
**Headers:** `Authorization: Bearer {TOKEN}`
```json
{
  "descripcion": "Nivel actualizado con nueva descripción"
}
```

### 49. Desactivar Nivel de Dificultad
**PATCH** `http://localhost:3000/api/niveles-dificultad/{id}/desactivar`
**Headers:** `Authorization: Bearer {TOKEN}`

### 50. Eliminar Nivel de Dificultad
**DELETE** `http://localhost:3000/api/niveles-dificultad/{id}`
**Headers:** `Authorization: Bearer {TOKEN}`

---

## 🧪 PRUEBAS DE AUTORIZACIÓN

### Caso 1: Editor intenta acceder a privilegios (Debe fallar)
**GET** `http://localhost:3000/api/privilegios`
**Headers:** `Authorization: Bearer {EDITOR_TOKEN}`
**Resultado Esperado:** Error 403 - No autorizado

### Caso 2: Estudiante intenta crear ciclo (Debe fallar)
**POST** `http://localhost:3000/api/ciclos`
**Headers:** `Authorization: Bearer {ESTUDIANTE_TOKEN}`
```json
{
  "nombre_ciclo": "2026/2",
  "descripcion": "Test",
  "fecha_inicio": "2026-07-15",
  "fecha_fin": "2026-12-15"
}
```
**Resultado Esperado:** Error 403 - No autorizado

### Caso 3: Sin token intenta acceder (Debe fallar)
**GET** `http://localhost:3000/api/categorias`
**Sin Headers de Authorization**
**Resultado Esperado:** Error 401 - No autenticado

### Caso 4: Editor puede acceder a categorías (Debe funcionar)
**GET** `http://localhost:3000/api/categorias`
**Headers:** `Authorization: Bearer {EDITOR_TOKEN}`
**Resultado Esperado:** Lista de categorías

---

## 📝 NOTAS IMPORTANTES

1. **Tokens JWT**: Después de hacer login, guarda el token de la respuesta para usarlo en las pruebas
2. **Reemplazar IDs**: En las pruebas que usan `{id}`, reemplaza con un ID real obtenido de las listas
3. **Superadmin**: Solo el superadmin puede:
   - Gestionar privilegios
   - Gestionar usuario-privilegios
   - Crear/editar/eliminar ciclos
   - Registrar nuevos usuarios
4. **Usuarios autenticados**: Todos los usuarios autenticados pueden gestionar:
   - Rangos de edad
   - Categorías
   - Subcategorías
   - Niveles de dificultad
5. **Health check**: Es el único endpoint público sin autenticación

---

## 🔄 FLUJO RECOMENDADO DE PRUEBAS

1. ✅ Verificar health check (sin token)
2. ✅ Login con superadmin y guardar token
3. ✅ Probar /me para verificar autenticación
4. ✅ Listar todos los recursos (privilegios, ciclos, categorías, etc.)
5. ✅ Login con editor y guardar token
6. ✅ Intentar acceder a privilegios con token de editor (debe fallar)
7. ✅ Acceder a categorías con token de editor (debe funcionar)
8. ✅ Crear/actualizar recursos con diferentes usuarios
9. ✅ Probar cambio de contraseña
10. ✅ Registrar nuevo usuario con superadmin
