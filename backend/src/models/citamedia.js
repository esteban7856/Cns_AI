const CitaMedica = sequelize.define('CitaMedica', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fecha_cita: { type: DataTypes.DATE, allowNull: false },
    estado: { type: DataTypes.ENUM('pendiente','confirmada','cancelada','finalizada'), defaultValue: 'pendiente' },
    motivo: { type: DataTypes.STRING },
    notas: { type: DataTypes.TEXT }
  }, { timestamps: false });
  
  CitaMedica.belongsTo(Paciente, { foreignKey: 'paciente_id', onDelete: 'CASCADE' });
  Paciente.hasMany(CitaMedica, { foreignKey: 'paciente_id', as: 'citas' });
  
  CitaMedica.belongsTo(Prediagnostico, { foreignKey: 'historial_id', onDelete: 'CASCADE' });
  Prediagnostico.hasMany(CitaMedica, { foreignKey: 'historial_id', as: 'citas' });
  
  CitaMedica.belongsTo(Usuario, { foreignKey: 'medico_id', onDelete: 'SET NULL' });
  Usuario.hasMany(CitaMedica, { foreignKey: 'medico_id', as: 'citas_medico' });
  