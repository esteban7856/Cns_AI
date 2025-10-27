const express = require('express');
const router = express.Router();
const controller = require('../controllers/citaController');
const { verificarToken, rol } = require('../middleware/auth');

// Crear cita (solo padres o médicos)
router.post('/', verificarToken, rol(['padre', 'medico']), controller.create);

// Listar citas
router.get('/', verificarToken, controller.list);

// Obtener una cita específica
router.get('/:id', verificarToken, controller.getById);

// Actualizar cita (médico o admin)
router.patch('/:id', verificarToken, rol(['medico', 'admin']), controller.update);

// ✅ Cambiar estado (PUT limpio)
router.put('/:id/estado', verificarToken, rol(['medico', 'admin']), controller.changeEstado);

// Eliminar cita (solo admin)
router.delete('/:id', verificarToken, rol(['admin']), controller.remove);

module.exports = router;
