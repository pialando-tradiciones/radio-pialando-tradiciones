# PIALANDO TRADICIONES — versión Cloudflare Pages

Esta versión conserva la radio PWA, el administrador y Supabase, y adapta las funciones de servidor a Cloudflare Pages Functions. No incluye secretos reales.

## Importante antes de publicar
- El sitio actual de Netlify no se modifica. Primero publicaremos esta versión en una URL de prueba de Cloudflare.
- No borres ni cierres el sitio Netlify hasta comprobar la radio, el acceso al panel y el guardado en la nueva URL.
- No subas archivos `.dev.vars` ni secretos a un repositorio público.

## Variables de entorno en Cloudflare
En Settings → Variables and Secrets, configura para Production y Preview según corresponda:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (secreto)
- `ADMIN_PIN_HASH` (secreto; formato `pbkdf2$150000$salt$hash`)
- `SESSION_SECRET` (secreto largo y aleatorio)

Usa los valores de Supabase que ya tienes. No compartas los valores secretos en capturas ni en el chat. Para `ADMIN_PIN_HASH`, puedes generar uno desde un entorno Node con `npm run hash-pin -- 1231`; cambia el PIN después de probar si deseas otro.

## Publicación recomendada
Cloudflare Pages Functions necesita que la carpeta `functions/` se publique junto al directorio de activos `public/`. Lo más sencillo es importar un repositorio Git (por ejemplo, GitHub) en Cloudflare Pages:
1. Crea un repositorio privado nuevo.
2. Sube el contenido completo de esta carpeta a la raíz del repositorio (incluidas `functions/` y `public/`).
3. En Cloudflare Dashboard, Workers & Pages → Create → Pages → Connect to Git.
4. Selecciona el repositorio. Build command: dejar vacío (o `npm run build` si Cloudflare requiere uno). Build output directory: `public`.
5. Antes de probar el administrador, añade las variables de entorno indicadas arriba y vuelve a desplegar.
6. Prueba la URL nueva: `/radio/`, luego `/admin/`; revisa audio, imágenes y guardado.

## Funciones API
- `GET /api/public-config`
- `POST /api/admin-login`
- `GET /api/admin-config`
- `PUT /api/admin-config`
- `POST /api/admin-upload`
- `POST /api/admin-logout`

## Qué se corrigió en esta versión
- Migración de funciones Netlify a Cloudflare Pages Functions con Web Crypto.
- Corrección de la asignación de vistas previas de imágenes en el administrador.
- Campos para configurar enlaces de Facebook, YouTube, TikTok e Instagram.
- La radio pública existente en Netlify se conserva intacta durante la prueba.

No se afirma que el despliegue haya sido probado en la cuenta del usuario; se debe validar allí antes de cambiar enlaces públicos.
