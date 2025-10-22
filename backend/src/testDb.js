// src/testDb.js
require('dotenv').config(); // Cargar variables de entorno
const { sequelize } = require('./config/db');

(async () => {
  try {
    await sequelize.authenticate(); // Intenta conectar
    console.log('✅ Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  } finally {
    await sequelize.close(); // Cierra la conexión después de probar
  }
})();
