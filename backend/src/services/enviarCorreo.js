const nodemailer = require('nodemailer');

async function enviarCorreo(email, contrasena) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Tu contraseña temporal',
    text: `Bienvenido! Tu contraseña temporal es: ${contrasena}. Por favor cámbiala en tu primer ingreso.`,
  });
}

module.exports = enviarCorreo;
