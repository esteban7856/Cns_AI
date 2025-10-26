  // src/middlewares/auth.js
  const jwt = require('jsonwebtoken');

  // Middleware para verificar roles de usuario
  const rol = (rolesPermitidos) => {
    return (req, res, next) => {
      if (!req.usuario || !req.usuario.rol) {
        return res.status(403).json({ mensaje: 'No se pudo verificar el rol del usuario' });
      }
        const rolUsuario = req.usuario.rol.toLowerCase();
        const permitidos = rolesPermitidos.map(r => r.toLowerCase());

      if (permitidos.includes(rolUsuario)) {
        next();
      } else {
        res.status(403).json({ mensaje: 'No tienes permiso para realizar esta acción' });
      }
    };
  };

  const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ mensaje: 'No autorizado, token faltante' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = decoded; // ahora usamos req.usuario para mantener consistencia
      next();
    } catch (error) {
      return res.status(403).json({ mensaje: 'Token inválido o expirado' });
    }
  };



  module.exports = { verificarToken, rol };
