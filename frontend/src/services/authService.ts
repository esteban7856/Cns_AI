const API_URL = process.env.REACT_APP_API_URL!;

// Login
export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.mensaje || 'Error en login');
  }
  
  return res.json();
};

// Registro
export const register = async (data: {
  nombre: string;
  apellido: string;
  email: string;
  codigoMedico?: string;
}) => {
  const res = await fetch(`${API_URL}/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.mensaje || 'Error en registro');
  }
  
  return res.json();
};

// Olvidé contraseña
export const forgotPassword = async (email: string) => {
  const res = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.mensaje || 'Error al solicitar recuperación');
  }
  
  return res.json();
};

// Cambiar contraseña (primer ingreso)
export const cambiarPasswordPrimeraVez = async (nuevaContraseña: string) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const res = await fetch(`${API_URL}/cambiar-password-primera-vez`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ nuevaContraseña })
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.mensaje || 'Error al cambiar contraseña');
  }
  
  return res.json();
};

// Reset password (desde olvidé contraseña)
export const resetPassword = async (email: string, nuevaContraseña: string) => {
  const res = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, nuevaContraseña }),
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.mensaje || 'Error al restablecer contraseña');
  }
  
  return res.json();
};

// Verificar token
export const verifyToken = async (token: string) => {
  const res = await fetch(`${API_URL}/verify-token`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  
  if (!res.ok) {
    throw new Error('Token inválido');
  }
  
  return res.json();
};

// Logout (limpiar localStorage)
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Obtener usuario desde localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Obtener token desde localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Verificar si está autenticado
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Verificar si es primer ingreso
export const isFirstLogin = () => {
  const user = getCurrentUser();
  return user?.primerIngreso === true;
};