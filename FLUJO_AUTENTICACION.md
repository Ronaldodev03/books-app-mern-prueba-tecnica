# Flujo de Autenticación - Proyecto MERN Books

## Índice
1. [Descripción General](#descripción-general)
2. [Arquitectura](#arquitectura)
3. [Componentes del Sistema](#componentes-del-sistema)
4. [Flujo de Registro](#flujo-de-registro)
5. [Flujo de Login](#flujo-de-login)
6. [Flujo de Autenticación con JWT](#flujo-de-autenticación-con-jwt)
7. [Diagrama de Flujo](#diagrama-de-flujo)
8. [Seguridad](#seguridad)

---

## Descripción General

Este proyecto implementa un sistema de autenticación basado en **JWT (JSON Web Tokens)** para una aplicación MERN Stack. El sistema permite:
- Registro de nuevos usuarios con contraseñas hasheadas
- Login con generación de token JWT
- Protección de rutas mediante middleware de autenticación
- Verificación de identidad del usuario en cada petición protegida

---

## Arquitectura

```
┌─────────────┐
│   Cliente   │
│  (Frontend) │
└──────┬──────┘
       │
       │ HTTP Request
       │
       ▼
┌──────────────────────────────────┐
│          Express Server          │
│                                  │
│  ┌────────────────────────────┐ │
│  │    Routes/Endpoints        │ │
│  │  /api/auth/register        │ │
│  │  /api/auth/login           │ │
│  │  /api/auth/user            │ │
│  └──────────┬─────────────────┘ │
│             │                    │
│             ▼                    │
│  ┌────────────────────────────┐ │
│  │    Middleware              │ │
│  │  - authenticate()          │ │
│  │  - JWT Verification        │ │
│  └──────────┬─────────────────┘ │
│             │                    │
│             ▼                    │
│  ┌────────────────────────────┐ │
│  │    Controllers             │ │
│  │  - register()              │ │
│  │  - login()                 │ │
│  │  - getUser()               │ │
│  └──────────┬─────────────────┘ │
│             │                    │
│             ▼                    │
│  ┌────────────────────────────┐ │
│  │    Utils                   │ │
│  │  - hashPassword()          │ │
│  │  - checkPassword()         │ │
│  │  - generateJWT()           │ │
│  └──────────┬─────────────────┘ │
│             │                    │
└─────────────┼────────────────────┘
              │
              ▼
      ┌──────────────┐
      │   MongoDB    │
      │  Users DB    │
      └──────────────┘
```

---

## Componentes del Sistema

### 1. Modelo de Usuario
**Archivo:** [User.js](backend/src/models/User.js)

```javascript
{
  name: String,        // Nombre del usuario
  email: String,       // Email único (usado para login)
  password: String,    // Contraseña hasheada con bcrypt
  confirmed: Boolean,  // Estado de confirmación
  timestamps: true     // createdAt, updatedAt
}
```

### 2. Controladores de Autenticación
**Archivo:** [authController.js](backend/src/controllers/authController.js)

- **register()** - Registro de nuevos usuarios
- **login()** - Inicio de sesión y generación de JWT
- **getUser()** - Obtención del perfil del usuario autenticado

### 3. Utilidades de Autenticación
**Archivo:** [auth.js](backend/src/utils/auth.js)

- **hashPassword()** - Hashea contraseñas usando bcrypt (salt rounds: 10)
- **checkPassword()** - Compara contraseñas en texto plano con el hash

### 4. Utilidades JWT
**Archivo:** [jwt.js](backend/src/utils/jwt.js)

- **generateJWT()** - Genera tokens JWT con expiración de 180 días

### 5. Middleware de Autenticación
**Archivo:** [auth.js](backend/src/middleware/auth.js)

- **authenticate()** - Verifica JWT y carga datos del usuario

---

## Flujo de Registro

### Endpoint: `POST /api/auth/register`

```
┌─────────┐
│ Cliente │
└────┬────┘
     │
     │ 1. POST /api/auth/register
     │    Body: { name, email, password }
     │
     ▼
┌────────────────┐
│  authController│
│   register()   │
└────┬───────────┘
     │
     │ 2. Verificar si email existe
     ▼
┌────────────────┐
│   User.findOne │
│   ({ email })  │
└────┬───────────┘
     │
     ├─► Email existe? → Error 409
     │
     │ 3. Hashear contraseña
     ▼
┌────────────────┐
│  hashPassword()│
│   (bcrypt)     │
└────┬───────────┘
     │
     │ 4. Crear usuario
     ▼
┌────────────────┐
│  User.create() │
└────┬───────────┘
     │
     │ 5. Respuesta exitosa (sin token)
     ▼
┌────────────────┐
│   201 Created  │
│  { id, name,   │
│    email }     │
└────────────────┘
```

### Código de Ejemplo:

```javascript
// Request
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}

// Response (Éxito)
Status: 201 Created
{
  "success": true,
  "message": "Usuario creado correctamente",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}

// Response (Error - Usuario existe)
Status: 409 Conflict
{
  "error": "El usuario ya está registrado"
}
```

---

## Flujo de Login

### Endpoint: `POST /api/auth/login`

```
┌─────────┐
│ Cliente │
└────┬────┘
     │
     │ 1. POST /api/auth/login
     │    Body: { email, password }
     │
     ▼
┌────────────────┐
│  authController│
│    login()     │
└────┬───────────┘
     │
     │ 2. Buscar usuario por email
     ▼
┌────────────────┐
│   User.findOne │
│   ({ email })  │
└────┬───────────┘
     │
     ├─► No existe? → Error 404
     │
     │ 3. Verificar contraseña
     ▼
┌────────────────┐
│ checkPassword()│
│  bcrypt.compare│
└────┬───────────┘
     │
     ├─► Incorrecta? → Error 401
     │
     │ 4. Generar JWT
     ▼
┌────────────────┐
│  generateJWT() │
│  payload: {id} │
│  expires: 180d │
└────┬───────────┘
     │
     │ 5. Respuesta con token
     ▼
┌────────────────┐
│   200 OK       │
│  { id, name,   │
│    email,      │
│    token }     │
└────────────────┘
```

### Código de Ejemplo:

```javascript
// Request
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "123456"
}

// Response (Éxito)
Status: 200 OK
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

// Response (Error - Credenciales incorrectas)
Status: 401 Unauthorized
{
  "error": "Credenciales incorrectas"
}
```

---

## Flujo de Autenticación con JWT

### Endpoint: `GET /api/auth/user` (Protegido)

```
┌─────────┐
│ Cliente │
└────┬────┘
     │
     │ 1. GET /api/auth/user
     │    Headers:
     │    Authorization: Bearer <token>
     │
     ▼
┌────────────────────┐
│   authenticate()   │
│    Middleware      │
└────┬───────────────┘
     │
     │ 2. Extraer token del header
     │    "Bearer eyJhbGc..."
     │
     ├─► No header? → Error 401
     ├─► No token?  → Error 401
     │
     │ 3. Verificar JWT
     ▼
┌────────────────────┐
│   jwt.verify()     │
│   + JWT_SECRET     │
└────┬───────────────┘
     │
     ├─► Token inválido? → Error 500
     │
     │ 4. Buscar usuario en BD
     ▼
┌────────────────────┐
│ User.findById(id)  │
│  .select(-password)│
└────┬───────────────┘
     │
     ├─► No existe? → Error 404
     │
     │ 5. Agregar usuario a req
     │    req.user = user
     │
     │ 6. Continuar al controller
     ▼
┌────────────────────┐
│  authController    │
│   getUser()        │
│   return req.user  │
└────┬───────────────┘
     │
     │ 7. Respuesta con datos
     ▼
┌────────────────────┐
│   200 OK           │
│  { success, data } │
└────────────────────┘
```

### Código de Ejemplo:

```javascript
// Request
GET /api/auth/user
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response (Éxito)
Status: 200 OK
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "confirmed": false,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}

// Response (Error - No autorizado)
Status: 401 Unauthorized
{
  "error": "No Autorizado"
}

// Response (Error - Token inválido)
Status: 500 Internal Server Error
{
  "error": "Token No Válido"
}
```

---

## Diagrama de Flujo

### Flujo Completo: Registro → Login → Petición Protegida

```
┌──────────────────────────────────────────────────────────┐
│                    REGISTRO                              │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ 1. POST /api/auth/register
                   │    { name, email, password }
                   │
                   ▼
            [Validar email único]
                   │
                   ▼
            [Hash password]
                   │
                   ▼
            [Guardar en BD]
                   │
                   ▼
            [Return: user data]

┌──────────────────┴───────────────────────────────────────┐
│                     LOGIN                                │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ 2. POST /api/auth/login
                   │    { email, password }
                   │
                   ▼
            [Buscar usuario]
                   │
                   ▼
            [Verificar password]
                   │
                   ▼
            [Generar JWT]
                   │
                   ▼
            [Return: user + token]
                   │
                   │ Cliente guarda el token

┌──────────────────┴───────────────────────────────────────┐
│              PETICIÓN PROTEGIDA                          │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ 3. GET /api/auth/user
                   │    Headers: Authorization: Bearer <token>
                   │
                   ▼
         [Middleware authenticate()]
                   │
                   ▼
            [Extraer token]
                   │
                   ▼
            [Verificar JWT]
                   │
                   ▼
            [Buscar usuario]
                   │
                   ▼
            [req.user = user]
                   │
                   ▼
            [Controller]
                   │
                   ▼
            [Return: user data]
```

---

## Seguridad

### 1. Hashing de Contraseñas (bcrypt)
- **Salt rounds:** 10
- **Ubicación:** [auth.js:3-6](backend/src/utils/auth.js#L3-L6)
- Las contraseñas nunca se almacenan en texto plano
- bcrypt genera un salt único para cada contraseña

```javascript
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
```

### 2. JSON Web Tokens (JWT)
- **Algoritmo:** HS256 (HMAC con SHA-256)
- **Expiración:** 180 días
- **Secret:** Almacenado en variable de entorno `JWT_SECRET`
- **Ubicación:** [jwt.js:3-8](backend/src/utils/jwt.js#L3-L8)

```javascript
jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: "180d"
});
```

### 3. Protección de Contraseñas en Respuestas
- El middleware `authenticate()` excluye el campo password al buscar usuarios
- **Ubicación:** [auth.js:25](backend/src/middleware/auth.js#L25)

```javascript
const user = await User.findById(result.id).select("-password");
```

### 4. Formato del Token
- **Header:** `Authorization: Bearer <token>`
- El middleware valida que el header exista y tenga el formato correcto
- **Ubicación:** [auth.js:5-13](backend/src/middleware/auth.js#L5-L13)

### 5. Validación de Email Único
- MongoDB index único en el campo email
- Validación adicional en el controller antes de crear usuario
- **Ubicación:** [authController.js:11-15](backend/src/controllers/authController.js#L11-L15)

### 6. Códigos de Estado HTTP
- **401 Unauthorized:** Token inválido o ausente
- **404 Not Found:** Usuario no encontrado
- **409 Conflict:** Email ya registrado
- **500 Internal Server Error:** Errores del servidor

---

## Variables de Entorno Requeridas

```env
JWT_SECRET=tu_secreto_super_seguro_aqui
PORT=4000
MONGO_URI=mongodb://localhost:27017/mern_books
```

---

## Uso del Sistema de Autenticación

### En el Frontend

```javascript
// 1. Registro
const register = async (userData) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// 2. Login y guardar token
const login = async (credentials) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await response.json();

  // Guardar token en localStorage
  localStorage.setItem('token', data.data.token);
  return data;
};

// 3. Peticiones autenticadas
const getProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/auth/user', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

### Proteger Rutas en el Backend

```javascript
import { authenticate } from './middleware/auth.js';

// Ruta protegida
router.get('/protected-route', authenticate, (req, res) => {
  // req.user contiene los datos del usuario autenticado
  res.json({ user: req.user });
});
```

---

## Mejoras Potenciales

1. **Refresh Tokens:** Implementar sistema de refresh para tokens de corta duración
2. **Confirmación de Email:** Activar la funcionalidad de confirmación (campo `confirmed`)
3. **Rate Limiting:** Limitar intentos de login para prevenir ataques de fuerza bruta
4. **2FA:** Autenticación de dos factores
5. **Password Reset:** Sistema de recuperación de contraseña
6. **Blacklist de Tokens:** Invalidar tokens antes de expiración (logout)
7. **HTTPS Only:** Forzar uso de HTTPS en producción
8. **CORS:** Configuración específica de dominios permitidos

---

## Referencias de Archivos

- [User Model](backend/src/models/User.js)
- [Auth Controller](backend/src/controllers/authController.js)
- [Auth Middleware](backend/src/middleware/auth.js)
- [Auth Utils](backend/src/utils/auth.js)
- [JWT Utils](backend/src/utils/jwt.js)

---
