// src/models/usuario.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // ✅ desde db.js

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  apellido: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: {                // <-- nombre seguro para tu app
    type: DataTypes.STRING,
    allowNull: false,
    field: 'contraseña'       // <-- mapear al nombre real en la BD
  },
  primeringreso: { type: DataTypes.BOOLEAN, defaultValue: true },
  rol: { type: DataTypes.ENUM('padre','medico','administrador'), allowNull: false },
  codigo_restablecer: { type: DataTypes.STRING, allowNull: true },
  expiracion_codigo: { type: DataTypes.DATE, allowNull: true },
  fecha_registro: { type: DataTypes.DATE, defaultValue: sequelize.NOW }
}, {
  timestamps: false,
  freezeTableName: true,
  tableName: 'usuarios'
});


module.exports = { Usuario, sequelize };
