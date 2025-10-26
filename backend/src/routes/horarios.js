const express = require('express');
const router = express.Router();
const controller = require('../controllers/horarioController');
const { verificarToken, rol } = require('../middleware/auth');

// Solo médicos o admins pueden gestionar horarios
router.post('/', verificarToken, rol(['medico', 'administrador']), controller.crearHorario);
router.get('/:medico_id', verificarToken, controller.obtenerHorariosPorMedico);
router.delete('/:id', verificarToken, rol(['medico', 'administrador']), controller.eliminarHorario);
router.get('/disponibilidad/:medico_id', verificarToken, controller.obtenerDisponibilidad);

module.exports = router;
