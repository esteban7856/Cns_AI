import axios from "axios";
import { getCurrentUser } from "./authService";

// Asegurarse de que no termine en /api para evitar duplicación
const API_URL = "http://localhost:5000/api/horarios";

export interface Horario {
  id: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  estado: boolean;
  medico_id?: number;
}

/** 🔹 Obtener todos los horarios del médico autenticado */
export async function getHorarios(): Promise<Horario[]> {
  const user = getCurrentUser();
  if (!user?.token) throw new Error("Usuario no autenticado");

  console.log("📥 [HorarioService] Cargando horarios para médico:", user.id);

  try {
    const res = await axios.get(`${API_URL}/${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    console.log("✅ [HorarioService] Respuesta horarios:", res.data);
    return res.data;
  } catch (err: any) {
    console.error("❌ [HorarioService] Error al obtener horarios:", err.response?.data || err.message);
    throw err;
  }
}

/** 🔹 Crear un nuevo horario */
export async function createHorario(data: {
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
}): Promise<string> {
  const user = getCurrentUser();
  if (!user?.token) throw new Error("Usuario no autenticado");

  console.log("🟢 [HorarioService] Creando horario con datos:", data);

  try {
    const res = await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    console.log("✅ [HorarioService] Horario creado:", res.data);
    return res.data.mensaje || "Horario registrado exitosamente";
  } catch (err: any) {
    console.error("❌ [HorarioService] Error al registrar horario:");
    console.error("🔸 Código de estado:", err.response?.status);
    console.error("🔸 Respuesta backend:", err.response?.data);
    console.error("🔸 Mensaje:", err.message);

    // Lanzamos el mensaje de error legible
    throw new Error(err.response?.data?.mensaje || "Error al registrar horario");
  }
}

/** 🔹 Eliminar un horario */
export async function deleteHorario(id: number): Promise<string> {
  const user = getCurrentUser();
  if (!user?.token) throw new Error("Usuario no autenticado");

  console.log("🗑️ [HorarioService] Eliminando horario ID:", id);

  try {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    console.log("✅ [HorarioService] Horario eliminado:", res.data);
    return res.data.mensaje || "Horario eliminado correctamente";
  } catch (err: any) {
    console.error("❌ [HorarioService] Error al eliminar horario:", err.response?.data || err.message);
    throw new Error(err.response?.data?.mensaje || "Error al eliminar horario");
  }
}
