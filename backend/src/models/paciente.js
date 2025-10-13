const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');

const Paciente = sequelize.define('Paciente', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  apellido: { type: DataTypes.STRING, allowNull: false },
  fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: false },
  sexo: { type: DataTypes.ENUM('masculino', 'femenino'), allowNull: false },
  fecha_registro: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { 
  timestamps: false, 
  freezeTableName: true, 
  tableName: 'pacientes'
});

module.exports = { Paciente };