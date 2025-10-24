  // controllers/citaController.js
  const { Op } = require('sequelize');
  const { CitaMedica, Paciente, Prediagnostico, Usuario, sequelize } = require('../models');

  /**
  * Helpers: validar existencia de FK
  */
  async function validarFKs({ paciente_id, historial_id, medico_id }) {
    if (paciente_id) {
      const p = await Paciente.findByPk(paciente_id);
      if (!p) throw { status: 400, message: 'Paciente no encontrado' };
    }
    if (historial_id) {
      const h = await Prediagnostico.findByPk(historial_id);
      if (!h) throw { status: 400, message: 'Prediagnóstico no encontrado' };
    }
    if (medico_id) {
      const m = await Usuario.findByPk(medico_id);
      if (!m) throw { status: 400, message: 'Médico (Usuario) no encontrado' };
    }
  }

  /**
  * Crear cita
  * body: { paciente_id, historial_id, medico_id, fecha_cita, motivo, notas }
  */
  exports.create = async (req, res) => {
    const { paciente_id, historial_id, medico_id, fecha_cita, motivo, notas } = req.body;
    try {
      if (!paciente_id || !fecha_cita) {
        return res.status(400).json({ error: 'paciente_id y fecha_cita son obligatorios' });
      }

      await validarFKs({ paciente_id, historial_id, medico_id });

      const newCita = await CitaMedica.create({
        paciente_id,
        historial_id: historial_id || null,
        medico_id: medico_id || null,
        fecha_cita,
        motivo: motivo || null,
        notas: notas || null,
        estado: 'pendiente'
      });

      // devolver con asociaciones
      const cita = await CitaMedica.findByPk(newCita.id, {
        include: [
          { model: Paciente, as: 'Paciente' },
          { model: Prediagnostico, as: 'Prediagnostico' },
          { model: Usuario, as: 'Usuario' }
        ]
      });

      return res.status(201).json(cita);
    } catch (err) {
      console.error(err);
      return res.status(err.status || 500).json({ error: err.message || 'Error creando cita' });
    }
  };

  /**
  * Listar citas con filtros y paginación
  * query params: paciente_id, medico_id, estado, fecha_from, fecha_to, page, limit
  */
  exports.list = async (req, res) => {
    try {
      const {
        paciente_id, medico_id, estado,
        fecha_from, fecha_to,
        page = 1, limit = 20, sort = 'fecha_cita', order = 'ASC'
      } = req.query;

      const where = {};
      if (paciente_id) where.paciente_id = paciente_id;
      if (medico_id) where.medico_id = medico_id;
      if (estado) where.estado = estado;
      if (fecha_from || fecha_to) {
        where.fecha_cita = {};
        if (fecha_from) where.fecha_cita[Op.gte] = new Date(fecha_from);
        if (fecha_to) where.fecha_cita[Op.lte] = new Date(fecha_to);
      }

      const offset = (Math.max(parseInt(page, 10), 1) - 1) * parseInt(limit, 10);

      const { rows, count } = await CitaMedica.findAndCountAll({
        where,
        include: [
          { model: Paciente, as: 'Paciente' },
          { model: Prediagnostico, as: 'Prediagnostico' },
          { model: Usuario, as: 'Usuario' }
        ],
        order: [[sort, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']],
        limit: parseInt(limit, 10),
        offset
      });

      return res.json({
        data: rows,
        meta: {
          total: count,
          page: parseInt(page, 10),
          per_page: parseInt(limit, 10),
          pages: Math.ceil(count / limit)
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error listando citas' });
    }
  };

  /**
  * Obtener una cita por id
  */
  exports.getById = async (req, res) => {
    try {
      const { id } = req.params;
      const cita = await CitaMedica.findByPk(id, {
        include: [
          { model: Paciente, as: 'Paciente' },
          { model: Prediagnostico, as: 'Prediagnostico' },
          { model: Usuario, as: 'Usuario' }
        ]
      });
      if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
      return res.json(cita);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error obteniendo cita' });
    }
  };

  /**
  * Actualizar cita (parcial)
  * body: { fecha_cita, motivo, notas, medico_id, historial_id, estado }
  */
  exports.update = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
      const cita = await CitaMedica.findByPk(id);
      if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });

      // validar FKs si vienen
      await validarFKs(updates);

      await cita.update(updates);
      const updated = await CitaMedica.findByPk(id, {
        include: [{ model: Paciente, as: 'Paciente' }, { model: Prediagnostico, as: 'Prediagnostico' }, { model: Usuario, as: 'Usuario' }]
      });

      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(err.status || 500).json({ error: err.message || 'Error actualizando cita' });
    }
  };

  /**
  * Cambiar estado (endpoint específico): body { estado } | estados permitidos: pendiente, confirmada, cancelada, finalizada
  */
  exports.changeEstado = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const estados = ['pendiente', 'confirmada', 'cancelada', 'finalizada'];
    try {
      if (!estados.includes(estado)) return res.status(400).json({ error: 'Estado inválido' });

      const cita = await CitaMedica.findByPk(id);
      if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });

      await cita.update({ estado });
      return res.json(cita);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error cambiando estado' });
    }
  };

  /**
  * Eliminar cita
  */
  exports.remove = async (req, res) => {
    const { id } = req.params;
    try {
      const cita = await CitaMedica.findByPk(id);
      if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });

      await cita.destroy();
      return res.json({ message: 'Cita eliminada' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error eliminando cita' });
    }
  };
