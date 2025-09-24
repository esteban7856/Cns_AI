const Prediagnostico = sequelize.define('Prediagnostico', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    diagnostico: { type: DataTypes.STRING, allowNull: false },
    probabilidad: { type: DataTypes.FLOAT, validate: { min: 0, max: 1 } },
    recomendaciones: { type: DataTypes.TEXT },
    fecha_prediccion: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
  }, { timestamps: false });
  
  Prediagnostico.belongsTo(Sintoma, { foreignKey: 'sintoma_id', onDelete: 'CASCADE' });
  Sintoma.hasOne(Prediagnostico, { foreignKey: 'sintoma_id', as: 'prediagnostico' });
  