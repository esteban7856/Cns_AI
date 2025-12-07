// controllers/prediagnostico.controller.js
const prediagnosticoService = require('../services/prediagnostico.service');

async function crearPrediagnosticoController(req, res) {
  try {
    const { paciente_id, sintomas } = req.body;

    if (!paciente_id || !sintomas) {
      return res.status(400).json({
        detail: 'paciente_id y sintomas son requeridos',
      });
    }

    const result = await prediagnosticoService.crearPrediagnostico({
      pacienteId: paciente_id,
      sintomas,
    });

    return res.status(201).json(result);
  } catch (err) {
    console.error('Error en crearPrediagnosticoController:', err);
    return res.status(500).json({
      detail: 'Error interno en el servidor',
    });
  }
}

module.exports = {
  crearPrediagnosticoController,
};
