const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');
const { Paciente } = require('./paciente');

const Sintoma = sequelize.define('Sintoma', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sintomas: { type: DataTypes.TEXT, allowNull: false },
    estado: { type: DataTypes.ENUM('pendiente','en análisis','prediagnóstico realizado'), defaultValue: 'pendiente' },
    fecha_sintomas: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {  timestamps: false, 
  freezeTableName: true, 
  tableName: 'sintomas' });
  
  Sintoma.belongsTo(Paciente, { foreignKey: 'paciente_id', onDelete: 'CASCADE' });
  Paciente.hasMany(Sintoma, { foreignKey: 'paciente_id', as: 'sintomas' });

module.exports = { Sintoma };