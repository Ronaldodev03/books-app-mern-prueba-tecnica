# Books Manager - Aplicación MERN Full Stack

![Todo App Preview](./todo.png)

Sistema completo de gestión de libros construido con el stack MERN (MongoDB, Express, React, Node.js). Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre una colección de libros.

## Descripción General

Este proyecto es una aplicación web full-stack que demuestra la implementación de un CRUD completo utilizando tecnologías modernas de JavaScript. Incluye dos versiones del frontend: una versión simple ideal para aprendizaje y una versión profesional optimizada para producción.

## Tecnologías Principales

### Backend
- **Node.js** - Entorno de ejecución de JavaScript
- **Express.js** - Framework web minimalista
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Express Validator** - Validación de datos

### Frontend
- **React 18** - Librería de interfaz de usuario
- **Vite** - Build tool y dev server
- **TanStack Query** - Gestión de estado del servidor
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Tailwind CSS** - Framework de estilos
- **Axios** - Cliente HTTP

## Estructura del Proyecto

```
proyecto_mern_books/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Configuración de MongoDB
│   │   ├── controllers/
│   │   │   └── bookController.js  # Lógica de negocio
│   │   ├── middleware/
│   │   │   └── validation.js      # Middleware de validación
│   │   ├── models/
│   │   │   └── Book.js            # Modelo de datos
│   │   ├── routes/
│   │   │   └── bookRoutes.js      # Definición de rutas
│   │   └── index.js               # Punto de entrada
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── books.js           # Cliente de API
│   │   ├── components/
│   │   │   └── Header.jsx         # Navegación
│   │   ├── pages/
│   │   │   ├── BooksPage.jsx      # Versión simple
│   │   │   └── BooksPagePro.jsx   # Versión pro
│   │   ├── Router.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## Características

### Funcionalidades Implementadas
✅ CRUD completo de libros (Crear, Leer, Actualizar, Eliminar)
✅ Validación en cliente y servidor
✅ Manejo de errores robusto
✅ Estados de carga y feedback visual
✅ Confirmaciones de acciones destructivas
✅ Interfaz responsive y moderna
✅ Dos versiones de implementación (Simple y Pro)
✅ API RESTful bien estructurada

### API Endpoints

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/books` | Listar todos los libros | - |
| POST | `/api/books` | Crear un nuevo libro | `{ title: string }` |
| PUT | `/api/books/:id` | Actualizar un libro | `{ title: string }` |
| DELETE | `/api/books/:id` | Eliminar un libro | - |

## Instalación y Configuración

### Prerrequisitos

- Node.js v16 o superior
- MongoDB instalado y corriendo (local o MongoDB Atlas)
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone <url-repositorio>
cd proyecto_mern_books
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en la carpeta backend:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/books_db
# O para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/books_db
```

Iniciar el servidor:

```bash
npm run dev
```

El backend estará corriendo en `http://localhost:4000`

### 3. Configurar el Frontend

```bash
cd frontend
npm install
```

Crear archivo `.env` en la carpeta frontend (opcional):

```env
VITE_API_URL=http://localhost:4000/api
```

Iniciar la aplicación:

```bash
npm run dev
```

El frontend estará corriendo en `http://localhost:5173`

## Uso de la Aplicación

1. **Acceder a la aplicación**
   - Abrir navegador en `http://localhost:5173`

2. **Versión Simple** (/)
   - Implementación con useState y useEffect
   - Ideal para aprendizaje

3. **Versión Pro** (/books-pro)
   - Implementación con TanStack Query y React Hook Form
   - Ideal para producción

### Operaciones Disponibles

#### Crear un libro
1. Ingresar título en el campo de texto
2. Hacer clic en "Add"
3. El libro aparecerá en la lista

#### Editar un libro
1. Hacer clic en "Edit" junto al libro
2. Modificar el título en el campo
3. Hacer clic en "Save" para guardar o "Cancel" para cancelar

#### Eliminar un libro
1. Hacer clic en "Delete" junto al libro
2. Confirmar la acción
3. El libro será eliminado de la lista

## Arquitectura del Sistema

### Backend (API REST)

```
Cliente → Router → Validación → Controller → Modelo → MongoDB
                      ↓
                  Middleware
```

**Flujo de datos:**
1. Cliente envía petición HTTP
2. Router identifica la ruta y método
3. Middleware valida los datos de entrada
4. Controller procesa la lógica de negocio
5. Modelo interactúa con MongoDB
6. Respuesta JSON al cliente

### Frontend (React)

**Versión Simple:**
```
Componente → useState → fetch → API → Actualizar estado → Re-render
```

**Versión Pro:**
```
Componente → React Query → Cache → API → Invalidar cache → Re-render
```

## Validaciones Implementadas

### Backend (Express Validator)
- Título obligatorio y no vacío
- Título debe ser string
- ID debe ser MongoID válido

### Frontend
- **Versión Simple:** Validación manual
- **Versión Pro:** Zod + React Hook Form
  - Título obligatorio (mínimo 1 carácter)
  - Título máximo 100 caracteres

## Modelo de Datos

### Libro (Book)

```javascript
{
  _id: ObjectId,          // Generado automáticamente por MongoDB
  title: String,          // Título del libro (requerido)
  createdAt: Date,        // Fecha de creación (automático)
  updatedAt: Date         // Fecha de última modificación (automático)
}
```

## Scripts Disponibles

### Backend
```bash
npm run dev          # Modo desarrollo con nodemon
npm start            # Modo producción
```

### Frontend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Ejecutar ESLint
```

## Comparación de Versiones Frontend

| Aspecto | Versión Simple | Versión Pro |
|---------|---------------|-------------|
| **Estado** | useState + useEffect | TanStack Query |
| **Formularios** | Controlados manual | React Hook Form |
| **Validación** | Manual en submit | Zod schemas |
| **Cache** | No | Automático |
| **Complejidad** | Baja | Media |
| **Código** | Más líneas | Más declarativo |
| **Performance** | Buena | Excelente |
| **Escalabilidad** | Limitada | Alta |
| **Ideal para** | Aprendizaje | Producción |

## Seguridad

### Implementado
- ✅ Validación de datos en backend y frontend
- ✅ Sanitización de inputs
- ✅ Manejo de errores sin exponer detalles internos
- ✅ CORS configurado

### Recomendaciones para Producción
- [ ] Autenticación y autorización (JWT)
- [ ] Rate limiting
- [ ] Helmet.js para headers de seguridad
- [ ] Variables de entorno seguras
- [ ] HTTPS
- [ ] Sanitización adicional contra XSS y SQL injection

## Testing

Estructura sugerida para tests:

```bash
# Backend
npm test                 # Tests unitarios
npm run test:integration # Tests de integración
npm run test:e2e        # Tests end-to-end

# Frontend
npm test                # Tests de componentes
npm run test:e2e       # Tests con Cypress/Playwright
```

## Deployment

### Backend (Node.js)
- **Render**, **Heroku**, **Railway**, **DigitalOcean**
- Variables de entorno configuradas
- MongoDB Atlas para base de datos en la nube

### Frontend (React)
- **Vercel**, **Netlify**, **GitHub Pages**
- Build optimizado con Vite
- Variables de entorno para API URL
