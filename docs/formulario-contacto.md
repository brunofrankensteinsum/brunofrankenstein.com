# Formulario de contacto: cómo funciona y qué configurar

El correo de Bruno **no aparece en ningún lado** del sitio ni del repositorio. Quien quiere escribirle usa
el formulario de la página Contacto. Mientras no se haga la configuración de abajo, el formulario valida
pero avisa «El formulario todavía no está conectado» y ofrece escribir por LinkedIn.

## Cómo viaja un mensaje

1. La persona completa el formulario. El navegador revisa los campos y Turnstile (el antispam de
   Cloudflare, casi siempre invisible) comprueba que sea una persona.
2. El navegador manda el mensaje a `/api/contacto`, que atiende `worker/index.js`.
3. El servidor **vuelve a revisar todo** (lo que valida el navegador no sirve contra un robot):
   que el pedido venga de este mismo sitio, que sea chico, que los campos sean válidos, que el
   token de Turnstile sea auténtico y que no haya saltos de línea escondidos en el nombre o el email.
4. Si todo está bien, manda un correo a Bruno desde `formulario@brunofrankenstein.com`. Al apretar
   «Responder», la respuesta va a la persona que escribió (cabecera `Reply-To`).

Protecciones: campo trampa invisible · tiempo mínimo de 3 s · Turnstile · validación en el servidor ·
límite de tamaño (10 000 caracteres) · solo acepta pedidos del propio sitio · el correo no admite
cabeceras inyectadas · el correo de destino es un secreto de Cloudflare.

## Configuración (una sola vez, en el panel de Cloudflare)

### 1. Activar Email Routing y verificar tu correo
1. Cloudflare → tu dominio `brunofrankenstein.com` → **Email** → **Email Routing** → *Enable*.
   Cloudflare agrega solo unos registros DNS (MX y SPF): aceptalos.
2. En **Destination addresses**, agregá tu correo personal y confirmá el mensaje que te llega.
   Sin este paso, Cloudflare no deja enviar correos a esa dirección.

### 2. Crear el widget de Turnstile
1. Cloudflare → **Turnstile** → *Add widget*.
2. Nombre: `brunofrankenstein.com`. Dominio: `brunofrankenstein.com`. Modo: **Managed**.
3. Te da dos claves:
   - **Site key** (pública): pegala en `src/config/profile.ts`, campo `turnstileSiteKey`
     (o pasásela a Claude), y subí el cambio.
   - **Secret key** (privada): va en el paso siguiente. No la pegues en ningún archivo.

### 3. Cargar los dos secretos
Cloudflare → **Workers & Pages** → `brunofrankenstein-com` → **Settings** → **Variables and secrets** → *Add*:

| Nombre | Tipo | Valor |
|---|---|---|
| `DESTINO` | Secret | tu correo personal (el verificado en el paso 1) |
| `TURNSTILE_SECRET` | Secret | la *Secret key* del paso 2 |

(`REMITENTE` ya está en `wrangler.jsonc` y no es un dato privado.)

### 4. Probar
Cuando el cambio esté publicado, mandá un mensaje de prueba desde `/es/contacto/`. La primera vez,
mirá también la carpeta de spam. Si algo falla, el formulario muestra «No se pudo enviar el mensaje».
En ese caso: Cloudflare → Workers & Pages → `brunofrankenstein-com` → **Logs** muestra el motivo.

### 5. (Recomendado) Límite de envíos
Cloudflare → **Security** → **WAF** → **Rate limiting rules** → crear una regla para
`URI Path equals /api/contacto`, 5 pedidos por minuto por IP, acción *Block*. Es gratis y frena
a quien intente mandar muchos mensajes seguidos.

## Si hay que cambiar algo
- **Otro correo de destino:** cambiar el secreto `DESTINO` en Cloudflare (y verificarlo en Email Routing).
- **Si te llega spam igual:** pasar el widget de Turnstile al modo *Managed* con mayor sensibilidad,
  o agregar la regla del paso 5.
- **Probar el código del servidor:** `npm test` (no hace falta Cloudflare).
- **Probar el formulario en tu computadora:** `npm run dev` simula un envío correcto, sin mandar nada.
  El envío real solo existe en el sitio publicado.
