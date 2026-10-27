# Entregable 1 — Sistema de Reservas

Aplicación full stack para registrarse, iniciar sesión y gestionar los
servicios disponibles para reservar.

## Estructura del repositorio

```
Entregable1_SistemaReservas/
├── SistemaReservas_Backend/    Express + Prisma + PostgreSQL
└── SistemaReservas_Frontend/   Expo + React Native
```

## Backend

- API desplegada:
  <https://programacionaplicada2-tareas-jeremysanchez-production.up.railway.app>
- Modelos: `Usuario` (ADMIN / CLIENTE) y `Servicio`.
- Autenticación con JWT de 24 horas.
- Rutas:
  - `POST /auth/registro`
  - `POST /auth/login`
  - `GET /servicios` (autenticado)
  - `POST /servicios` (admin)
  - `PUT /servicios/:id` (admin)
  - `DELETE /servicios/:id` (admin)

Para correrlo localmente, crea `SistemaReservas_Backend/.env` con
`DATABASE_URL`, `JWT_SECRET` y `PORT`, y ejecuta:

```bash
cd SistemaReservas_Backend
npm install
npm run dev
```

## Frontend

Instrucciones completas en
[`SistemaReservas_Frontend/README.md`](SistemaReservas_Frontend/README.md).

```bash
cd SistemaReservas_Frontend
npm install
npx expo start
```

La URL de la API se configura en `app.config.js` a partir de
`EXPO_PUBLIC_API_URL`.

## Capturas

Las capturas de cada pantalla se guardan en [`capturas/`](capturas/README.md):

1. Registro
2. Login
3. Lista de servicios (usuario administrador)
4. Crear servicio
