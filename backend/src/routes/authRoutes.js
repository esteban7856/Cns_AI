  const express = require('express');
  const router = express.Router();
  const { 
    registrarUsuario, 
    loginUsuario, 
    forgotPassword, 
    resetPassword, 
    cambiarPasswordPrimeraVez,
    verificarCodigoTemporal
  } = require('../controllers/authController');
  const { verificarToken } = require('../middleware/auth');

  // Rutas públicas
  router.post('/registro', registrarUsuario);
  router.post('/login', loginUsuario);

  // Flujo de recuperación de contraseña
  router.post('/forgot-password', forgotPassword);
  router.post('/verificar-codigo-temporal', verificarCodigoTemporal);

  // Ruta para restablecer contraseña (requiere token válido)
 router.post('/reset-password', verificarToken, resetPassword);                 
  // Cambiar contraseña en primer ingreso (requiere JWT)
  router.post('/cambiar-password-primera-vez', verificarToken, cambiarPasswordPrimeraVez);

  // Verificar token (simplemente valida y responde)
  router.post('/verify-token', verificarToken, (req, res) => {
    return res.status(200).json({ valido: true, usuario: req.usuario });
  });

  module.exports = router;
