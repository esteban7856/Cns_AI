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
const generarPasswordTemporal = () => crypto.randomBytes(4).toString('hex'); 

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
// Login - acepta contraseña normal o código temporal
const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    //Si el usuario tiene un código temporal vigente, lo verificamos primero
    if (usuario.codigo_restablecer && usuario.expiracion_codigo) {
      // ¿el código sigue vigente?
      if (new Date() <= usuario.expiracion_codigo) {
        const esCodigoValido = await bcrypt.compare(password, usuario.codigo_restablecer);
        if (esCodigoValido) {
          // ✅ Código correcto → generar token temporal para cambio de contraseña
          const token = jwt.sign(
            { id: usuario.id, email: usuario.email, tipo: 'reset-password' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // token temporal
          );

          return res.status(200).json({
            mensaje: 'Código verificado correctamente',
            token,
            requiereNuevaContrasena: true,
            email: usuario.email
          });
        }
      }
      // si llega aquí y no validó → seguimos probando contraseña normal
    }

    //Verificamos contraseña normal (login normal)
    const esCorrecta = await bcrypt.compare(password, usuario.password);
    if (!esCorrecta) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    //Generar token JWT normal (1 hora)
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      primerIngreso: usuario.primeringreso,
      rol: usuario.rol,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      requiereNuevaContrasena: false
    });
  } catch (error) {
    console.error('Error en loginUsuario:', error);
    return res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};




// Cambiar contraseña primera vez

const cambiarPasswordPrimeraVez = async (req, res) => {
  try {
    //Acepta ambas variantes (con y sin ñ)
    const { nuevaContrasena, nuevaContraseña } = req.body;
    const passwordRecibida = nuevaContrasena || nuevaContraseña;

    //Validación antes de hashear
    if (!passwordRecibida || passwordRecibida.trim() === '') {
      return res.status(400).json({ mensaje: 'La nueva contraseña es requerida' });
    }

    //Obtener el ID del usuario autenticado desde el token
    const usuarioId = req.usuario?.id;
    if (!usuarioId) {
      return res.status(401).json({ mensaje: 'Token no válido o usuario no autenticado' });
    }

    //Hashear la contraseña nueva
    const hashedPassword = await bcrypt.hash(passwordRecibida, 10);

    //Actualizar en la base de datos
    await Usuario.update(
      { password: hashedPassword, primeringreso: false },
      { where: { id: usuarioId } }
    );

    console.log(`Contraseña actualizada para el usuario ID ${usuarioId}`);
    res.status(200).json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error en cambiarPasswordPrimeraVez:', error);
    res.status(500).json({ mensaje: 'Error al cambiar contraseña', error: error.message });
  }
};


// Forgot password - Envía código temporal

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      // por seguridad puedes devolver siempre 200, pero dejamos 404 explícito
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Generar código temporal (6 dígitos)
    const codigoTemporal = Math.floor(100000 + Math.random() * 900000).toString();
    const codigoExpiracion = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // Guardar en los campos correctos del modelo
    await Usuario.update(
      {
        codigo_restablecer: await bcrypt.hash(codigoTemporal, 10),
        expiracion_codigo: codigoExpiracion
      },
      { where: { id: usuario.id } }
    );

    // Enviar el correo
    const mensaje = `
      <h3>Restablecimiento de contraseña</h3>
      <p>Tu código de verificación es: <b>${codigoTemporal}</b></p>
      <p>Este código expirará en 10 minutos.</p>
      <p>Si no solicitaste este cambio, ignora este correo.</p>
    `;

    await enviarCorreo(email, 'Código de verificación', mensaje);

    return res.status(200).json({
      mensaje: 'Se ha enviado un código de verificación a tu correo',
      email
    });
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    return res.status(500).json({ mensaje: 'Error al procesar la solicitud' });
  }
};

// Verificar código temporal
const verificarCodigoTemporal = async (req, res) => {
  try {
    const { email, codigo } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verificar si hay un código y si no ha expirado
    if (!usuario.codigo_restablecer  || !usuario.expiracion_codigo) {
      return res.status(400).json({ mensaje: 'Código no solicitado o expirado' });
    }

    if (new Date() > usuario.expiracion_codigo) {
      return res.status(400).json({ mensaje: 'El código ha expirado' });
    }

    // Verificar el código
    const esValido = await bcrypt.compare(codigo, usuario.codigo_restablecer);
    if (!esValido) {
      return res.status(400).json({ mensaje: 'Código inválido' });
    }

    // Generar token temporal para permitir el cambio de contraseña
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, tipo: 'reset-password' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Token válido por 15 minutos
    );

    res.status(200).json({ 
      mensaje: 'Código verificado correctamente',
      token
    });

  } catch (error) {
    console.error('Error en verificarCodigoTemporal:', error);
    res.status(500).json({ mensaje: 'Error al verificar el código' });
  }
};

// Reset password - Solo se puede usar con un token válido
const resetPassword = async (req, res) => {
  try {
    // Aceptar tanto 'nuevaContrasena' como 'nuevaContraseña' (con y sin ñ)
    const { nuevaContrasena, nuevaContraseña } = req.body;
    const password = nuevaContrasena || nuevaContraseña;
    
    if (!password) {
      return res.status(400).json({ mensaje: 'La nueva contraseña es requerida' });
    }
    
    const usuarioId = req.usuario.id; // Obtenido del token JWT
    
    // Validar que el token sea para restablecer contraseña
    if (req.usuario.tipo !== 'reset-password') {
      return res.status(403).json({ mensaje: 'Token no válido para esta operación' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar contraseña y limpiar códigos temporales
    await Usuario.update(
      { 
        password: hashedPassword, 
        codigo_restablecer: null,
        expiracion_codigo: null
      }, 
      { where: { id: usuarioId } }
    );

    res.status(200).json({ mensaje: 'Contraseña restablecida correctamente' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({ mensaje: 'Error al restablecer la contraseña' });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  cambiarPasswordPrimeraVez,
  forgotPassword,
  verificarCodigoTemporal,
  resetPassword,
};
