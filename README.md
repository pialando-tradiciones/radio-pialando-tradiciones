# PIALANDO TRADICIONES — Proyecto completo

Proyecto web/PWA para radio en vivo con dos aplicaciones instalables, panel de administración, configuración central Supabase, funciones Netlify y receptor personalizado para Google Cast.

## 1. Qué incluye

- `/radio/`: aplicación pública para oyentes.
- `/admin/`: panel de administración con PIN validado en servidor.
- `/receiver.html`: receptor web para Google Cast.
- `/`: redirección a `/radio/`.
- Dos manifiestos PWA independientes e iconos distintos.
- Service workers separados; no cachean funciones, administración ni el stream.
- Reproductor real: reproducir/pausar, volumen, silencio, reconexión progresiva, URL de respaldo y Media Session cuando existe.
- Intento de autoplay respetando las políticas del navegador.
- Estado visual EN VIVO / CONECTANDO / FUERA DEL AIRE / comprobación pendiente.
- Texto desplazable configurable en px/s y respeto de `prefers-reduced-motion`.
- Visualizador Web Audio cuando el navegador permite analizar el origen; si no, mantiene una presentación neutra.
- Compartir siempre la URL pública `/radio/`.
- WhatsApp configurable desde el administrador.
- Instalación PWA y ocultamiento del botón cuando el navegador comunica instalación/standalone.
- Configuración central persistente en Supabase.
- Supabase Realtime para avisar cambios a `/radio/` y al receptor TV.
- Subida persistente de imágenes al bucket `radio-images` mediante función de servidor.
- Receptor horizontal adaptable a Full HD/4K.

## 2. Recursos de Pialando incluidos

- `public/assets/fondo-horizontal.png` — recurso horizontal 1536×864.
- `public/assets/fondo-vertical.png` — recurso vertical 864×1536.
- `public/assets/logo-pialando.png` — logo principal.
- `public/assets/logo-radio-dorado.png` — logo alternativo.
- `public/assets/facundo-pialando.png` — recurso de presentación.

No se regeneraron ni deformaron las fotografías entregadas.

## 3. Señal de audio

El proyecto queda preparado con esta URL HTTPS de escucha:

`https://server.laradio.online/proxy/facundo_robles?mp=/stream`

Esta dirección fue comprobada previamente en navegador durante la preparación del proyecto. No se coloca ninguna clave de emisión en el frontend, en el ZIP ni en las URLs públicas.

Si el proveedor cambia el enlace, reemplazalo desde `/admin/` por la nueva URL pública de escucha.

## 4. Variables privadas de Netlify

En Netlify: Site configuration → Environment variables → Add a variable.

### Privadas
- `SUPABASE_SERVICE_ROLE_KEY`: clave service-role de Supabase. Nunca la pongas en archivos públicos.
- `ADMIN_PIN_HASH`: hash PBKDF2 del PIN.
- `SESSION_SECRET`: secreto largo y aleatorio usado para firmar la sesión administrativa.
- `STREAM_SOURCE_PASSWORD`: opcional; solamente si una función del servidor realmente necesita la clave del proveedor.

### Pública / no secreta
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

La función pública puede exponer URL y anon key porque Supabase está diseñado para que la anon key se use con RLS. La service-role nunca se entrega al navegador.

## 5. PIN inicial

El PIN indicado para la primera configuración es `1231`.

En una terminal, dentro del proyecto:

`npm run hash-pin -- 1231`

Copiá la línea resultante `ADMIN_PIN_HASH=...` a la variable privada de Netlify.

Después podés generar otro PIN y reemplazar el hash sin tocar el código.

## 6. SESSION_SECRET

Generá una cadena larga y aleatoria. Ejemplo en PowerShell:

`[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))`

Usá un secreto diferente para cada proyecto.

## 7. Supabase paso a paso

1. Crear un proyecto en Supabase.
2. Abrir SQL Editor.
3. Ejecutar `supabase/schema.sql`.
4. Comprobar que existe `public.radio_config`.
5. Comprobar que existe el bucket `radio-images`.
6. En Database → Publications / Realtime, comprobar que `radio_config` está incluido en `supabase_realtime`.
7. Copiar `Project URL` como `SUPABASE_URL`.
8. Copiar la clave `anon`/public como `SUPABASE_ANON_KEY`.
9. Copiar la `service_role` únicamente a la variable privada `SUPABASE_SERVICE_ROLE_KEY` de Netlify.

La tabla pública solo tiene permiso de lectura. No hay políticas públicas de escritura. Las funciones de Netlify escriben usando la service-role después de validar la sesión.

## 8. Instalar y publicar con Netlify

### Preparación
Instalá Node.js LTS y Netlify CLI.

`npm install -g netlify-cli`

Dentro de la carpeta del proyecto:

`npm install`

`netlify login`

`netlify link`

Si vas a crear un sitio nuevo:

`netlify init`

### Variables
Configurá las cinco variables privadas/públicas indicadas arriba desde el panel de Netlify. No las pongas en `public/`.

### Publicación

`netlify deploy --prod`

El archivo `netlify.toml` ya indica:

- frontend: `public`
- funciones: `netlify/functions`
- redirección raíz a `/radio/`
- rutas `/radio/` y `/admin/`
- cabeceras para no cachear funciones y service workers.

## 9. Primera configuración

1. Abrí `https://TU-SITIO.netlify.app/admin/`.
2. Ingresá `1231`.
3. Verificá la URL HTTPS de audio.
4. Pulsá `Probar conexión`.
5. Configurá textos, velocidad, WhatsApp e imágenes.
6. Pulsá `Guardar y publicar`.
7. Abrí `/radio/` en otro dispositivo.
8. Con Supabase Realtime configurado, las instancias abiertas reciben la nueva configuración sin recargar. Si un dispositivo estaba cerrado/suspendido, recuperará la última versión al volver a conectarse.

## 10. Instalación

### Android/Chrome/Edge
Abrí `/radio/` y usá el botón `Instalar` cuando el navegador lo ofrezca. El navegador decide cuándo `beforeinstallprompt` es elegible.

### iPhone/iPad
Safari → Compartir → Añadir a pantalla de inicio. iOS no ofrece el mismo `beforeinstallprompt` que Chrome/Android.

### Windows/macOS
Chrome/Edge pueden ofrecer instalación de la PWA desde el menú del navegador. La detección depende del navegador y del sistema.

Las identidades son distintas: `/radio/` usa el manifiesto e icono de Pialando; `/admin/` usa otro nombre e icono con distintivo de administración.

## 11. Chromecast

El proyecto incluye un receptor personalizado en `/receiver.html`.

Para usarlo:

1. Publicá el sitio por HTTPS.
2. Registrá el receptor en Google Cast Developer Console.
3. Usá la URL HTTPS del receptor que corresponda al sitio.
4. Obtené el Application ID.
5. En `/admin/`, cargá ese ID en `TV / CHROMECAST`.
6. Guardá y publicá.
7. En un navegador compatible con Google Cast, usá `TV`.

No se afirma que Chromecast esté disponible en todos los navegadores. En particular, Google Cast Web Sender no está disponible en Chrome para iOS. AirPlay, cuando aparece en Safari/dispositivo, es una alternativa diferente y no garantiza el receptor personalizado.

Si todavía no tenés Application ID, el receptor puede quedar publicado pero el botón Cast permanecerá sin sesión hasta configurarlo.

## 12. Seguridad

- PIN validado en servidor.
- Hash PBKDF2 con saltos y 150.000 iteraciones.
- Bloqueo temporal después de múltiples intentos fallidos desde la misma dirección observada.
- Cookie de sesión HttpOnly, Secure y SameSite=Strict.
- Expiración de sesión de 2 horas.
- Escrituras centralizadas mediante Netlify Functions.
- Service-role nunca enviada al cliente.
- Clave de transmisión nunca incluida en el frontend.
- Service workers excluyen funciones y streams del caché.

## 13. Qué se probó y qué queda pendiente

### Comprobado durante la preparación
- La señal HTTPS indicada reproduce audio en navegador.
- El proyecto contiene las rutas y funciones requeridas.
- Se generaron iconos separados para radio y administrador.
- La lógica de publicación, sesión, almacenamiento y Realtime está preparada.

### Pendiente de prueba física/externa
- iPhone/iPad real.
- Instalación en Windows/macOS real.
- Chromecast físico.
- Google Cast Developer Console y Application ID real.
- Sincronización Realtime entre dos dispositivos con las credenciales reales de Supabase.
- Carga real de imágenes en el bucket con las credenciales del proyecto.

Estas pruebas no se presentan como realizadas porque no se dispone de esos dispositivos/cuentas en este entorno.
