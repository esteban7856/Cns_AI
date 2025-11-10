const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/auth";

// Login
export interface LoginResponse {
  mensaje: string;
  id: number;
  token: string;
  primerIngreso: boolean;
  rol: string;
  nombre: string;
  apellido: string;
  email: string;
  requiereNuevaContrasena?: boolean;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
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
    throw new Error(errorData.mensaje || "Error al solicitar recuperación");
  }

  return res.json();
};

//   Verificar código temporal (devuelve token temporal)
export const verifyRecoveryCode = async (email: string, codigo: string) => {
  const res = await fetch(`${API_URL}/verificar-codigo-temporal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, codigo }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.mensaje || "Código inválido o expirado");
  }

  return res.json(); // → { mensaje, token }
};

//   Cambiar contraseña (primer ingreso)
export const cambiarPasswordPrimeraVez = async (nuevaContrasena: string) => {
  const token = localStorage.getItem("token") || localStorage.getItem("resetToken");
  if (!token) throw new Error("No hay token de autenticación");

  const res = await fetch(`${API_URL}/cambiar-password-primera-vez`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ nuevaContrasena }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.mensaje || "Error al cambiar contraseña");
  }

  return res.json();
};

//   Reset password (usa token temporal del paso anterior)
export const resetPassword = async (resetToken: string, nuevaContrasena: string) => {
  const res = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${resetToken}`,
    },
    body: JSON.stringify({ nuevaContrasena }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.mensaje || "Error al restablecer contraseña");
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

