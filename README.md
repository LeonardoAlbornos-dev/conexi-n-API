# Explorador de contenido aleatorio

**Materia:** Programación Web III  
**Tecnología:** ASP.NET Core Razor Pages, HTML, CSS y JavaScript  
**Framework:** .NET 10

## Integrantes

- Nombre y apellido: Leonardo Ariel Albornos Millares


## Descripción

Aplicación web que consulta cuatro APIs públicas para mostrar citas, imágenes aleatorias de perros, imágenes aleatorias de gatos y datos curiosos. Cada sección tiene su propio botón y se actualiza sin recargar la página completa.

## APIs utilizadas

| Sección | API | Endpoint |
|---|---|---|
| Citas y autores | DummyJSON | `https://dummyjson.com/quotes/random` |
| Perros | Dog CEO | `https://dog.ceo/api/breeds/image/random` |
| Gatos | CATAAS | `https://cataas.com/cat?json=true` |
| Datos curiosos | Useless Facts | `https://uselessfacts.jsph.pl/api/v2/facts/random?language=en` |

### Nota sobre CATAAS

Se consulta `https://cataas.com/cat?json=true`, que devuelve metadatos en formato JSON. En la respuesta inspeccionada se recibieron los campos `id` y `url`, entre otros. La aplicación utiliza `url` cuando está disponible y, si no, construye la dirección de la imagen con el identificador: `https://cataas.com/cat/{id}`. No se intenta interpretar como JSON la respuesta de una URL que devuelve directamente una imagen.

## Requisitos

- SDK de .NET 10 instalado.
- Visual Studio 2026 con la carga de trabajo de ASP.NET y desarrollo web, o Visual Studio Code.
- Conexión a Internet para consultar las APIs.

## Cómo ejecutar el proyecto

1. Descarga o clona el repositorio.
2. Abre `ExploradorContenido.csproj` con Visual Studio, o abre la carpeta desde una terminal.
3. Restaura las dependencias:

   ```bash
   dotnet restore
   ```

4. Ejecuta la aplicación:

   ```bash
   dotnet run
   ```

5. Abre en el navegador la dirección local que indique la terminal (por ejemplo, `https://localhost:7xxx` o `http://localhost:5xxx`).

No se necesita configurar una base de datos, credenciales ni claves API.

## Organización del proyecto

```text
ExploradorContenido/
├── Pages/
│   ├── Shared/
│   │   └── _Layout.cshtml
│   ├── Index.cshtml
│   ├── Index.cshtml.cs
│   ├── _ViewImports.cshtml
│   └── _ViewStart.cshtml
├── wwwroot/
│   ├── css/
│   │   └── site.css
│   └── js/
│       └── explorador.js
├── ExploradorContenido.csproj
├── Program.cs
└── README.md
```

## Funcionamiento y manejo de errores

- Al ingresar a la página se ejecutan las cuatro consultas de forma independiente.
- Cada botón vuelve a consultar únicamente su API y su tarjeta.
- Se utiliza `fetch()` junto con `async/await`.
- Se verifica `response.ok` antes de procesar el JSON.
- Cada consulta tiene manejo `try/catch` y un estado `finally` para volver a habilitar el botón.
- Se muestra el texto **Cargando...** mientras se consulta.
- Si una API falla, su tarjeta muestra un mensaje comprensible y las otras secciones continúan funcionando.
- Las imágenes utilizan `object-fit: cover` para mantener un tamaño uniforme sin deformarse.
- También se controla el error de descarga de las imágenes.
- La interfaz se adapta a pantallas pequeñas y grandes.

## Preguntas de reflexión

### 1. ¿Qué es un endpoint y cuál utilizaste para cada API?

Un endpoint es una dirección específica de una API a la que se envía una solicitud para acceder a un recurso o realizar una operación. En este proyecto se utilizaron cuatro endpoints mediante el método GET:

- DummyJSON: `https://dummyjson.com/quotes/random`
- Dog CEO: `https://dog.ceo/api/breeds/image/random`
- CATAAS: `https://cataas.com/cat?json=true`
- Useless Facts: `https://uselessfacts.jsph.pl/api/v2/facts/random?language=en`

### 2. ¿Qué diferencia existe entre recibir JSON y recibir directamente una imagen?

JSON es un formato de texto estructurado que representa datos mediante propiedades y valores. Se puede procesar con `response.json()` para acceder a campos como `quote`, `author`, `message` o `text`.

Una imagen es un recurso binario que el navegador puede mostrar directamente usando su dirección en el atributo `src` de una etiqueta `img`. No se debe utilizar `response.json()` sobre una respuesta que contiene directamente los datos binarios de una imagen.

En este proyecto CATAAS devuelve JSON cuando se agrega `?json=true`; ese JSON proporciona la dirección o el identificador de la imagen.

### 3. ¿Qué función cumplen await y response.json()?

`await` permite esperar el resultado de una operación asíncrona dentro de una función declarada con `async`, sin bloquear toda la interfaz mientras se espera.

`response.json()` lee el cuerpo de la respuesta HTTP y lo convierte en un objeto JavaScript para poder acceder a sus propiedades. También es una operación asíncrona, por eso se utiliza junto con `await`.

### 4. ¿Por qué se debe verificar response.ok además de utilizar try/catch?

`try/catch` permite capturar errores, por ejemplo, cuando no hay conexión, ocurre un problema de red o falla el procesamiento de la respuesta.

Sin embargo, `fetch()` normalmente no lanza una excepción cuando el servidor responde con un estado HTTP de error, como 404 o 500. Por eso se verifica `response.ok`, que indica si la respuesta tiene un estado HTTP exitoso. Si es falso, se lanza un error para que pueda manejarse en el bloque `catch`.

### 5. ¿Cómo lograste actualizar una sección sin recargar toda la página?

Se utilizaron funciones JavaScript independientes para cada API y eventos `click` en los botones. Cada función realiza una solicitud con `fetch()` y actualiza únicamente los elementos HTML de su tarjeta mediante propiedades como `textContent` y `src`.

De esta manera, el navegador modifica solo el contenido necesario del DOM, sin recargar la página completa.

## Capturas para la entrega

Antes de entregar, agrega dos capturas reales de la aplicación:

1. **`capturas/01-cuatro-secciones.png`:** muestra las cuatro tarjetas con contenido cargado correctamente.
2. **`capturas/02-error-controlado.png`:** muestra una tarjeta con el mensaje de error controlado. Para obtenerla, desconecta temporalmente Internet o bloquea temporalmente una solicitud, pulsa el botón correspondiente y captura el mensaje.

Crea la carpeta `capturas` y guarda allí las imágenes. No se incluyen capturas ficticias en este proyecto.

## Entrega

- Comprimir el código fuente en ZIP.
- Subir el repositorio a GitHub y pegar su enlace en la plataforma.
- Completar los nombres de los integrantes en este README.
- Incorporar las dos capturas solicitadas.

Si se genera el ZIP desde Visual Studio, excluir las carpetas `bin`, `obj` y `.vs`.
"# conexi-n-API" 
