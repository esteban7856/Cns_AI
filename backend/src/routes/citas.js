const express = require('express');
const router = express.Router();
const controller = require('../controllers/citaController');
const { verificarToken, role } = require('../middlewares/auth');

// Crear cita (solo padres o médicos)
router.post('/', verificarToken, role(['Padre', 'Médico']), controller.create);

// Listar citas (médicos o admin pueden ver todas, padres solo las suyas)
router.get('/', verificarToken, controller.list);

// Obtener una cita específica (todos los autenticados)
router.get('/:id', verificarToken, controller.getById);

// Actualizar datos de cita (médicos o admin)
router.patch('/:id', verificarToken, role(['Médico', 'Admin']), controller.update);

// Cambiar estado (solo médicos o admin)
router.patch('/:id/estado', verificarToken, role(['Médico', 'Admin']), controller.changeEstado);

// Eliminar cita (solo admin)
router.delete('/:id', verificarToken, role(['Admin']), controller.remove);

module.exports = router;
