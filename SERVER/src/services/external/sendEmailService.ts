import nodemailer from "nodemailer";
import { envs } from "@config/envs";

// Variables para construir mensaje del email
interface messageAttributes {
  name: string;
  email: string;
  token: string;
}

interface messagesuspiciousAttributes {
  name: string;
  email: string;
  transactionDate: string,
  amount: Number
}

// Inicializar conexión con el servicio SMTP
const transporter = nodemailer.createTransport({
  host: envs.SMTP_HOST,
  port: envs.SMTP_PORT,
  secure: process.env.NODE_ENV === "production" ? true : false,
  auth: {
    user: envs.SMTP_USER,
    pass: envs.SMTP_PASSWORD,
  },
});

/* Crear y enviar mensaje de verificación al email del usuario */
export const sendOTPtoEmail = async ({
  name,
  email,
  token,
}: messageAttributes) => {
  // Formar y enviar mensaje
  const fromEmail = "noreply.bankiapp@gmail.com";
  const _ = await transporter.sendMail({
    from: fromEmail,
    to: email,
    subject: "[Banki] Verificación de cuenta",
    html: `
    <html>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>¡Hola ${name}!</h2>
                <p>Gracias por registrarte en Banki. Para completar el proceso de registro, por favor ingresa el siguiente código de verificación:</p>
                <div style="background-color: #f8f8f8; padding: 10px 15px; border: 1px solid #ddd; font-size: 18px; font-weight: bold; display: inline-block; margin-bottom: 20px;">
                    ${token}
                </div>
                <p>Este código es válido solo por 10 minutos. Si no solicitaste este registro, por favor ignora este correo.</p>
                <p>¡Bienvenido a Banki!</p>
                <footer style="margin-top: 20px; font-size: 12px; color: gray; text-align: center;">
                    <p>Saludos,<br>El equipo de Banki</p>
                </footer>
            </div>
        </body>
    </html>
    `,
  });
};



export const sendSuspiciousToEmail = async ({
  name,
  email,
  transactionDate,
  amount,
}: messagesuspiciousAttributes) => {
  // Formar y enviar mensaje

  const fromEmail = "noreply.bankiapp@gmail.com";
  const _ = await transporter.sendMail({
    from: fromEmail,
    to: email,
    subject: "[Banki] Transacción sospechosa",
    html: `
    <html>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #d9534f;">¡Alerta de seguridad!</h2>
                <p>Estimado/a ${name},</p>
                <p>Hemos detectado una actividad sospechosa en tu cuenta de Banki. Por favor, revisa las siguientes transacciones recientes:</p>
                <ul>
                    <li><strong>Fecha:</strong> ${transactionDate}</li>
                    <li><strong>Monto:</strong> ${amount}</li>
                </ul>
                <p>Si reconoces esta actividad, no es necesario que tomes ninguna acción. Sin embargo, si no autorizaste esta transacción, te recomendamos que sigas los siguientes pasos de inmediato:</p>
                <ol>
                    <li>Inicia sesión en tu cuenta de Banki y revisa tu historial de transacciones.</li>
                    <li>Si confirmas que es una transacción no autorizada, cambia tu contraseña y contacta a nuestro equipo de soporte.</li>
                </ol>
                <p>La seguridad de tu cuenta es nuestra prioridad. Si necesitas ayuda adicional, contáctanos a través de nuestra línea de soporte o envíanos un correo electrónico.</p>
                <footer style="margin-top: 20px; font-size: 12px; color: gray; text-align: center;">
                    <p>Saludos,<br>El equipo de Banki</p>
                </footer>
            </div>
        </body>
    </html>
`,
  });
};
