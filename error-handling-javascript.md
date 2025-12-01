# Manejo de Errores en JavaScript - Try-Catch

## ¿Qué es Try-Catch?

`try-catch` es una estructura de control en JavaScript que permite manejar errores de forma elegante sin que la aplicación se detenga completamente.

## Sintaxis Básica

```javascript
try {
  // Código que puede generar un error
} catch (error) {
  // Código que se ejecuta si ocurre un error
} finally {
  // Código que SIEMPRE se ejecuta (opcional)
}
```

## Cómo Funciona

### 1. Bloque `try`
- Contiene el código que puede lanzar un error
- JavaScript ejecuta este código línea por línea
- Si ocurre un error, **detiene la ejecución** y salta al bloque `catch`

### 2. Bloque `catch`
- Solo se ejecuta si hay un error en el bloque `try`
- Recibe el objeto de error como parámetro
- Permite manejar el error sin detener toda la aplicación

### 3. Bloque `finally` (opcional)
- Se ejecuta **SIEMPRE**, haya error o no
- Útil para limpiar recursos (cerrar conexiones, archivos, etc.)

## Ejemplo del Código Seleccionado

```javascript
export const getBooks = async (req, res) => {
  try {
    // Intenta obtener los libros de la base de datos
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    // Si algo falla (BD no disponible, error de conexión, etc.)
    console.error(error);
    res.status(500).json({ error: "Error al obtener los libros" });
  }
};
```

### Flujo de Ejecución:

1. **Caso exitoso:**
   - Se ejecuta `Book.find()`
   - Se obtienen los libros
   - Se envía `res.json(books)`
   - El `catch` NO se ejecuta

2. **Caso con error:**
   - Se ejecuta `Book.find()`
   - Ocurre un error (ej: BD desconectada)
   - Se salta inmediatamente al `catch`
   - Se registra el error en consola
   - Se envía respuesta de error 500 al cliente

## Tipos de Errores en JavaScript

### 1. SyntaxError
```javascript
try {
  eval('hola mundo ='); // Sintaxis inválida
} catch (error) {
  console.log(error.name); // "SyntaxError"
}
```

### 2. ReferenceError
```javascript
try {
  console.log(variableQueNoExiste);
} catch (error) {
  console.log(error.name); // "ReferenceError"
}
```

### 3. TypeError
```javascript
try {
  null.toString(); // No se puede llamar método en null
} catch (error) {
  console.log(error.name); // "TypeError"
}
```

### 4. RangeError
```javascript
try {
  let arr = new Array(-1); // Tamaño inválido
} catch (error) {
  console.log(error.name); // "RangeError"
}
```

## Objeto Error

Cuando ocurre un error, JavaScript crea un objeto con propiedades útiles:

```javascript
try {
  throw new Error("Algo salió mal");
} catch (error) {
  console.log(error.name);     // "Error"
  console.log(error.message);  // "Algo salió mal"
  console.log(error.stack);    // Traza completa del error
}
```

## Lanzar Errores Personalizados

Puedes crear tus propios errores con `throw`:

```javascript
function dividir(a, b) {
  try {
    if (b === 0) {
      throw new Error("No se puede dividir por cero");
    }
    return a / b;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

dividir(10, 0); // "No se puede dividir por cero"
```

## Try-Catch con Async/Await

En funciones asíncronas, `try-catch` captura errores de Promises:

```javascript
async function obtenerUsuario(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw error; // Re-lanzar si es necesario
  }
}
```

## Ejemplo con Finally

```javascript
async function procesarArchivo() {
  let archivo = null;
  try {
    archivo = await abrirArchivo('datos.txt');
    const contenido = await leerArchivo(archivo);
    return contenido;
  } catch (error) {
    console.error("Error procesando archivo:", error);
  } finally {
    // Esto SIEMPRE se ejecuta
    if (archivo) {
      await cerrarArchivo(archivo);
    }
  }
}
```

## Mejores Prácticas

### ✅ Hacer

1. **Capturar errores específicos**
```javascript
try {
  await operacionBaseDatos();
} catch (error) {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  return res.status(500).json({ error: "Error interno" });
}
```

2. **Registrar errores para debugging**
```javascript
catch (error) {
  console.error('Error detallado:', error);
  logger.error(error); // Usar logger en producción
  res.status(500).json({ error: "Error del servidor" });
}
```

3. **No exponer detalles internos al cliente**
```javascript
catch (error) {
  // ❌ MAL
  res.status(500).json({ error: error.stack });

  // ✅ BIEN
  res.status(500).json({ error: "Error al procesar solicitud" });
}
```

### ❌ Evitar

1. **Bloques catch vacíos** (ocultan errores)
```javascript
try {
  operacionImportante();
} catch (error) {
  // ❌ No hacer nada es peligroso
}
```

2. **Try-catch innecesarios**
```javascript
// ❌ No necesario
try {
  const suma = 2 + 2;
} catch (error) {
  console.log(error);
}
```

3. **Capturar y no hacer nada útil**
```javascript
try {
  await guardarDatos();
} catch (error) {
  console.log("Error"); // ❌ Muy genérico, sin información
}
```

## Error Handling en Express (Tu Ejemplo)

Para aplicaciones Express, es común crear un middleware de manejo de errores:

```javascript
// Middleware de manejo de errores global
app.use((error, req, res, next) => {
  console.error(error.stack);

  res.status(error.status || 500).json({
    error: {
      message: error.message || "Error interno del servidor",
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  });
});

// En tus controladores
export const getBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    next(error); // Pasar al middleware de errores
  }
};
```

## Alternativa: Promise.catch()

Cuando trabajas con Promises sin async/await:

```javascript
Book.find()
  .sort({ createdAt: -1 })
  .then(books => res.json(books))
  .catch(error => {
    console.error(error);
    res.status(500).json({ error: "Error al obtener libros" });
  });
```

## Resumen

- **try**: Ejecuta código que puede fallar
- **catch**: Maneja el error si ocurre
- **finally**: Código que siempre se ejecuta
- **throw**: Lanza errores personalizados
- Siempre registra errores para debugging
- No expongas detalles internos al usuario
- En Express, considera usar middleware de errores global

---

📚 **Recuerda:** El manejo de errores adecuado hace tu aplicación más robusta y fácil de mantener.
