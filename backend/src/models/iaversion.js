const IAVersion = sequelize.define('IAVersion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    version: { type: DataTypes.STRING, allowNull: false },
    fecha_lanzamiento: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    descripcion: { type: DataTypes.TEXT },
    modelo_archivo: { type: DataTypes.STRING },
    precision: { type: DataTypes.FLOAT, validate: { min:0, max:1 } },
    estado: { type: DataTypes.ENUM('activo','inactivo','en prueba'), defaultValue: 'activo' },
    comentarios_adicionales: { type: DataTypes.TEXT }
  }, { timestamps: false });
  