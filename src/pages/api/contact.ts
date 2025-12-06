import type { APIRoute } from 'astro';
import sgMail from '@sendgrid/mail';

/**
 * API endpoint para manejar el envío de formularios de contacto
 *
 * Configuración requerida (variables de entorno):
 * - SENDGRID_API_KEY: API key de SendGrid (requerido para producción)
 * - SENDGRID_FROM_EMAIL: Email desde el cual se enviará (requerido en producción)
 * - SENDGRID_TO_EMAIL: Email destinatario (a dónde llegarán los mensajes)
 * - EMAIL_WEBHOOK_URL: URL de webhook alternativa (opcional, como fallback)
 *
 * En modo desarrollo, los emails se registrarán en la consola si no hay API key configurada.
 */

// Mark this endpoint as server-rendered (not static)
export const prerender = false;

/**
 * Genera el contenido HTML estilizado para el email
 */
function generateEmailHTML(
  name: string,
  email: string,
  socialNetwork: string | null,
  message: string
): string {
  const escapedName = name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escapedEmail = email.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escapedSocialNetwork = (socialNetwork || 'No especificada')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const escapedMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo mensaje de contacto - Key Protocol</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2d5a47 0%, #4a9b7f 100%); padding: 30px 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                Nuevo Mensaje de Contacto
              </h1>
              <p style="margin: 10px 0 0 0; color: #e0e0e0; font-size: 14px;">
                Key Protocol - Formulario de Contacto
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px 20px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Has recibido un nuevo mensaje desde el formulario de contacto de Key Protocol:
              </p>
              
              <!-- Info Card -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 6px; margin-bottom: 20px; overflow: hidden;">
                <tr>
                  <td style="padding: 20px;">
                    <!-- Name -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                      <tr>
                        <td style="padding: 0; width: 120px; color: #666666; font-size: 14px; font-weight: 600; vertical-align: top;">
                          Nombre:
                        </td>
                        <td style="padding: 0; color: #333333; font-size: 14px;">
                          ${escapedName}
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Email -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                      <tr>
                        <td style="padding: 0; width: 120px; color: #666666; font-size: 14px; font-weight: 600; vertical-align: top;">
                          Email:
                        </td>
                        <td style="padding: 0; color: #333333; font-size: 14px;">
                          <a href="mailto:${escapedEmail}" style="color: #4a9b7f; text-decoration: none;">${escapedEmail}</a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Social Network -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                      <tr>
                        <td style="padding: 0; width: 120px; color: #666666; font-size: 14px; font-weight: 600; vertical-align: top;">
                          Red Social:
                        </td>
                        <td style="padding: 0; color: #333333; font-size: 14px;">
                          ${escapedSocialNetwork}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Message -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 0; color: #666666; font-size: 14px; font-weight: 600; margin-bottom: 10px; display: block;">
                    Mensaje:
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; background-color: #f8f9fa; border-left: 4px solid #4a9b7f; border-radius: 4px; color: #333333; font-size: 14px; line-height: 1.6;">
                    ${escapedMessage}
                  </td>
                </tr>
              </table>
              
              <!-- Action Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${escapedEmail}?subject=Re: Nuevo mensaje de contacto de ${escapedName}" 
                       style="display: inline-block; padding: 12px 30px; background-color: #4a9b7f; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600; transition: background-color 0.3s;">
                      Responder por Email
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; color: #666666; font-size: 12px; line-height: 1.5;">
                Este mensaje fue enviado automáticamente desde el formulario de contacto de<br>
                <strong style="color: #4a9b7f;">Key Protocol</strong>
              </p>
              <p style="margin: 10px 0 0 0; color: #999999; font-size: 11px;">
                No respondas directamente a este correo. Utiliza el botón "Responder por Email" arriba.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

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
      import.meta.env.SENDGRID_TO_EMAIL || 'martinlago84@gmail.com';

    // From email - debe ser un email verificado en SendGrid o del dominio verificado
    const fromEmail =
      import.meta.env.SENDGRID_FROM_EMAIL || 'noreply@keyprotocol.com';

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

    // Try SendGrid first (recommended for production)
    const SENDGRID_API_KEY = import.meta.env.SENDGRID_API_KEY;
    if (SENDGRID_API_KEY) {
      try {
        // Validate from email format
        if (!emailRegex.test(fromEmail)) {
          throw new Error(`Invalid from email format: ${fromEmail}`);
        }

        // Initialize SendGrid
        sgMail.setApiKey(SENDGRID_API_KEY);

        // Generate HTML content
        const htmlContent = generateEmailHTML(name, email, socialNetwork, message);

        // Send email via SendGrid
        await sgMail.send({
          from: fromEmail,
          to: recipientEmail,
          subject: emailSubject,
          text: emailBody,
          html: htmlContent,
          replyTo: email,
        });

        console.log('Email sent successfully via SendGrid');
        emailSent = true;
      } catch (error: any) {
        console.error('Error sending email via SendGrid:', error);
        lastError = error?.message || 'Error desconocido al enviar el email';
        
        // Log more details in development
        if (import.meta.env.DEV && error.response) {
          console.error('SendGrid error details:', {
            statusCode: error.code,
            body: error.response.body,
            headers: error.response.headers,
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
      const htmlContent = generateEmailHTML(name, email, socialNetwork, message);
      console.log('=== EMAIL CONTENT (Development Mode) ===');
      console.log('To:', recipientEmail);
      console.log('From:', fromEmail);
      console.log('Subject:', emailSubject);
      console.log('Text Body:', emailBody);
      console.log('HTML Body:', htmlContent);
      console.log('=====================================');

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
