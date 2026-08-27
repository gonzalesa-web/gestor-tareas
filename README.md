# Gestor estratégico de tareas

SPA de gestión de tareas con autenticación, persistencia en la nube por usuario,
envío de resúmenes por email y deploy en producción.

**URL de producción:** https://gestor-tareas-rouge.vercel.app

## Stack

- React + TypeScript + Vite
- Firebase Authentication (email/password y Google)
- Cloud Firestore (persistencia en tiempo real con `onSnapshot`)
- AWS SES invocado desde una Vercel Function
- Vitest + React Testing Library
- Deploy en Vercel

## Funcionalidades

- Registro, login (email/password y Google) y logout.
- Rutas privadas protegidas con `ProtectedRoute`.
- CRUD completo de tareas con sincronización automática de la UI.
- Filtros por estado (todas / pendientes / completadas).
- Envío de un resumen de tareas por email.
- Interfaz responsive con enfoque mobile first.

## Decisiones arquitectónicas

**Organización por capas.** El código se separa en `pages`, `components`, `hooks`,
`services`, `routes`, `types` y `utils`. Los componentes describen qué se muestra;
los hooks y servicios resuelven cómo se obtienen los datos.

**`api/` en lugar de `functions/`.** Vercel detecta automáticamente las serverless
functions en la carpeta `api/` de la raíz, por lo que se usó esa convención en vez
de la sugerida `functions/`.

**Orden de tareas en el cliente.** Combinar `where("userId", ...)` con
`orderBy("createdAt")` en Firestore exige un índice compuesto. Como el volumen de
tareas por usuario es bajo, se resolvió el orden en memoria tras recibir el snapshot.

**Prefijo de variables de AWS.** Vercel reserva los nombres que empiezan con `AWS_`,
por lo que las credenciales se nombran `SES_ACCESS_KEY_ID` y `SES_SECRET_ACCESS_KEY`.

## Seguridad

- Ninguna credencial está en el código: todo se lee de variables de entorno.
- `.env` está en `.gitignore`; el repositorio incluye solo `.env.example`.
- Las credenciales de AWS existen únicamente en el servidor (Vercel Function).
  El frontend llama a `/api/send-summary`, nunca a AWS directamente.
- Las reglas de Firestore restringen lectura, escritura y borrado al dueño del
  documento (`resource.data.userId == request.auth.uid`). Están versionadas en
  [`firestore.rules`](./firestore.rules) y se despliegan con
  `firebase deploy --only firestore:rules` (requiere Firebase CLI y estar
  logueado en el proyecto correspondiente).

## Instalación local

```bash
git clone https://github.com/gonzalesa-web/gestor-tareas.git
cd gestor-tareas
npm install
cp .env.example .env   # completar con las credenciales de Firebase
npm run dev
```

## Variables de entorno

| Variable | Dónde se usa | Descripción |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Frontend | Credenciales del proyecto Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Frontend | |
| `VITE_FIREBASE_PROJECT_ID` | Frontend | |
| `VITE_FIREBASE_STORAGE_BUCKET` | Frontend | |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Frontend | |
| `VITE_FIREBASE_APP_ID` | Frontend | |
| `SES_ACCESS_KEY_ID` | Serverless | Access key de un usuario IAM con permisos de SES |
| `SES_SECRET_ACCESS_KEY` | Serverless | Secret key de ese usuario IAM |
| `SES_SENDER_EMAIL` | Serverless | Remitente verificado en SES |
| `AWS_SES_REGION` | Serverless | Región de SES (us-east-1) |

## Flujo de envío de emails

1. El usuario pulsa "Enviarme el resumen por email" en la vista de tareas.
2. `email.service.ts` hace un `POST` a `/api/send-summary` con el correo del
   usuario autenticado y la lista de tareas.
3. La Vercel Function valida el payload (formato de email y forma de la lista)
   antes de llamar a AWS.
4. La función arma el HTML del resumen y ejecuta `SendEmailCommand` del SDK de
   AWS SES con credenciales que solo existen en el servidor.
5. AWS SES opera en modo sandbox: solo entrega a direcciones verificadas en la
   consola de SES.

## Testing

```bash
npm run test
```

16 tests cubriendo: funciones puras de resumen, filtrado y validación;
traducción de errores de Firebase; comportamiento de `TaskForm` y `TaskList`
(estados vacío, de carga y de error); y el envío del resumen con el servicio
de email mockeado.

## Uso de IA en el desarrollo

Usé IA como apoyo durante todo el desarrollo, priorizando entender cada pieza
antes de integrarla, en vez de copiar soluciones completas sin revisarlas.

**Patrón que mejor funcionó: pedir pasos, no soluciones completas.** Fui
integrando cada capa (servicios, hooks, rutas, componentes) verificando que
funcionara antes de seguir. Eso permitió detectar temprano decisiones como
ordenar las tareas en el cliente en vez de usar un índice compuesto en Firestore.

**Depuración guiada por logs reales.** Al desplegar, el build falló porque un
archivo (`src/types/task.ts`) no se había creado realmente, aunque en local no
se notaba. Después, el envío de email devolvía error 500 con el mensaje de AWS
"Missing final '@domain'", que llevó a revisar y corregir la variable de entorno
`SES_SENDER_EMAIL` en Vercel. Interpretar los logs de Vercel y los errores
específicos de AWS SES (en vez de solo pedirle a la IA "arréglalo") fue clave
para entender qué estaba pasando en cada capa.

**Verificación cruzada con la documentación oficial.** Se contrastó con
documentación de Vercel que las variables de entorno no pueden empezar con el
prefijo `AWS_`, lo que explicó por qué había que nombrarlas `SES_ACCESS_KEY_ID`
en vez de `AWS_ACCESS_KEY_ID`.

**Dónde fue menos efectiva.** En la configuración de las consolas de Firebase y
AWS, donde la interfaz cambia seguido y es más confiable seguir la
documentación oficial paso a paso.