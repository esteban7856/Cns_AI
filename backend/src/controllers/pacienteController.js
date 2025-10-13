const { Paciente, Usuario } = require('../models');
const { Op } = require('sequelize');

// Crear un nuevo paciente (hijo)
const crearPaciente = async (req, res) => {
  try {
    const { nombre, apellido, fecha_nacimiento, sexo } = req.body;
    const padreId = req.usuario.id; // ID del padre autenticado

    // Verificar que el usuario sea un padre
    if (req.usuario.rol !== 'padre') {
      return res.status(403).json({ mensaje: 'Solo los padres pueden registrar pacientes' });
    }

    // Crear el paciente
    const paciente = await Paciente.create({
      nombre,
      apellido,
      fecha_nacimiento,
      sexo,
      padre_id: padreId
    });

    res.status(201).json({
      mensaje: 'Paciente registrado exitosamente',
      paciente
    });
  } catch (error) {
    console.error('Error al registrar paciente:', error);
    res.status(500).json({ mensaje: 'Error al registrar paciente', error: error.message });
  }
};

// Obtener todos los pacientes del padre
const obtenerPacientes = async (req, res) => {
  try {
    const padreId = req.usuario.id;
    
    // Si es admin, puede ver todos los pacientes
    const whereClause = req.usuario.rol === 'admin' ? {} : { padre_id: padreId };
    
    const pacientes = await Paciente.findAll({
      where: whereClause,
      include: [
        {
          model: Usuario,
          as: 'padre',
          attributes: ['id', 'nombre', 'apellido', 'email']
        }
      ]
    });

    res.json(pacientes);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ mensaje: 'Error al obtener pacientes', error: error.message });
  }
};

// Obtener un paciente por ID
const obtenerPacientePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const padreId = req.usuario.id;
    
    const paciente = await Paciente.findOne({
      where: {
        id,
        // Solo el padre o un admin pueden ver el paciente
        ...(req.usuario.rol !== 'admin' && { padre_id: padreId })
      },
      include: [
        {
          model: Usuario,
          as: 'padre',
          attributes: ['id', 'nombre', 'apellido', 'email']
        }
      ]
    });

    if (!paciente) {
      return res.status(404).json({ mensaje: 'Paciente no encontrado' });
    }

    res.json(paciente);
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    res.status(500).json({ mensaje: 'Error al obtener paciente', error: error.message });
  }
};

// Actualizar un paciente
const actualizarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, fecha_nacimiento, sexo } = req.body;
    const padreId = req.usuario.id;

    // Verificar que el paciente exista y pertenezca al padre (o sea admin)
    const paciente = await Paciente.findOne({
      where: {
        id,
        ...(req.usuario.rol !== 'admin' && { padre_id: padreId })
      }
    });

    if (!paciente) {
      return res.status(404).json({ mensaje: 'Paciente no encontrado' });
    }

    // Actualizar datos
    await paciente.update({
      nombre: nombre || paciente.nombre,
      apellido: apellido || paciente.apellido,
      fecha_nacimiento: fecha_nacimiento || paciente.fecha_nacimiento,
      sexo: sexo || paciente.sexo
    });

    res.json({ mensaje: 'Paciente actualizado exitosamente', paciente });
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    res.status(500).json({ mensaje: 'Error al actualizar paciente', error: error.message });
  }
};

// Eliminar un paciente
const eliminarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const padreId = req.usuario.id;

    // Verificar que el paciente exista y pertenezca al padre (o sea admin)
    const paciente = await Paciente.findOne({
      where: {
        id,
        ...(req.usuario.rol !== 'admin' && { padre_id: padreId })
      }
    });

    if (!paciente) {
      return res.status(404).json({ mensaje: 'Paciente no encontrado' });
    }

    // Eliminar paciente
    await paciente.destroy();

    res.json({ mensaje: 'Paciente eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    res.status(500).json({ mensaje: 'Error al eliminar paciente', error: error.message });
  }
};

module.exports = {
  crearPaciente,
  obtenerPacientes,
  obtenerPacientePorId,
  actualizarPaciente,
  eliminarPaciente
};