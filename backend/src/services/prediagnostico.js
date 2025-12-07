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

    // 2) Llamar al microservicio IA (FastAPI) - usa "text", NO "texto"
    const iaResp = await axios.post(`${MICRO_IA_URL}/predict`, {
      text: sintomas,
      paciente_id: pacienteId, // FastAPI lo ignora, pero no molesta
    });

    const iaData = iaResp.data;

    // Según tu FastAPI:
    // {
    //   diagnostico: str,
    //   confianza: float 0-1,
    //   mensaje: str,
    //   sugerencia: str,
    //   nivel_confianza: str,
    //   probabilidad: "92.8%" (string bonito)
    // }
    const diagnostico = iaData.diagnostico || 'Sin diagnóstico';

    // Para la BD usamos SIEMPRE "confianza" (float 0–1) como probabilidad
    let probabilidad = 0;
    if (typeof iaData.confianza === 'number') {
      probabilidad = iaData.confianza;
    } else if (typeof iaData.confianza === 'string') {
      const parsed = parseFloat(iaData.confianza);
      if (!Number.isNaN(parsed)) {
        probabilidad = parsed;
      }
    }

    // Para recomendaciones guardamos algo útil del mensaje/sugerencia
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
          probabilidad,  
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

    // Lo que devolvemos al controlador
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
