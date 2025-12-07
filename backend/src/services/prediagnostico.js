// services/prediagnostico.service.js
const axios = require('axios');
const { sequelize } = require('../config/db');

const MICRO_IA_URL = process.env.MICRO_IA_URL || 'https://esteban7856-respiratorio-api.hf.space';

async function crearPrediagnostico({ pacienteId, sintomas }) {
  const transaction = await sequelize.transaction();
  
  try {
    // 1) Insertar en sintomas
    const [sintoma] = await sequelize.query(
      `INSERT INTO sintomas (paciente_id, sintomas, fecha_sintomas)
       VALUES (:pacienteId, :sintomas, NOW())
       RETURNING id, fecha_sintomas;`,
      {
        replacements: { pacienteId, sintomas },
        transaction,
        type: sequelize.QueryTypes.INSERT
      }
    );

    const sintomaId = sintoma[0].id;

    // 2) Llamar al microservicio IA
    const iaResp = await axios.post(`${MICRO_IA_URL}/predict`, {
      texto: sintomas,
      paciente_id: pacienteId,
    });

    const iaData = iaResp.data;
    const diagnostico = iaData.diagnóstico || iaData.diagnostico || 'Sin diagnóstico';
    const probabilidad = iaData.confianza ?? iaData.probabilidad ?? 0;
    const recomendaciones = iaData.nota || iaData.recomendaciones || null;

    // 3) Insertar en prediagnosticos
    const [prediagnostico] = await sequelize.query(
      `INSERT INTO prediagnosticos 
       (sintoma_id, diagnostico, probabilidad, recomendaciones, fecha_prediccion)
       VALUES (:sintomaId, :diagnostico, :probabilidad, :recomendaciones, NOW())
       RETURNING id, fecha_prediccion;`,
      {
        replacements: {
          sintomaId,
          diagnostico,
          probabilidad,
          recomendaciones
        },
        transaction,
        type: sequelize.QueryTypes.INSERT
      }
    );

    // 4) Obtener versión de IA activa (si existe)
    const [iaVersion] = await sequelize.query(
      `SELECT id FROM ia_versiones 
       WHERE estado = 'activo' 
       ORDER BY fecha_lanzamiento DESC 
       LIMIT 1;`,
      { transaction, type: sequelize.QueryTypes.SELECT }
    );

    let historialId = null;
    if (iaVersion) {
      const [historial] = await sequelize.query(
        `INSERT INTO historial_prediagnosticos
         (paciente_id, ia_version_id, sintomas, diagnostico, probabilidad, fecha_prediccion)
         VALUES (:pacienteId, :iaVersionId, :sintomas, :diagnostico, :probabilidad, NOW())
         RETURNING id;`,
        {
          replacements: {
            pacienteId,
            iaVersionId: iaVersion.id,
            sintomas,
            diagnostico,
            probabilidad
          },
          transaction,
          type: sequelize.QueryTypes.INSERT
        }
      );
      historialId = historial[0]?.id;
    }

    // No es necesario actualizar el estado de síntomas

    await transaction.commit();

    return {
      sintoma_id: sintomaId,
      prediagnostico_id: prediagnostico[0].id,
      historial_id: historialId,
      paciente_id: pacienteId,
      sintomas,
      diagnostico,
      probabilidad,
      recomendaciones
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