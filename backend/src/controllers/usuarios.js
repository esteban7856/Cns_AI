const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/usuario');

const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const esCorrecta = await bcrypt.compare(password, usuario.password);
    if (!esCorrecta) return res.status(400).json({ mensaje: 'Contraseña incorrecta' });

    // Generar JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET, // 🔑 tu clave secreta del .env
      { expiresIn: '1h' }    // Expira en 1 hora
    );

    res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      primerIngreso: usuario.primerIngreso
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = { loginUsuario };
