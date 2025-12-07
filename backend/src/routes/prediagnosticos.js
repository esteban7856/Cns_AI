// routes/prediagnosticos.routes.js
const express = require('express');
const router = express.Router();
const {
  crearPrediagnosticoController,
} = require('../controllers/prediagnostico');

// POST /api/prediagnosticos
router.post('/prediagnosticos', crearPrediagnosticoController);

module.exports = router;
