## Cambio en el botón "Comenzar ahora" (Index)

Hacer que el CTA principal de la home se adapte al estado de sesión y al tipo de usuario verificado desde la base de datos.

### Comportamiento
- **No autenticado**: enlaza a `/auth` con texto "Comenzar ahora" (igual que hoy).
- **Artista**: enlaza a `/create-event` con texto "Crear evento".
- **Fan**: enlaza a `/events` con texto "Explorar eventos" (los fans no pueden crear eventos).

### Implementación (`src/pages/Index.tsx`)
- Convertir el `<a>` estático en un elemento dinámico usando `useState` + `useEffect` para leer la sesión con `supabase.auth.getSession()` y suscribirse a `onAuthStateChange`.
- Verificar el tipo de usuario con `getVerifiedUserType(userId)` de `src/lib/userTypeVerification.ts` (mismo patrón que `UserMenu` y `Events`), difiriendo la llamada con `setTimeout(..., 0)` dentro del listener para evitar deadlocks.
- Usar `<Link>` de `react-router-dom` en lugar de `<a>` para navegación SPA, conservando las mismas clases de estilo (`bg-gradient-to-r from-seekart-green to-seekart-blue …`).
- Mantener el enlace secundario "Ver eventos →" sin cambios.

Sin cambios de backend, esquema ni de otras páginas.
