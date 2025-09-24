const Paciente = sequelize.define('Paciente', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    apellido: { type: DataTypes.STRING, allowNull: false },
    fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: false },
    sexo: { type: DataTypes.ENUM('masculino','femenino'), allowNull: false },
    fecha_registro: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
  }, { timestamps: false });
  
  // Relación con usuario (padre)
  Paciente.belongsTo(Usuario, { as: 'padre', foreignKey: 'padre_id', onDelete: 'CASCADE' });
  Usuario.hasMany(Paciente, { as: 'hijos', foreignKey: 'padre_id' });
  