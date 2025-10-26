// src/models/prediagnostico.js
const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');

// Importar modelos después de definirlos para evitar dependencias circulares
const { Sintoma } = require('./sintoma');  // Importamos Sintoma correctamente

const Prediagnostico = sequelize.define('Prediagnostico', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  diagnostico: { type: DataTypes.STRING, allowNull: false },
  probabilidad: { type: DataTypes.FLOAT, validate: { min: 0, max: 1 } },
  recomendaciones: { type: DataTypes.TEXT },
  fecha_prediccion: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, { timestamps: false, freezeTableName: true, tableName: 'prediagnosticos' });

// Relación entre Prediagnostico y Sintoma
Prediagnostico.belongsTo(Sintoma, { foreignKey: 'sintoma_id', onDelete: 'CASCADE' });
Sintoma.hasOne(Prediagnostico, { foreignKey: 'sintoma_id', as: 'prediagnostico' });

module.exports = { Prediagnostico };
