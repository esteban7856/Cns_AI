const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/usuario');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configuración de NodeMailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password
  },
});

// Generar contraseña temporal
const generarPasswordTemporal = () => crypto.randomBytes(4).toString('hex'); // 8 caracteres

// Enviar correo
const enviarCorreo = async (destinatario, asunto, html) => {
  await transporter.sendMail({
    from: `"Sistema Médicos" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: asunto,
    html,
  });
};

// Registro de usuario
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, codigoMedico } = req.body;

    // Validar si usuario ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente)
      return res.status(400).json({ mensaje: 'Correo ya registrado' });

    // Contraseña temporal
    const passwordTemporal = generarPasswordTemporal();
    const hashedPassword = await bcrypt.hash(passwordTemporal, 10);

    // Asignar rol según código
    let rol = 'padre';
    if (codigoMedico && codigoMedico === process.env.CODIGO_MEDICO) {
      rol = 'medico';
    }

    // Crear usuario
    await Usuario.create({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      rol,
      // Aseguramos que el campo correcto del modelo sea usado
      primeringreso: true,
    });

    // Enviar correo con contraseña temporal
    const mensaje = `
      <h3>Bienvenido a Sistema Médicos</h3>
      <p>Tu contraseña temporal es: <b>${passwordTemporal}</b></p>
      <p>Por favor, ingresa y cambia tu contraseña en tu primer acceso.</p>
    `;
    await enviarCorreo(email, 'Registro exitoso - Contraseña temporal', mensaje);

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente. Revisa tu correo.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
};

// Login
const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const esCorrecta = await bcrypt.compare(password, usuario.password);
    if (!esCorrecta) return res.status(400).json({ mensaje: 'Contraseña incorrecta' });

    // Generar JWT
    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      // Normalizamos el nombre del campo hacia el frontend
      primerIngreso: usuario.primeringreso,
      rol: usuario.rol,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};

// Cambiar contraseña primera vez
const cambiarPasswordPrimeraVez = async (req, res) => {
  try {
    const { nuevaContrasena } = req.body;
    const usuarioId = req.usuario.id; // desde middleware JWT

    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

    await Usuario.update(
      { password: hashedPassword, primeringreso: false },
      { where: { id: usuarioId } }
    );

    res.status(200).json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al cambiar contraseña' });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const codigoTemporal = crypto.randomBytes(3).toString('hex'); // 6 caracteres
    const hashedPassword = await bcrypt.hash(codigoTemporal, 10);

    await Usuario.update({ contraseña: hashedPassword, primeringreso: true }, { where: { email } });

    const mensaje = `
      <h3>Restablecimiento de contraseña</h3>
      <p>Tu código temporal es: <b>${codigoTemporal}</b></p>
      <p>Usa este código para iniciar sesión y luego cambia tu contraseña.</p>
    `;
    await enviarCorreo(email, 'Recuperación de contraseña', mensaje);

    res.status(200).json({ mensaje: 'Se ha enviado un código temporal a tu correo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al enviar código temporal' });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { email, nuevaContrasena } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

    await Usuario.update({ password: hashedPassword, primeringreso: false }, { where: { email } });

    res.status(200).json({ mensaje: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al restablecer contraseña' });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  cambiarPasswordPrimeraVez,
  forgotPassword,
  resetPassword,
};
