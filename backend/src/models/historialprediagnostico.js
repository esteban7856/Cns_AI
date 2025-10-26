const { sequelize } = require('../config/db');  // Correcto
const { DataTypes } = require('sequelize');
const HistorialPrediagnostico = sequelize.define('HistorialPrediagnostico', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sintomas: { type: DataTypes.TEXT, allowNull: false },
    diagnostico: { type: DataTypes.STRING, allowNull: false },
    probabilidad: { type: DataTypes.FLOAT, validate: { min: 0, max: 1 } },
    fecha_prediccion: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    estado: { type: DataTypes.ENUM('pendiente','confirmado','revisado'), defaultValue: 'pendiente' }
  }, {  timestamps: false, 
  freezeTableName: true, 
  tableName: 'historial_prediagnosticos' });
  
  HistorialPrediagnostico.belongsTo(Paciente, { foreignKey: 'paciente_id', onDelete: 'CASCADE' });
  Paciente.hasMany(HistorialPrediagnostico, { foreignKey: 'paciente_id', as: 'historiales' });
  
  HistorialPrediagnostico.belongsTo(IAVersion, { foreignKey: 'ia_version_id', onDelete: 'SET NULL' });
  IAVersion.hasMany(HistorialPrediagnostico, { foreignKey: 'ia_version_id', as: 'historiales' });
  