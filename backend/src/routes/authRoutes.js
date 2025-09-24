// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario, forgotPassword, resetPassword, cambiarPasswordPrimeraVez } = require('../controllers/authController');
const { verificarToken } = require('../middleware/auth');

router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Cambiar contraseña en primer ingreso (requiere JWT)
router.post('/cambiar-password-primera-vez', verificarToken, cambiarPasswordPrimeraVez);

// Verificar token (simplemente valida y responde)
router.post('/verify-token', verificarToken, (req, res) => {
  return res.status(200).json({ valido: true, usuario: req.usuario });
});

module.exports = router;
