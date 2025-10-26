// src/routes/usuarios.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios');
const { cambiarPasswordPrimeraVez } = require('../controllers/authController');
const { verificarToken } = require('../middleware/auth'); // middleware JWT

router.post('/cambiar-password-primera-vez', verificarToken, cambiarPasswordPrimeraVez);
router.get('/medicos', verificarToken, controller.obtenerMedicos);

module.exports = router;
