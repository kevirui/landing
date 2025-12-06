# Key Protocol

Landing page de Key Protocol construida con Astro, React y Tailwind CSS.

## 🚀 Tecnologías

- **Astro** - Framework web moderno
- **React** - Biblioteca UI
- **Tailwind CSS** - Framework CSS
- **Resend** - Servicio de envío de correos electrónicos
- **i18next** - Internacionalización (ES, EN, PT)
- **Vercel** - Plataforma de despliegue

## 📋 Requisitos

- Node.js >= 22.0.0 < 23.0.0
- pnpm (recomendado) o npm

## 🛠️ Instalación

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Construir para producción
pnpm build

# Vista previa de producción
pnpm preview
```

## 📧 Configuración del Formulario de Contacto

El formulario de contacto utiliza **Resend** para enviar correos electrónicos. Para configurarlo:

### 1. Obtener API Key de Resend

1. Ve a [https://resend.com/](https://resend.com/)
2. Crea una cuenta o inicia sesión
3. Navega a **API Keys** en el dashboard
4. Crea una nueva API Key
5. Copia la API Key (comienza con `re_`)

### 2. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto o configura las variables en Vercel:

```env
# API Key de Resend (REQUERIDO en producción)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email desde el cual se enviará el correo
# Si no tienes un dominio verificado, usa: onboarding@resend.dev
# Si tienes un dominio verificado, usa: contacto@tudominio.com
RESEND_FROM_EMAIL=onboarding@resend.dev

# Email destinatario (a dónde llegarán los mensajes del formulario)
RESEND_TO_EMAIL=tu-email@ejemplo.com
```

### 3. Configuración en Vercel

Si el proyecto está desplegado en Vercel:

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Navega a **Settings** → **Environment Variables**
3. Agrega las siguientes variables:
   - `RESEND_API_KEY`: Tu API Key de Resend
   - `RESEND_TO_EMAIL`: Tu correo personal donde recibirás los mensajes
   - `RESEND_FROM_EMAIL`: (Opcional) Email remitente, por defecto `onboarding@resend.dev`
4. Redespliega la aplicación

### 4. Verificación de Dominio (Opcional)

Para usar un dominio personalizado como remitente:

1. En el dashboard de Resend, ve a **Domains**
2. Agrega y verifica tu dominio
3. Una vez verificado, actualiza `RESEND_FROM_EMAIL` con un email de tu dominio (ej: `contacto@tudominio.com`)

### 5. Probar el Formulario

- **En desarrollo**: Los correos se mostrarán en la consola si no hay `RESEND_API_KEY` configurada
- **En producción**: Los correos se enviarán a través de Resend cuando todas las variables estén configuradas

## 📁 Estructura del Proyecto

```
├── public/              # Archivos estáticos
│   ├── icons/          # Iconos y logos
│   ├── imgs/           # Imágenes
│   └── videos/         # Videos
├── src/
│   ├── components/     # Componentes React y Astro
│   │   ├── Contact/    # Formulario de contacto
│   │   ├── Hero/       # Sección hero
│   │   └── ...
│   ├── i18n/           # Configuración de internacionalización
│   │   └── locales/    # Traducciones (es.json, en.json, pt.json)
│   ├── layouts/        # Layouts de Astro
│   ├── pages/          # Páginas y rutas
│   │   └── api/        # API endpoints
│   │       └── contact.ts  # Endpoint del formulario de contacto
│   ├── styles/         # Estilos globales
│   └── types/          # Tipos TypeScript
├── astro.config.mjs    # Configuración de Astro
├── package.json        # Dependencias y scripts
└── vercel.json         # Configuración de Vercel
```

## 🎯 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia servidor de desarrollo en http://localhost:4321

# Producción
pnpm build            # Construye el proyecto
pnpm preview          # Vista previa de la build de producción

# Calidad de código
pnpm lint             # Ejecuta ESLint
pnpm lint:fix         # Ejecuta ESLint y corrige errores
pnpm format           # Formatea código con Prettier
pnpm format:check     # Verifica formato sin modificar archivos
```

## 🌐 Internacionalización

El proyecto soporta múltiples idiomas:

- Español (ES)
- Inglés (EN)
- Portugués (PT)

Los archivos de traducción se encuentran en `src/i18n/locales/`.

## 🔧 API Endpoints

### POST `/api/contact`

Endpoint para procesar el formulario de contacto.

**Body (FormData):**

- `name` (string, requerido): Nombre del usuario
- `email` (string, requerido): Email del usuario
- `socialNetwork` (string, opcional): Red social
- `message` (string, requerido): Mensaje

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "message": "Mensaje enviado exitosamente."
}
```

**Respuesta de error (400/500):**

```json
{
  "error": "Mensaje de error descriptivo"
}
```

## 📝 Notas Adicionales

- El proyecto está configurado para usar `serverless` en Vercel
- En modo desarrollo, si no hay `RESEND_API_KEY`, los correos se mostrarán en la consola
- El formulario de contacto incluye validación de campos requeridos y formato de email

## 📄 Licencia

[Especificar licencia si aplica] -> Necesitamos una licencia si queremos privatizarla
