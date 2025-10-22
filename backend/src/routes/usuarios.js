// src/routes/usuarios.js
const express = require('express');
const router = express.Router();
const { cambiarPasswordPrimeraVez } = require('../controllers/authController');
const { verificarToken } = require('../middleware/auth'); // middleware JWT

router.post('/cambiar-password-primera-vez', verificarToken, cambiarPasswordPrimeraVez);

module.exports = router;
