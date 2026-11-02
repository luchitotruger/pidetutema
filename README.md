# Pide Tu Tema - versión con login DJ seguro

## Incluye
- Acceso público para invitados.
- Login DJ mediante Supabase Auth con correo y contraseña.
- Persistencia y renovación de la sesión del cliente.
- Cierre de sesión.
- Panel DJ oculto hasta autenticar.
- RLS: únicamente el propietario del evento puede modificar sus solicitudes.

## Configuración
1. Ejecuta `supabase.sql` en Supabase > SQL Editor.
2. En Authentication > Users crea el usuario DJ con correo y contraseña.
3. Copia el UUID del usuario y crea el evento con el INSERT incluido al final de `supabase.sql`.
4. Configura en `config.js` la URL, la clave pública anon/publishable y el slug del evento.
5. En Authentication > URL Configuration registra la URL definitiva del sitio.
6. Publica los archivos en Vercel.

## Seguridad
- Nunca publiques `service_role`.
- La interfaz oculta el panel, pero la protección real está en Supabase Auth + RLS.
- Mantén confirmación de correo activa para altas administradas.
- No habilites registro público si sólo Luis administrará los eventos.
