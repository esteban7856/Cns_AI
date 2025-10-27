import axios from "axios";
import { getCurrentUser } from "./authService";


const API_URL = "http://localhost:5000/api/citas";
export interface Cita {
  id: number;
  fecha_cita: string;
  estado: string;
  motivo?: string;
  notas?: string;
  Paciente?: {
    id: number;
    nombre: string;
    apellido: string;
  };
  Usuario?: {
    id: number;
    nombre: string;
    apellido: string;
  };
}

/** 🔹 Obtener citas del médico autenticado */
export async function getCitasMedico(): Promise<Cita[]> {
  const user = getCurrentUser();
  if (!user || !user.rol || user.rol !== "medico") {
    throw new Error("Usuario no autorizado o no es médico");
  }

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token no encontrado");

  console.log("📥 [CitaService] Obteniendo citas para médico:", user.email);

  try {
    const res = await axios.get(API_URL, {
      params: { medico_id: user.id },
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ [CitaService] Citas obtenidas:", res.data);
    return Array.isArray(res.data) ? res.data : res.data.data || [];
  } catch (err: any) {
    console.error("❌ [CitaService] Error al obtener citas:", err.response?.data || err.message);
    throw new Error(err.response?.data?.error || "Error al obtener citas médicas");
  }
}

/** 🔹 Cambiar estado de una cita */
export async function actualizarEstadoCita(
  id: number,
  nuevoEstado: "pendiente" | "confirmada" | "cancelada" | "finalizada"
): Promise<string> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token no encontrado");

  console.log(`🟡 [CitaService] Actualizando cita #${id} → estado: ${nuevoEstado}`);

  try {
    const res = await axios.put(
      `${API_URL}/${id}/estado`,
      { estado: nuevoEstado },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("✅ [CitaService] Cita actualizada:", res.data);
    return res.data?.mensaje || "Estado de cita actualizado correctamente";
  } catch (err: any) {
    console.error("❌ [CitaService] Error al actualizar estado:", err.response?.data || err.message);
    throw new Error(err.response?.data?.error || "Error al cambiar estado de la cita");
  }
}
