const { sequelize } = require('../config/db');
const { Usuario } = require('./usuario');
const { Paciente } = require('./paciente');

// Definir relaciones
Paciente.belongsTo(Usuario, { 
  as: 'padre', 
  foreignKey: 'padre_id', 
  onDelete: 'CASCADE' 
});
Usuario.hasMany(Paciente, { 
  as: 'hijos', 
  foreignKey: 'padre_id' 
});

// Exportar todo
module.exports = {
  sequelize,
  Usuario,
  Paciente
};