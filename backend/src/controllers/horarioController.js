const { models } = require('../models');
const { HorarioMedico, CitaMedica, Usuario } = require('../models');


const { Op } = require('sequelize');

// 🔹 Crear horario
exports.crearHorario = async (req, res) => {
  try {
    const { dia_semana, hora_inicio, hora_fin } = req.body;
    const medico_id = req.usuario.id; // ID del médico autenticado

    console.log(`🔑 Médico autenticado: ${medico_id}`);

    // Verificar que el usuario autenticado sea un médico
    const usuario = await Usuario.findByPk(medico_id);
    if (!usuario || usuario.rol !== 'medico') {
      console.log(`🚫 El usuario con ID ${medico_id} no es un médico.`);
      return res.status(403).json({ mensaje: 'Solo los médicos pueden registrar horarios' });
    }

    // Registrar el nuevo horario
    const nuevo = await HorarioMedico.create({
      medico_id,
      dia_semana,
      hora_inicio,
      hora_fin,
    });

    console.log(`Nuevo horario registrado para el médico ID ${medico_id}:`, nuevo);
    res.status(201).json({ mensaje: 'Horario registrado exitosamente', horario: nuevo });
  } catch (error) {
    console.error('Error al crear horario:', error);
    res.status(500).json({ mensaje: 'Error al crear horario', error: error.message });
  }
};

// 🔹 Obtener horarios por médico
exports.obtenerHorariosPorMedico = async (req, res) => {
  try {
    const { medico_id } = req.params;
    console.log(`🔍 Obteniendo horarios para el médico ID: ${medico_id}`);

    // Obtener los horarios de un médico
    const horarios = await HorarioMedico.findAll({
      where: { medico_id },
      order: [['dia_semana', 'ASC'], ['hora_inicio', 'ASC']],
    });

    if (horarios.length === 0) {
      console.log(`🚫 El médico ID ${medico_id} no tiene horarios registrados.`);
      return res.status(404).json({ mensaje: 'El médico no tiene horarios registrados' });
    }

    console.log(`✅ Horarios encontrados para el médico ID ${medico_id}:`, horarios);
    res.json(horarios);
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener horarios', error: error.message });
  }
};

// 🔹 Eliminar horario
exports.eliminarHorario = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Eliminando horario con ID ${id}`);

    // Eliminar horario por ID
    await HorarioMedico.destroy({ where: { id } });

    console.log(`✅ Horario con ID ${id} eliminado correctamente.`);
    res.json({ mensaje: 'Horario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar horario', error: error.message });
  }
};

// 🔹 Obtener disponibilidad de un médico en una fecha específica
exports.obtenerDisponibilidad = async (req, res) => {
  try {
    const { medico_id } = req.params;
    const { fecha } = req.query;
    console.log(`🔑 Médico ID ${medico_id} - Consultando disponibilidad para la fecha ${fecha}`);

    if (!fecha) {
      console.log('🚫 No se recibió una fecha válida.');
      return res.status(400).json({ mensaje: 'Debe enviar la fecha (YYYY-MM-DD)' });
    }

    // 1️⃣ Buscar los horarios configurados del médico
    const horarios = await HorarioMedico.findAll({
      where: { medico_id, estado: true },
    });

    if (horarios.length === 0) {
      console.log(`🚫 El médico ID ${medico_id} no tiene horarios configurados.`);
      return res.status(404).json({ mensaje: 'El médico no tiene horarios registrados' });
    }

    console.log(`✅ Horarios encontrados para el médico ID ${medico_id}:`, horarios);

    // 2️⃣ Obtener citas ocupadas ese día
    const citas = await CitaMedica.findAll({
      where: {
        medico_id,
        fecha_cita: {
          [Op.between]: [
            new Date(`${fecha}T00:00:00`),
            new Date(`${fecha}T23:59:59`)
          ]
        },
        estado: { [Op.ne]: 'cancelada' }
      },
    });

    const ocupadas = citas.map(c => {
      const hora = new Date(c.fecha_cita).toISOString().substring(11, 16);
      return hora;
    });

    console.log(`📅 Citas ocupadas para el médico ID ${medico_id} el ${fecha}:`, ocupadas);

    // 3️⃣ Generar bloques de 30 minutos entre inicio y fin
    const disponibles = [];
    horarios.forEach(horario => {
      let [h, m, s] = horario.hora_inicio.split(':').map(Number);
      const [hFin, mFin] = horario.hora_fin.split(':').map(Number);

      while (h < hFin || (h === hFin && m < mFin)) {
        const bloque = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        if (!ocupadas.includes(bloque)) disponibles.push(bloque);
        m += 30;
        if (m >= 60) { h += 1; m = 0; }
      }
    });

    console.log(`✅ Horas disponibles para el médico ID ${medico_id} el ${fecha}:`, disponibles);

    return res.json({
      medico_id,
      fecha,
      disponibles,
      ocupadas
    });
  } catch (error) {
    console.error('Error al obtener disponibilidad:', error);
    res.status(500).json({ mensaje: 'Error al obtener disponibilidad', error: error.message });
  }
};
