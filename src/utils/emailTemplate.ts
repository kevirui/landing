/**
 * Utilidad para generar templates HTML de emails
 * Contiene funciones para escapar HTML y generar el contenido de emails
 */

/**
 * Escapa caracteres especiales de HTML para prevenir inyección XSS
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Genera el contenido HTML estilizado para el email de contacto
 *
 * @param name - Nombre del remitente
 * @param email - Email del remitente
 * @param socialNetwork - Red social o asunto del mensaje (opcional)
 * @param message - Contenido del mensaje
 * @returns HTML formateado y estilizado para el email
 */
export function generateEmailHTML(
  name: string,
  email: string,
  socialNetwork: string | null,
  message: string
): string {
  const escapedName = escapeHtml(name);
  const escapedEmail = escapeHtml(email);
  const escapedSocialNetwork = escapeHtml(socialNetwork || 'No especificada');
  const escapedMessage = escapeHtml(message).replace(/\n/g, '<br>');

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
            <td style="background: linear-gradient(135deg, hsl(164, 80%, 20%) 0%, hsl(164, 80%, 35%) 100%); padding: 30px 20px; text-align: center;">
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
                          <a href="mailto:${escapedEmail}" style="color: hsl(164, 80%, 40%); text-decoration: none;">${escapedEmail}</a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Social Network -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                      <tr>
                        <td style="padding: 0; width: 120px; color: #666666; font-size: 14px; font-weight: 600; vertical-align: top;">
                          Asunto:
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
                  <td style="padding: 15px; background-color: #f8f9fa; border-left: 4px solid hsl(164, 80%, 40%); border-radius: 4px; color: #333333; font-size: 14px; line-height: 1.6;">
                    ${escapedMessage}
                  </td>
                </tr>
              </table>
              
              <!-- Action Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${escapedEmail}?subject=Re: Nuevo mensaje de contacto de ${escapedName}" 
                       style="display: inline-block; padding: 12px 30px; background-color: hsl(164, 80%, 40%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600; transition: background-color 0.3s;">
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
                <strong style="color: hsl(164, 80%, 40%);">Key Protocol</strong>
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

/**
 * Genera el contenido HTML estilizado para el email de confirmación al usuario
 * Este email se envía automáticamente al usuario que llena el formulario de contacto
 *
 * @param name - Nombre del usuario que envió el mensaje
 * @returns HTML formateado y estilizado para el email de confirmación
 */
export function generateConfirmationEmailHTML(name: string): string {
  const escapedName = escapeHtml(name);

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de mensaje recibido - Key Protocol</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, hsl(164, 80%, 20%) 0%, hsl(164, 80%, 35%) 100%); padding: 40px 20px; text-align: center;">
              <div style="width: 60px; height: 60px; margin: 0 auto 15px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                ¡Mensaje Recibido!
              </h1>
              <p style="margin: 10px 0 0 0; color: #e0e0e0; font-size: 14px;">
                Gracias por contactarte con Key Protocol
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Hola <strong style="color: hsl(164, 80%, 40%);">${escapedName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Hemos recibido tu mensaje correctamente y queremos agradecerte por ponerte en contacto con nosotros.
              </p>
              
              <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Nuestro equipo revisará tu consulta y te responderemos a la brevedad. Generalmente respondemos en un plazo de 24 a 48 horas hábiles.
              </p>
              
              <!-- Info Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, hsl(164, 80%, 95%) 0%, hsl(164, 80%, 98%) 100%); border-left: 4px solid hsl(164, 80%, 40%); border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 10px 0; color: hsl(164, 80%, 30%); font-size: 14px; font-weight: 600;">
                      💡 Mientras tanto...
                    </p>
                    <p style="margin: 0; color: hsl(164, 80%, 25%); font-size: 14px; line-height: 1.6;">
                      Te invitamos a conocer más sobre nuestros servicios y soluciones en nuestra página web.
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                Si tienes alguna pregunta urgente, no dudes en responder a este correo.
              </p>
              
              <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                Saludos cordiales,<br>
                <strong style="color: hsl(164, 80%, 40%);">El equipo de Key Protocol</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px 0; color: #666666; font-size: 12px; line-height: 1.5;">
                Este es un mensaje automático de confirmación de<br>
                <strong style="color: hsl(164, 80%, 40%);">Key Protocol</strong>
              </p>
              <p style="margin: 0; color: #999999; font-size: 11px;">
                Por favor, no respondas a este correo si solo es para confirmar la recepción.
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
