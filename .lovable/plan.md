Gracias por el aviso. En el plan Free de Supabase los 2 hallazgos que quedan igual se pueden resolver — no requieren plan de pago. Aquí va la guía, sin cambios de código:

## 1. Leaked Password Protection (disponible en Free)

Esta protección compara las contraseñas nuevas contra la base de HaveIBeenPwned y está incluida en todos los planes.

Pasos:
1. Abrir el dashboard del proyecto Supabase.
2. Ir a **Authentication → Providers → Email**.
3. Activar la opción **"Leaked password protection"** (también aparece como "Prevent use of compromised passwords").
4. Guardar.

Efecto: los usuarios no podrán registrarse o cambiar su contraseña usando una filtrada públicamente. No rompe cuentas existentes.

## 2. Postgres desactualizado (también disponible en Free)

Las actualizaciones menores de Postgres con parches de seguridad están disponibles en todos los planes, incluido Free.

Pasos:
1. Dashboard → **Settings → Infrastructure** (a veces aparece como **Database → Infrastructure**).
2. En la sección **Postgres version**, si hay un botón **"Upgrade"** disponible, pulsarlo.
3. Confirmar. El proyecto tendrá unos minutos de downtime durante el reinicio (típicamente 2–5 min).

Recomendación: hacerlo en un momento de bajo tráfico. No se pierde data, es solo un restart con el binario nuevo.

Si el botón de upgrade no aparece, significa que ya estás en la última versión disponible para tu proyecto y el linter se actualizará solo en el próximo scan — en ese caso avísame y lo marco como resuelto.

## Después de aplicar los cambios

Cuando confirmes que hiciste ambos pasos, vuelvo a correr el scan de seguridad y marco los hallazgos como resueltos. No hay nada que tocar en el código.
