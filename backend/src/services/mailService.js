// src/services/mailService.js
const { Resend } = require('resend');

// Inicializa Resend con tu API Key
const resend = new Resend(process.env.RESEND_API_KEY);

// Función para enviar correos
async function enviarCorreo(destinatario, asunto, html) {
  try {
    const data = await resend.emails.send({
      from: 'Sistema Médicos <onboarding@resend.dev>', // O usa un dominio verificado
      to: destinatario,
      subject: asunto,
      html,
    });
    console.log('✅ Correo enviado:', data);
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
  }
}

module.exports = { enviarCorreo };
