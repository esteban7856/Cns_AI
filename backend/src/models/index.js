const { sequelize } = require('../config/db');

// Importar modelos
const { Usuario } = require('./usuario');
const { Paciente } = require('./paciente');
const { CitaMedica, setModels: setCitaMedicaModels, setupAssociations: setupCitaMedicaAssociations } = require('./citaMedica');
const { Prediagnostico, setupAssociations: setupPrediagnosticoAssociations } = require('./prediagnostico');
const { HorarioMedico } = require('./horarioMedico');
const { Sintoma } = require('./sintoma');
// Configurar referencias cruzadas entre modelos
const models = {
  Usuario,
  Paciente,
  CitaMedica,
  Prediagnostico,
  HorarioMedico,
  Sintoma,
  sequelize
};

// Configurar referencias en los modelos que lo necesitan
if (setCitaMedicaModels) {
  setCitaMedicaModels(models);
}

// Configurar relaciones
function setupAssociations() {
  // Relación Usuario-Paciente
  Paciente.belongsTo(Usuario, { 
    as: 'padre', 
    foreignKey: 'padre_id', 
    onDelete: 'CASCADE' 
  });
  
  Usuario.hasMany(Paciente, { 
    as: 'hijos', 
    foreignKey: 'padre_id' 
  });

  // Configurar relaciones de CitaMedica
  if (setupCitaMedicaAssociations) {
    setupCitaMedicaAssociations();
  }

  // Configurar relaciones de Prediagnostico
  if (setupPrediagnosticoAssociations) {
    setupPrediagnosticoAssociations(models);
  }
}

// Inicializar relaciones
setupAssociations();

// Exportar modelos y sequelize
module.exports = { models, setupAssociations };