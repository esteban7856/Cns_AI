// backend/src/services/prediagnostico.js
const axios = require('axios');
const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');

const MICRO_IA_URL =
  process.env.MICRO_IA_URL || 'https://esteban7856-respiratorio-api.hf.space';

/**
 * Crear un prediagnóstico:
 * 1) Inserta síntomas
 * 2) Llama al microservicio IA /predict
 * 3) Inserta en prediagnosticos
 * 4) (Opcional) Inserta en historial_prediagnosticos usando ia_versiones
 */
async function crearPrediagnostico({ pacienteId, sintomas }) {
  const transaction = await sequelize.transaction();

  try {
    // 1) Insertar en sintomas
    const [sintomaRows] = await sequelize.query(
      `
      INSERT INTO sintomas (paciente_id, sintomas, fecha_sintomas)
      VALUES (:pacienteId, :sintomas, NOW())
      RETURNING id, fecha_sintomas;
      `,
      {
        replacements: { pacienteId, sintomas },
        transaction,
        type: QueryTypes.INSERT,
      }
    );

    const sintomaId = sintomaRows[0].id;

    // 2) Llamar al microservicio IA (FastAPI)
    const iaResp = await axios.post(`${MICRO_IA_URL}/predict`, {
      text: sintomas,          // ⚠️ FastAPI espera "text"
      paciente_id: pacienteId, // extra, pero no molesta
    });

    const iaData = iaResp.data || {};
    console.log('Respuesta IA:', iaData); // útil para debug en Render

    // --------- DIAGNÓSTICO ---------
    // Tu FastAPI devuelve "diagnostico"
    const diagnostico =
      iaData.diagnostico ||
      iaData['diagnóstico'] || // por si acaso hay versión con tilde
      'Sin diagnóstico';

    // --------- PROBABILIDAD (0–1 para la BD) ---------
    let probabilidad = 0;

    // 1) Caso ideal: viene "confianza" como número 0–1
    if (typeof iaData.confianza === 'number') {
      probabilidad = iaData.confianza;
    }
    // 2) Si "confianza" viene como string ("0.928")
    else if (typeof iaData.confianza === 'string') {
      const parsed = parseFloat(iaData.confianza);
      if (!Number.isNaN(parsed)) {
        probabilidad = parsed;
      }
    }
    // 3) Si NO hay "confianza", pero hay "probabilidad": "92.8%" (string)
    else if (typeof iaData.probabilidad === 'string') {
      const cleaned = iaData.probabilidad.replace('%', '').trim(); // "92.8"
      const parsed = parseFloat(cleaned);
      if (!Number.isNaN(parsed)) {
        probabilidad = parsed / 100.0; // 92.8 -> 0.928
      }
    }

    // --------- RECOMENDACIONES ---------
    // Algo útil para la columna recomendaciones
    const recomendaciones = iaData.sugerencia || iaData.mensaje || null;

    // 3) Insertar en prediagnosticos
    const [predRows] = await sequelize.query(
      `
      INSERT INTO prediagnosticos 
        (sintoma_id, diagnostico, probabilidad, recomendaciones, fecha_prediccion)
      VALUES (:sintomaId, :diagnostico, :probabilidad, :recomendaciones, NOW())
      RETURNING id, fecha_prediccion;
      `,
      {
        replacements: {
          sintomaId,
          diagnostico,
          probabilidad,   // <- ya es número entre 0 y 1
          recomendaciones,
        },
        transaction,
        type: QueryTypes.INSERT,
      }
    );

    const prediagnosticoId = predRows[0].id;

    // 4) Obtener versión de IA activa (si existe)
    const iaVersionRows = await sequelize.query(
      `
      SELECT id
      FROM ia_versiones
      WHERE estado = 'activo'
      ORDER BY fecha_lanzamiento DESC
      LIMIT 1;
      `,
      {
        transaction,
        type: QueryTypes.SELECT,
      }
    );

    let historialId = null;

    if (iaVersionRows.length > 0) {
      const iaVersionId = iaVersionRows[0].id;

      const [historialRows] = await sequelize.query(
        `
        INSERT INTO historial_prediagnosticos
          (paciente_id, ia_version_id, sintomas, diagnostico, probabilidad, fecha_prediccion, estado)
        VALUES (:pacienteId, :iaVersionId, :sintomas, :diagnostico, :probabilidad, NOW(), 'pendiente')
        RETURNING id;
        `,
        {
          replacements: {
            pacienteId,
            iaVersionId,
            sintomas,
            diagnostico,
            probabilidad,
          },
          transaction,
          type: QueryTypes.INSERT,
        }
      );

      historialId = historialRows[0]?.id ?? null;
    }

    await transaction.commit();

    return {
      sintoma_id: sintomaId,
      prediagnostico_id: prediagnosticoId,
      historial_id: historialId,
      paciente_id: pacienteId,
      sintomas,
      diagnostico,
      probabilidad,
      recomendaciones,
    };
  } catch (error) {
    await transaction.rollback();
    console.error('Error en crearPrediagnostico:', error);
    throw error;
  }
}

module.exports = {
  crearPrediagnostico,
};
