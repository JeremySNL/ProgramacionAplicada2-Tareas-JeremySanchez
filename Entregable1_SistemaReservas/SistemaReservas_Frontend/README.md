# Sistema de Reservas — Frontend (Expo + React Native)

Aplicación móvil para registrarse, iniciar sesión y gestionar los servicios
disponibles para reservar. Consume la API Express + Prisma del backend del
entregable.

## Requisitos

- Node.js 22.13 o superior
- Expo Go en el celular, o un emulador de Android/iOS

## Instalación

```bash
npm install
```

## Configuración de la URL de la API

La URL **no está escrita en las pantallas**. Vive en `app.config.js` y se
expone a la aplicación mediante `extra.apiUrl`:

```js
// app.config.js
apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://...'
```

El valor se define en `.env`:

```env
EXPO_PUBLIC_API_URL=https://programacionaplicada2-tareas-jeremysanchez-production.up.railway.app
```

Las pantallas la leen con `Constants.expoConfig.extra.apiUrl` desde
`src/api/client.ts`.

Puedes verificar la configuración resultante con:

```bash
npx expo config --type public
```

## Ejecutar

```bash
npx expo start
```

- `a` → emulador Android
- `i` → simulador iOS (macOS)
- `w` → navegador
- Escanea el QR con Expo Go para probar en un celular físico

La API está desplegada en Railway, así que el celular no necesita estar en la
misma red que la computadora.

## Pantallas

| Pantalla | Ruta | Acceso |
| --- | --- | --- |
| Login | `/login` | Público |
| Registro | `/registro` | Público |
| Lista de servicios | `/` | Autenticado |
| Crear servicio | `/crear-servicio` | Solo `ADMIN` |

El rol se elige en el registro y se envía al backend en el campo `rol`
(`CLIENTE` o `ADMIN`).

## Manejo de sesión

- El token JWT se guarda en **AsyncStorage** (`src/auth/storage.ts`).
- Al abrir la app se valida la fecha `exp` del token antes de restaurar la
  sesión.
- Si una petición autenticada devuelve `401`, el cliente de API cierra la
  sesión y `Stack.Protected` redirige automáticamente al login.
- Además, un temporizador cierra la sesión exactamente cuando el token vence.

## Estructura

```
src/
  app/
    _layout.tsx          Proveedor de sesión + rutas protegidas
    login.tsx
    registro.tsx
    (app)/
      _layout.tsx        Stack autenticado + guard de administrador
      index.tsx          Lista de servicios
      crear-servicio.tsx Formulario de creación (solo admin)
  api/
    client.ts            fetch, base URL, manejo de 401
    auth.ts
    servicios.ts
  auth/
    session.tsx          Contexto de sesión
    storage.ts           AsyncStorage
    jwt.ts               Decodificación y expiración del token
  components/
    ui.tsx               Button, TextField, ErrorBanner, LoadingView, Card
  types/
    api.ts
```

## Verificación

```bash
npx tsc --noEmit
npx expo-doctor
```
