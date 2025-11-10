const { models } = require('../models');
const { HorarioMedico, CitaMedica, Usuario } = require('../models');


const { Op } = require('sequelize');

// Crear horario
exports.crearHorario = async (req, res) => {
  try {
    const { dia_semana, hora_inicio, hora_fin } = req.body;
    const medico_id = req.usuario.id; // ID del médico autenticado

    console.log(`Médico autenticado: ${medico_id}`);

    // Verificar que el usuario autenticado sea un médico
    const usuario = await Usuario.findByPk(medico_id);
    if (!usuario || usuario.rol !== 'medico') {
      console.log(`El usuario con ID ${medico_id} no es un médico.`);
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

//   Obtener horarios por médico
exports.obtenerHorariosPorMedico = async (req, res) => {
  try {
    const { medico_id } = req.params;
    console.log(` Obteniendo horarios para el médico ID: ${medico_id}`);

    // Obtener los horarios de un médico
    const horarios = await HorarioMedico.findAll({
      where: { medico_id },
      order: [['dia_semana', 'ASC'], ['hora_inicio', 'ASC']],
    });

    if (horarios.length === 0) {
      console.log(` El médico ID ${medico_id} no tiene horarios registrados.`);
      return res.status(404).json({ mensaje: 'El médico no tiene horarios registrados' });
    }

    console.log(` Horarios encontrados para el médico ID ${medico_id}:`, horarios);
    res.json(horarios);
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener horarios', error: error.message });
  }
};

//   Eliminar horario
exports.eliminarHorario = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(` Eliminando horario con ID ${id}`);

    // Eliminar horario por ID
    await HorarioMedico.destroy({ where: { id } });

    console.log(` Horario con ID ${id} eliminado correctamente.`);
    res.json({ mensaje: 'Horario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar horario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar horario', error: error.message });
  }
};

//   Obtener disponibilidad de un médico en una fecha específica
exports.obtenerDisponibilidad = async (req, res) => {
  try {
    const { medico_id } = req.params;
    const { fecha } = req.query;

    if (!fecha) {
      return res.status(400).json({ mensaje: "Debe enviar la fecha (YYYY-MM-DD)" });
    }

    const fechaObj = new Date(fecha);
    const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    const dia_semana = dias[fechaObj.getDay()]; // Determinar el día según la fecha

    console.log(` Verificando horarios del médico ${medico_id} para el ${dia_semana}`);

    // Buscar horarios activos SOLO del día seleccionado
    const horarios = await HorarioMedico.findAll({
      where: { medico_id, dia_semana, estado: true },
      order: [["hora_inicio", "ASC"]],
    });

    if (!horarios || horarios.length === 0) {
      return res.status(404).json({
        mensaje: `El médico no tiene horarios asignados para ${dia_semana}`,
        disponibles: [],
        ocupadas: [],
      });
    }

    // Obtener citas existentes en ese día
    const fechaInicio = new Date(`${fecha}T00:00:00`);
    const fechaFin = new Date(`${fecha}T23:59:59`);

    const citas = await CitaMedica.findAll({
      where: {
        medico_id,
        fecha_cita: { [Op.between]: [fechaInicio, fechaFin] },
        estado: { [Op.ne]: "cancelada" },
      },
      attributes: ["fecha_cita"],
    });

    // Convertir citas existentes a horas ocupadas
    const ocupadas = citas.map((c) => {
      const hora = new Date(c.fecha_cita);
      return hora.toISOString().substring(11, 16); 
    });

    //  Generar todas las horas disponibles según los horarios del día
    const disponibles = [];
    horarios.forEach((h) => {
      const [hInicio, mInicio] = h.hora_inicio.split(":").map(Number);
      const [hFin, mFin] = h.hora_fin.split(":").map(Number);
      const inicio = new Date(fechaObj.setHours(hInicio, mInicio, 0, 0));
      const fin = new Date(fechaObj.setHours(hFin, mFin, 0, 0));

      for (let d = new Date(inicio); d < fin; d.setMinutes(d.getMinutes() + 60)) {
        const horaStr = d.toISOString().substring(11, 16);
        if (!ocupadas.includes(horaStr)) {
          disponibles.push(horaStr);
        }
      }
    });

    return res.json({
      medico_id,
      fecha,
      dia_semana,
      disponibles,
      ocupadas,
    });
  } catch (error) {
    console.error(" Error al obtener disponibilidad:", error);
    res.status(500).json({
      mensaje: "Error al obtener disponibilidad",
      error: error.message,
    });
  }
};