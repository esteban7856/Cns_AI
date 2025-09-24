// src/services/mailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,     // tu correo
    pass: process.env.EMAIL_PASS      // tu contraseña o app password
  }
});

async function enviarCorreo(destinatario, asunto, mensaje) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: asunto,
    text: mensaje
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { enviarCorreo };
