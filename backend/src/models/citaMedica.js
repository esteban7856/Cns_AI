// src/models/citaMedica.js
const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');
const { Usuario } = require('./usuario');
const { Paciente } = require('./paciente');
const { Prediagnostico } = require('./prediagnostico');

const CitaMedica = sequelize.define('CitaMedica', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fecha_cita: { type: DataTypes.DATE, allowNull: false },
  estado: { type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada', 'finalizada'), defaultValue: 'pendiente' },
  motivo: { type: DataTypes.STRING },
  notas: { type: DataTypes.TEXT },
}, { timestamps: false, freezeTableName: true, tableName: 'citas_medicas' });

// Asociaciones (relaciones)
const setupAssociations = () => {
  CitaMedica.belongsTo(Paciente, { foreignKey: 'paciente_id', onDelete: 'CASCADE' });
  Paciente.hasMany(CitaMedica, { foreignKey: 'paciente_id', as: 'citas' });

  CitaMedica.belongsTo(Prediagnostico, { foreignKey: 'historial_id', onDelete: 'CASCADE' });
  Prediagnostico.hasOne(CitaMedica, { foreignKey: 'historial_id' });

  CitaMedica.belongsTo(Usuario, { foreignKey: 'medico_id', onDelete: 'SET NULL', as: 'medico' });
  Usuario.hasMany(CitaMedica, { foreignKey: 'medico_id', as: 'citas_medico' });
};

module.exports = { CitaMedica, setupAssociations };
