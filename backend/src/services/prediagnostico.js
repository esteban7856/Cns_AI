// services/prediagnostico.service.js
const axios = require('axios');
const pool = require('../config/db'); 

// Mejor por variable de entorno
const MICRO_IA_URL =
  process.env.MICRO_IA_URL ||
  'https://esteban7856-respiratorio-api.hf.space';

async function crearPrediagnostico({ pacienteId, sintomas }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1) Insertar en sintomas
    const sintomasResult = await client.query(
      `
      INSERT INTO sintomas (paciente_id, sintomas, estado)
      VALUES ($1, $2, 'en análisis')
      RETURNING id, fecha_sintomas;
      `,
      [pacienteId, sintomas]
    );
    const sintomaRow = sintomasResult.rows[0];
    const sintomaId = sintomaRow.id;

    // 2) Llamar al microservicio IA
    const iaResp = await axios.post(`${MICRO_IA_URL}/predict`, {
      texto: sintomas,
      paciente_id: pacienteId,
    });

    const iaData = iaResp.data;
    const diagnostico =
      iaData.diagnóstico || iaData.diagnostico || 'Sin diagnóstico';
    const probabilidad =
      iaData.confianza ?? iaData.probabilidad ?? 0;
    const recomendaciones =
      iaData.nota || iaData.recomendaciones || null;

    // 3) Insertar en prediagnosticos
    const predResult = await client.query(
      `
      INSERT INTO prediagnosticos
        (sintoma_id, diagnostico, probabilidad, recomendaciones)
      VALUES ($1, $2, $3, $4)
      RETURNING id, fecha_prediccion;
      `,
      [sintomaId, diagnostico, probabilidad, recomendaciones]
    );
    const predRow = predResult.rows[0];
    const prediagnosticoId = predRow.id;

    // 4) Obtener versión de IA activa (si existe)
    const iaVersionResult = await client.query(
      `
      SELECT id
      FROM ia_versiones
      WHERE estado = 'activo'
      ORDER BY fecha_lanzamiento DESC
      LIMIT 1;
      `
    );
    const iaVersionId = iaVersionResult.rows[0]?.id || null;

    let historialRow = null;
    if (iaVersionId) {
      const histResult = await client.query(
        `
        INSERT INTO historial_prediagnosticos
          (paciente_id, ia_version_id, sintomas, diagnostico, probabilidad, estado)
        VALUES ($1, $2, $3, $4, $5, 'pendiente')
        RETURNING id, fecha_prediccion, estado;
        `,
        [pacienteId, iaVersionId, sintomas, diagnostico, probabilidad]
      );
      historialRow = histResult.rows[0];
    }

    // 5) Actualizar estado de sintomas
    await client.query(
      `
      UPDATE sintomas
      SET estado = 'prediagnóstico realizado'
      WHERE id = $1;
      `,
      [sintomaId]
    );

    await client.query('COMMIT');

    // 6) Devolver al controlador
    return {
      sintoma_id: sintomaId,
      prediagnostico_id: prediagnosticoId,
      historial_id: historialRow?.id ?? null,
      paciente_id: pacienteId,
      sintomas,
      diagnostico,
      probabilidad,
      recomendaciones,
      fecha_prediccion: predRow.fecha_prediccion,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error en crearPrediagnostico:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  crearPrediagnostico,
};
    