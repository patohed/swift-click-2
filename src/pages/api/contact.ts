import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { nombre, empresa, email, telefono, mensaje } = data;

    // Configurar el transportador SMTP
    const transporter = nodemailer.createTransport({
      host: 'mail.swiftclick.com.ar',
      port: 465,
      secure: true, // SSL/TLS
      auth: {
        user: import.meta.env.SMTP_USER || 'contacto@swiftclick.com.ar',
        pass: import.meta.env.SMTP_PASSWORD
      }
    });

    // Configurar el email
    const mailOptions = {
      from: 'contacto@swiftclick.com.ar',
      to: 'contacto@swiftclick.com.ar',
      replyTo: email,
      subject: `Nuevo contacto de ${nombre} - ${empresa}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6a5acd;">Nuevo mensaje de contacto</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Empresa:</strong> ${empresa}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${telefono ? `<p><strong>Teléfono:</strong> ${telefono}</p>` : ''}
          </div>
          
          <div style="margin-top: 20px;">
            <h3 style="color: #6a5acd;">Mensaje:</h3>
            <p style="white-space: pre-wrap;">${mensaje}</p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #888; font-size: 12px;">
            Este mensaje fue enviado desde el formulario de contacto de swiftclick.com.ar
          </p>
        </div>
      `
    };

    // Enviar el email
    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ success: true, message: 'Email enviado correctamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error al enviar email:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error al enviar el email' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
