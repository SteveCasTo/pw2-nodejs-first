import nodemailer from 'nodemailer';
import config from '@config/constants';

const transporter = nodemailer.createTransport({
  host: config.EMAIL_HOST,
  port: config.EMAIL_PORT,
  secure: false,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const mailOptions = {
    from: config.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (
  email: string,
  password: string,
  nombreCompleto?: string
): Promise<void> => {
  const nombre = nombreCompleto || email.split('@')[0];

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 40px 0;">
        <tr>
          <td align="center">
            <!-- Contenedor principal -->
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 30px; text-align: center;">
                  <div style="width: 80px; height: 80px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px; display: inline-block; line-height: 80px; font-size: 40px;">
                    📝
                  </div>
                  <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 700;">
                    ¡Bienvenido a FormifyX!
                  </h1>
                </td>
              </tr>

              <!-- Contenido -->
              <tr>
                <td style="padding: 40px 30px;">
                  
                  <!-- Saludo -->
                  <p style="font-size: 18px; color: #2c3e50; margin: 0 0 10px 0;">
                    Hola <strong style="color: #667eea;">${nombre}</strong>,
                  </p>
                  
                  <p style="color: #5a6c7d; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                    Nos complace darte la bienvenida a FormifyX. Tu cuenta ha sido creada exitosamente y ya puedes comenzar a utilizarla.
                  </p>

                  <!-- Credenciales -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 0 0 30px 0;">
                    <tr>
                      <td>
                        <!-- Email -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 6px; margin-bottom: 12px; border: 1px solid #e1e8ed;">
                          <tr>
                            <td style="padding: 15px;">
                              <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="width: 40px; vertical-align: top;">
                                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 6px; text-align: center; line-height: 40px; font-size: 20px;">
                                      📧
                                    </div>
                                  </td>
                                  <td style="padding-left: 12px; vertical-align: top;">
                                    <div style="font-size: 11px; color: #8492a6; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; margin-bottom: 4px;">
                                      TU CORREO ELECTRÓNICO
                                    </div>
                                    <div style="font-size: 15px; color: #2c3e50; font-weight: 600; word-break: break-all;">
                                      ${email}
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>

                        <!-- Contraseña -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 6px; border: 1px solid #e1e8ed;">
                          <tr>
                            <td style="padding: 15px;">
                              <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="width: 40px; vertical-align: top;">
                                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 6px; text-align: center; line-height: 40px; font-size: 20px;">
                                      🔑
                                    </div>
                                  </td>
                                  <td style="padding-left: 12px; vertical-align: top;">
                                    <div style="font-size: 11px; color: #8492a6; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; margin-bottom: 4px;">
                                      CONTRASEÑA TEMPORAL
                                    </div>
                                    <div style="font-size: 15px; color: #2c3e50; font-weight: 600; word-break: break-all;">
                                      ${password}
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Advertencia -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff8e1; border-left: 4px solid #ffc107; border-radius: 6px; margin: 0 0 30px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="color: #f57c00; font-weight: 600; font-size: 15px; margin: 0 0 12px 0;">
                          ⚠️ Recomendaciones de seguridad
                        </p>
                        <table cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="color: #5a6c7d; font-size: 14px; line-height: 1.8; padding: 4px 0;">
                              ✓ Cambia tu contraseña temporal en tu primer inicio de sesión
                            </td>
                          </tr>
                          <tr>
                            <td style="color: #5a6c7d; font-size: 14px; line-height: 1.8; padding: 4px 0;">
                              ✓ Utiliza una contraseña única y segura
                            </td>
                          </tr>
                          <tr>
                            <td style="color: #5a6c7d; font-size: 14px; line-height: 1.8; padding: 4px 0;">
                              ✓ No compartas tus credenciales con nadie
                            </td>
                          </tr>
                          <tr>
                            <td style="color: #5a6c7d; font-size: 14px; line-height: 1.8; padding: 4px 0;">
                              ✓ Guarda esta información en un lugar seguro
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Botón -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a href="${config.BACKEND_URL}/health" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px;">
                          Acceder a FormifyX →
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e1e8ed;">
                  <p style="color: #8492a6; font-size: 13px; margin: 0 0 10px 0;">
                    Este es un correo automático, por favor no responder.
                  </p>
                  <p style="color: #bdc3c7; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} FormifyX. Todos los derechos reservados.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: '📝 Bienvenido a FormifyX - Tus Credenciales de Acceso',
    html,
  });
};
