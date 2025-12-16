import type { APIRoute } from 'astro';
import sgMail from '@sendgrid/mail';
import {
  generateEmailHTML,
  generateConfirmationEmailHTML,
} from '@/utils/emailTemplate';

/**
 * API endpoint para manejar el envío de formularios de contacto
 *
 * Funcionalidad:
 * - Recibe los datos del formulario de contacto
 * - Envía un email al equipo de Key Protocol con los detalles del mensaje
 * - Envía un email de confirmación automática al usuario que llenó el formulario
 *
 * Configuración requerida (variables de entorno):
 * - SENDGRID_API_KEY: API key de SendGrid (requerido para producción)
 * - SENDGRID_FROM_EMAIL: Email desde el cual se enviará (requerido en producción)
 * - SENDGRID_TO_EMAIL: Email destinatario (a dónde llegarán los mensajes)
 * - SENDGRID_BCC_EMAIL: Email de Blind Carbon Copy (opcional)
 * - EMAIL_WEBHOOK_URL: URL de webhook alternativa (opcional, como fallback)
 *
 * En modo desarrollo, los emails se registrarán en la consola si no hay API key configurada.
 */

// Mark this endpoint as server-rendered (not static)
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get form data - parse as FormData (standard for HTML forms)
    let name: string | null = null;
    let email: string | null = null;
    let socialNetwork: string | null = null;
    let message: string | null = null;

    const contentType = request.headers.get('content-type') || '';

    try {
      // Parse as FormData (standard for HTML forms sent via fetch)
      const formData = await request.formData();
      name = (formData.get('name') as string) || null;
      email = (formData.get('email') as string) || null;
      socialNetwork = (formData.get('socialNetwork') as string) || null;
      message = (formData.get('message') as string) || null;
    } catch (formDataError: any) {
      // Log the error for debugging
      const errorMessage = formDataError?.message || '';
      console.error('FormData parsing error:', errorMessage);
      console.error('Content-Type received:', contentType);
      console.error('Request method:', request.method);

      // Return a descriptive error
      return new Response(
        JSON.stringify({
          error:
            'Error al procesar los datos del formulario. El formato de los datos no es válido. Por favor, intenta nuevamente.',
          details: import.meta.env.DEV ? errorMessage : undefined,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          error: 'Todos los campos requeridos deben ser completados.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'El formato del email no es válido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare email content
    const emailSubject = `Nuevo mensaje de contacto de ${name}`;
    const emailBody = `
Nuevo mensaje de contacto desde la landing page de Key Protocol:

Nombre: ${name}
Email: ${email}
Asunto: ${socialNetwork || 'No especificada'}
Mensaje:
${message}

---
Este mensaje fue enviado desde el formulario de contacto de la Landing Page de Key Protocol.
    `.trim();

    // Send email using a service
    // Use environment variable for recipient email, fallback to default
    const recipientEmail =
      import.meta.env.SENDGRID_TO_EMAIL || 'general@keyprotocol.ar';

    // From email - debe ser un email verificado en SendGrid o del dominio verificado
    const fromEmail =
      import.meta.env.SENDGRID_FROM_EMAIL || 'landing@keyprotocol.com';

    const bccEmail =
      import.meta.env.SENDGRID_BCC_EMAIL || 'wichidelmonte@gmail.com';

    // Validate email format (reuse the same regex)
    if (!emailRegex.test(recipientEmail)) {
      return new Response(
        JSON.stringify({
          error: `Formato de email destinatario inválido: ${recipientEmail}`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate BCC email format if provided
    if (bccEmail && !emailRegex.test(bccEmail)) {
      return new Response(
        JSON.stringify({
          error: `Formato de email BCC inválido: ${bccEmail}`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let emailSent = false;
    let lastError: string | null = null;

    // Try SendGrid first (recommended for production)
    const SENDGRID_API_KEY = import.meta.env.SENDGRID_API_KEY;
    if (SENDGRID_API_KEY) {
      try {
        // Validate from email format
        if (!emailRegex.test(fromEmail)) {
          throw new Error(`Invalid from email format: ${fromEmail}`);
        }

        // Validate API key format (SendGrid API keys start with "SG.")
        if (!SENDGRID_API_KEY.startsWith('SG.')) {
          console.warn(
            '⚠️  La API key de SendGrid no tiene el formato esperado (debe comenzar con "SG.")'
          );
        }

        // Initialize SendGrid
        sgMail.setApiKey(SENDGRID_API_KEY);

        // Generate HTML content
        const htmlContent = generateEmailHTML(
          name,
          email,
          socialNetwork,
          message
        );

        // Send email via SendGrid
        await sgMail.send({
          from: fromEmail,
          to: recipientEmail,
          bcc: bccEmail,
          subject: emailSubject,
          text: emailBody,
          html: htmlContent,
          replyTo: email,
        });

        console.log('Email sent successfully via SendGrid');
        emailSent = true;

        // Send confirmation email to user
        try {
          const confirmationHtmlContent = generateConfirmationEmailHTML(name);

          await sgMail.send({
            from: fromEmail,
            to: email, // Send to the user's email
            subject: '¡Gracias por contactarnos! - Key Protocol',
            text: `Hola ${name},\n\nHemos recibido tu mensaje correctamente y queremos agradecerte por ponerte en contacto con nosotros.\n\nNuestro equipo revisará tu consulta y te responderemos a la brevedad. Generalmente respondemos en un plazo de 24 a 48 horas hábiles.\n\nSaludos cordiales,\nEl equipo de Key Protocol`,
            html: confirmationHtmlContent,
            replyTo: fromEmail,
          });

          console.log('Confirmation email sent successfully to user');
        } catch (confirmError: any) {
          // Log the error but don't fail the entire request
          console.error(
            'Error sending confirmation email to user:',
            confirmError
          );
          // Don't throw - the main email was sent successfully
        }
      } catch (error: any) {
        console.error('Error sending email via SendGrid:', error);

        // Extract detailed error information
        let errorMessage = 'Error desconocido al enviar el email';
        let errorDetails: any = null;

        if (error.response?.body?.errors) {
          // SendGrid provides detailed error messages
          const sendGridErrors = error.response.body.errors;
          errorDetails = sendGridErrors;

          // Build a more descriptive error message
          if (Array.isArray(sendGridErrors) && sendGridErrors.length > 0) {
            const firstError = sendGridErrors[0];
            errorMessage = firstError.message || errorMessage;

            // Provide specific guidance for common errors
            if (error.code === 403) {
              if (
                firstError.message?.includes('sender') ||
                firstError.message?.includes('from')
              ) {
                errorMessage = `El email remitente "${fromEmail}" no está verificado en SendGrid. Verifica el email en tu cuenta de SendGrid o usa un email verificado.`;
              } else if (
                firstError.message?.includes('permission') ||
                firstError.message?.includes('authorized')
              ) {
                errorMessage =
                  'La API key de SendGrid no tiene permisos para enviar emails. Verifica los permisos de tu API key.';
              } else {
                errorMessage = `SendGrid rechazó la solicitud: ${firstError.message}`;
              }
            }
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        lastError = errorMessage;

        // Log more details in development
        if (import.meta.env.DEV) {
          console.error('SendGrid error details:', {
            statusCode: error.code,
            body: error.response?.body,
            errors: errorDetails,
            fromEmail: fromEmail,
            toEmail: recipientEmail,
            bccEmail: bccEmail,
            hasApiKey: !!SENDGRID_API_KEY,
          });
        }
        // Continue to try webhook or other methods
      }
    }

    // Fallback: Use webhook if available and Resend didn't work
    if (!emailSent) {
      const WEBHOOK_URL = import.meta.env.EMAIL_WEBHOOK_URL;
      if (WEBHOOK_URL) {
        try {
          const webhookResponse = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: recipientEmail,
              bcc: bccEmail,
              subject: emailSubject,
              text: emailBody,
              from: email,
              name: name,
              socialNetwork: socialNetwork || 'No especificada',
            }),
          });

          if (!webhookResponse.ok) {
            throw new Error('Error al enviar el email a través del webhook');
          }

          console.log('Email sent successfully via webhook');
          emailSent = true;
        } catch (error) {
          console.error('Error sending email via webhook:', error);
          lastError =
            lastError || 'Error al enviar el email a través del webhook';
        }
      }
    }

    // Development mode: log the email content if no service is configured
    if (!emailSent && !SENDGRID_API_KEY && !import.meta.env.EMAIL_WEBHOOK_URL) {
      const htmlContent = generateEmailHTML(
        name,
        email,
        socialNetwork,
        message
      );
      console.log('=== EMAIL CONTENT (Development Mode) ===');
      console.log('To:', recipientEmail);
      console.log('From:', fromEmail);
      console.log('BCC:', bccEmail);
      console.log('Subject:', emailSubject);
      console.log('Text Body:', emailBody);
      console.log('HTML Body:', htmlContent);
      console.log('=====================================');

      // Also log confirmation email in development
      const confirmationHtmlContent = generateConfirmationEmailHTML(name);
      console.log('\n=== CONFIRMATION EMAIL (Development Mode) ===');
      console.log('To:', email);
      console.log('From:', fromEmail);
      console.log('Subject:', '¡Gracias por contactarnos! - Key Protocol');
      console.log(
        'Text Body:',
        `Hola ${name},\n\nHemos recibido tu mensaje correctamente y queremos agradecerte por ponerte en contacto con nosotros.\n\nNuestro equipo revisará tu consulta y te responderemos a la brevedad. Generalmente respondemos en un plazo de 24 a 48 horas hábiles.\n\nSaludos cordiales,\nEl equipo de Key Protocol`
      );
      console.log('HTML Body:', confirmationHtmlContent);
      console.log('=====================================\n');

      // In production, return an error if email wasn't sent
      if (import.meta.env.PROD) {
        return new Response(
          JSON.stringify({
            error:
              'Servicio de email no configurado. Por favor, configura SENDGRID_API_KEY o EMAIL_WEBHOOK_URL.',
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // In development, allow it to continue (email logged to console)
      emailSent = true;
    }

    // Return success only if email was actually sent
    if (emailSent) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Mensaje enviado exitosamente.',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // If we get here, all methods failed
      return new Response(
        JSON.stringify({
          error:
            lastError ||
            'Error al enviar el email. Por favor, intenta nuevamente más tarde.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error processing contact form:', error);
    return new Response(
      JSON.stringify({
        error:
          'Error al procesar el formulario. Por favor, intenta nuevamente más tarde.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
