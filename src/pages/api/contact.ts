import type { APIRoute } from 'astro';
import { Resend } from 'resend';

/**
 * API endpoint para manejar el envío de formularios de contacto
 *
 * Configuración requerida (variables de entorno):
 * - RESEND_API_KEY: API key de Resend (recomendado para producción)
 * - RESEND_FROM_EMAIL: Email desde el cual se enviará (opcional, por defecto: onboarding@resend.dev)
 * - RESEND_TO_EMAIL: Email destinatario (opcional, por defecto: kevinagustinrockz@gmail.com)
 * - EMAIL_WEBHOOK_URL: URL de webhook alternativa (opcional, como fallback)
 *
 * En modo desarrollo, los emails se registrarán en la consola.
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
Nuevo mensaje de contacto desde el sitio web de Key Protocol:

Nombre: ${name}
Email: ${email}
Red Social: ${socialNetwork || 'No especificada'}
Mensaje:
${message}

---
Este mensaje fue enviado desde el formulario de contacto de Key Protocol.
    `.trim();

    // Send email using a service
    // Use environment variable for recipient email, fallback to default
    const recipientEmail =
      import.meta.env.RESEND_TO_EMAIL || 'kevinagustinrockz@gmail.com';

    // Use the verified test domain by default to avoid domain verification issues
    // Users can override with RESEND_FROM_EMAIL if they have a verified domain
    let fromEmail =
      import.meta.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    // Validate email format (reuse the same regex)
    if (!emailRegex.test(recipientEmail)) {
      return new Response(
        JSON.stringify({
          error: `Formato de email destinatario inválido: ${recipientEmail}`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let emailSent = false;
    let lastError: string | null = null;

    // Try Resend first (recommended for production)
    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
    if (RESEND_API_KEY) {
      try {
        // Validate from email format
        if (!emailRegex.test(fromEmail)) {
          throw new Error(`Invalid from email format: ${fromEmail}`);
        }

        // Initialize Resend client
        const resend = new Resend(RESEND_API_KEY);

        // Try to send email
        try {
          const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: recipientEmail,
            subject: emailSubject,
            text: emailBody,
            replyTo: email,
          });

          if (error) {
            throw error;
          }

          console.log('Email sent successfully via Resend:', data);
          emailSent = true;
        } catch (resendError: any) {
          // If domain is not verified, try with the default test domain
          const errorMessage =
            resendError?.message || 'Error al enviar el email';

          if (
            errorMessage.includes('domain is not verified') ||
            errorMessage.includes('not verified') ||
            errorMessage.includes('Invalid `from` field')
          ) {
            console.warn(
              `Domain ${fromEmail} not verified. Trying with default test domain...`
            );
            fromEmail = 'onboarding@resend.dev';

            // Retry with the default test domain
            const { data: retryData, error: retryError } =
              await resend.emails.send({
                from: fromEmail,
                to: recipientEmail,
                subject: emailSubject,
                text: emailBody,
                replyTo: email,
              });

            if (retryError) {
              throw retryError;
            }

            console.log(
              'Email sent successfully via Resend (using test domain):',
              retryData
            );
            emailSent = true;
          } else {
            throw resendError;
          }
        }
      } catch (error: any) {
        console.error('Error sending email via Resend:', error);
        lastError = error?.message || 'Error desconocido al enviar el email';
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
    if (!emailSent && !RESEND_API_KEY && !import.meta.env.EMAIL_WEBHOOK_URL) {
      console.log('=== EMAIL CONTENT (Development Mode) ===');
      console.log('To:', recipientEmail);
      console.log('Subject:', emailSubject);
      console.log('Body:', emailBody);
      console.log('=====================================');

      // In production, return an error if email wasn't sent
      if (import.meta.env.PROD) {
        return new Response(
          JSON.stringify({
            error:
              'Servicio de email no configurado. Por favor, configura RESEND_API_KEY o EMAIL_WEBHOOK_URL.',
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
