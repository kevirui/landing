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

El formulario de contacto utiliza **SendGrid** para enviar correos electrónicos. SendGrid permite enviar correos a cualquier destinatario sin restricciones del dominio de prueba.

### 1. Crear cuenta en SendGrid

1. Ve a [https://sendgrid.com/](https://sendgrid.com/)
2. Crea una cuenta gratuita (permite 100 emails/día)
3. Completa la verificación de email

### 2. Crear API Key en SendGrid

1. Una vez en tu cuenta, ve a **Settings** → **API Keys**
2. Haz clic en **Create API Key**
3. Nombre: "Key Protocol Contact Form" (o el que prefieras)
4. Permisos: Selecciona **Full Access** o **Restricted Access** con permisos de "Mail Send"
5. Haz clic en **Create & View**
6. **IMPORTANTE**: Copia la API Key inmediatamente (solo se muestra una vez)
   - La API Key comienza con `SG.`

### 3. Verificar un remitente (Sender Identity)

Para poder enviar correos, necesitas verificar un remitente:

#### Opción A: Verificar un solo email (más rápido para pruebas)

1. Ve a **Settings** → **Sender Authentication** → **Single Sender Verification**
2. Haz clic en **Create New Sender**
3. Completa el formulario:
   - **From Email**: `noreply@keyprotocol.com` (o cualquier email)
   - **From Name**: `Key Protocol`
   - **Reply To**: Tu email personal (ej: `martinlago84@gmail.com`)
   - **Company Address**: Tu dirección
4. Verifica el email que recibirás
5. Una vez verificado, podrás usarlo en `SENDGRID_FROM_EMAIL`

#### Opción B: Verificar un dominio (recomendado para producción)

1. Ve a **Settings** → **Sender Authentication** → **Domain Authentication**
2. Haz clic en **Authenticate Your Domain**
3. Selecciona tu proveedor DNS
4. Agrega los registros DNS que SendGrid te proporciona
5. Espera la verificación (puede tardar hasta 48 horas, pero normalmente es más rápido)

### 4. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Key de SendGrid (REQUERIDO en producción)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email desde el cual se enviará el correo (debe estar verificado en SendGrid)
SENDGRID_FROM_EMAIL=noreply@keyprotocol.com

# Email destinatario (a dónde llegarán los mensajes del formulario)
SENDGRID_TO_EMAIL=martinlago84@gmail.com
```

### 5. Configuración en Vercel

Si el proyecto está desplegado en Vercel:

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Navega a **Settings** → **Environment Variables**
3. Agrega las siguientes variables:
   - `SENDGRID_API_KEY`: Tu API Key de SendGrid (comienza con `SG.`)
   - `SENDGRID_FROM_EMAIL`: El email verificado en SendGrid
   - `SENDGRID_TO_EMAIL`: Tu correo personal donde recibirás los mensajes (ej: `martinlago84@gmail.com`)
4. Redespliega la aplicación

### 6. Probar el Formulario

- **En desarrollo**: Los correos se mostrarán en la consola si no hay `SENDGRID_API_KEY` configurada
- **En producción**: Los correos se enviarán a través de SendGrid cuando todas las variables estén configuradas

### 7. Límites del plan gratuito

- **100 emails/día** gratis
- Sin límite de destinatarios (puedes enviar a cualquier email)
- Ideal para landing pages pequeñas/medianas

### 8. Solución de Problemas

#### Error 403 (Forbidden) de SendGrid

Si recibes un error `403 Forbidden` al enviar el formulario, verifica:

1. **Email remitente no verificado**:
   - El email en `SENDGRID_FROM_EMAIL` debe estar verificado en SendGrid
   - Ve a **Settings** → **Sender Authentication** → **Single Sender Verification**
   - Verifica que el email esté en estado "Verified"

2. **API Key sin permisos**:
   - La API Key debe tener permisos de "Mail Send"
   - Ve a **Settings** → **API Keys**
   - Edita tu API Key y asegúrate de que tenga permisos de "Mail Send" o "Full Access"

3. **Formato de API Key incorrecto**:
   - La API Key debe comenzar con `SG.`
   - Verifica que no tenga espacios o caracteres extra

4. **API Key inválida o revocada**:
   - Genera una nueva API Key en SendGrid
   - Actualiza la variable `SENDGRID_API_KEY` en tu `.env` o en Vercel

## 📁 Estructura del Proyecto

```text
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
- `socialNetwork` (string, opcional): Asunto
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
