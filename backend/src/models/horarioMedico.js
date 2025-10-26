const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { Usuario } = require('./usuario');

const HorarioMedico = sequelize.define('HorarioMedico', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  dia_semana: { type: DataTypes.STRING(15), allowNull: false },
  hora_inicio: { type: DataTypes.TIME, allowNull: false },
  hora_fin: { type: DataTypes.TIME, allowNull: false },
  estado: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'horarios_medicos',
  timestamps: false,
  freezeTableName: true,
});

// Relaciones
HorarioMedico.belongsTo(Usuario, { foreignKey: 'medico_id', onDelete: 'CASCADE' });
Usuario.hasMany(HorarioMedico, { foreignKey: 'medico_id', as: 'horarios' });

module.exports = { HorarioMedico };
