import React, { useEffect, useState } from "react";
import {
  getHorarios,
  createHorario,
  deleteHorario,
  Horario,
} from "../services/horarioService";

const Horarios: React.FC = () => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [nuevo, setNuevo] = useState({
    dia_semana: "",
    hora_inicio: "",
    hora_fin: "",
  });
  const [loading, setLoading] = useState(false);

  const cargarHorarios = async () => {
    setLoading(true);
    try {
      const data = await getHorarios();
      setHorarios(data);
    } catch (error) {
      console.error("❌ Error al cargar horarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHorarios();
  }, []);

  const registrarHorario = async () => {
    if (!nuevo.dia_semana || !nuevo.hora_inicio || !nuevo.hora_fin) {
      alert("Completa todos los campos");
      return;
    }

    try {
      await createHorario(nuevo);
      alert("Horario agregado ✅");
      setNuevo({ dia_semana: "", hora_inicio: "", hora_fin: "" });
      cargarHorarios();
    } catch (error) {
      console.error(error);
      alert("Error al registrar horario");
    }
  };

  const eliminarHorario = async (id: number) => {
    if (!window.confirm("¿Eliminar este horario?")) return;
    try {
      await deleteHorario(id);
      cargarHorarios();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar horario");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-cns-blue-dark mb-6">
        🕒 Gestión de Horarios Médicos
      </h1>

      {/* FORMULARIO DE NUEVO HORARIO */}
      <div className="bg-white shadow rounded-lg p-6 mb-8 border-l-4 border-green-500">
        <h2 className="text-lg font-semibold mb-4 text-cns-blue">
          Registrar nuevo horario
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            className="border p-2 rounded"
            value={nuevo.dia_semana}
            onChange={(e) =>
              setNuevo({ ...nuevo, dia_semana: e.target.value })
            }
          >
            <option value="">Día</option>
            <option value="lunes">Lunes</option>
            <option value="martes">Martes</option>
            <option value="miércoles">Miércoles</option>
            <option value="jueves">Jueves</option>
            <option value="viernes">Viernes</option>
          </select>

          <input
            type="time"
            className="border p-2 rounded"
            value={nuevo.hora_inicio}
            onChange={(e) =>
              setNuevo({ ...nuevo, hora_inicio: e.target.value })
            }
          />

          <input
            type="time"
            className="border p-2 rounded"
            value={nuevo.hora_fin}
            onChange={(e) =>
              setNuevo({ ...nuevo, hora_fin: e.target.value })
            }
          />

          <button
            onClick={registrarHorario}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* LISTADO DE HORARIOS */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-cns-blue">
          Horarios configurados
        </h2>

        {loading ? (
          <p>Cargando...</p>
        ) : horarios.length === 0 ? (
          <p className="text-gray-500">No tienes horarios registrados.</p>
        ) : (
          <table className="min-w-full text-sm border">
            <thead className="bg-cns-blue text-white">
              <tr>
                <th className="p-3 text-left">Día</th>
                <th className="p-3 text-left">Inicio</th>
                <th className="p-3 text-left">Fin</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {horarios.map((h) => (
                <tr
                  key={h.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 capitalize">{h.dia_semana}</td>
                  <td className="p-3">{h.hora_inicio}</td>
                  <td className="p-3">{h.hora_fin}</td>
                  <td className="p-3">
                    <button
                      onClick={() => eliminarHorario(h.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Horarios;
