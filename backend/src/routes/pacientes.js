const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const {
  crearPaciente,
  obtenerPacientes,
  obtenerPacientePorId,
  actualizarPaciente,
  eliminarPaciente
} = require('../controllers/pacienteController');

// Aplicar middleware de autenticación a todas las rutas
router.use(verificarToken);

// Rutas para pacientes
router.post('/', crearPaciente);
router.get('/', obtenerPacientes);
router.get('/:id', obtenerPacientePorId);
router.put('/:id', actualizarPaciente);
router.delete('/:id', eliminarPaciente);

module.exports = router;
