const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const usuariosRoutes = require('./routes/usuarios');
const pacienteRoutes = require('./routes/pacientes'); 
const { sequelize } = require('./config/db'); 
const citasRouter = require('./routes/citas');

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/citas', citasRouter);

// Inicialización del servidor
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida.');
    await sequelize.sync();
    console.log('Modelos sincronizados.');

    app.listen(port, () => {
      console.log(`Servidor Backend corriendo en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor o conectar la BD:', error);
    process.exit(1);
  }
}

start();
