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
    if (!window.confirm("¿Estás seguro de eliminar este horario?")) return;
    try {
      await deleteHorario(id);
      cargarHorarios();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar horario");
    }
  };

  const diasSemana = [
    { value: "lunes", label: "Lunes" },
    { value: "martes", label: "Martes" },
    { value: "miércoles", label: "Miércoles" },
    { value: "jueves", label: "Jueves" },
    { value: "viernes", label: "Viernes" },
    { value: "sábado", label: "Sábado" },
    { value: "domingo", label: "Domingo" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004B43] to-[#00695C] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header con Logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/20">
              <img 
                src="../assets/logo-cns.png" 
                alt="CNS Logo" 
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden bg-white/20 backdrop-blur-sm w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-bold border border-white/30">
                CNS
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Gestión de Horarios Médicos
              </h1>
              <p className="text-white/80 mt-1">
                Configura tus horarios de atención para una mejor organización
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
              <p className="text-sm text-white/80">Horarios registrados</p>
              <p className="text-2xl font-bold text-white">{horarios.length}</p>
            </div>
          </div>
        </div>

        {/* FORMULARIO DE NUEVO HORARIO */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
          <div className="flex items-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl mr-4 border border-white/30">
              <span className="text-2xl">⏰</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Registrar Nuevo Horario
              </h2>
              <p className="text-white/80">
                Agrega tus horarios de atención semanal
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-white mb-2">
                Día de la semana
              </label>
              <select
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl p-4 focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 hover:bg-white/20"
                value={nuevo.dia_semana}
                onChange={(e) =>
                  setNuevo({ ...nuevo, dia_semana: e.target.value })
                }
              >
                <option value="" className="text-gray-800">Selecciona un día</option>
                {diasSemana.map((dia) => (
                  <option key={dia.value} value={dia.value} className="text-gray-800">
                    {dia.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Hora de inicio
              </label>
              <input
                type="time"
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl p-4 focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 hover:bg-white/20"
                value={nuevo.hora_inicio}
                onChange={(e) =>
                  setNuevo({ ...nuevo, hora_inicio: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Hora de fin
              </label>
              <input
                type="time"
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl p-4 focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 hover:bg-white/20"
                value={nuevo.hora_fin}
                onChange={(e) =>
                  setNuevo({ ...nuevo, hora_fin: e.target.value })
                }
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={registrarHorario}
                className="w-full bg-white text-[#004B43] px-6 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 hover:bg-gray-100"
              >
                <span>➕</span>
                <span>Agregar Horario</span>
              </button>
            </div>
          </div>
        </div>

        {/* LISTADO DE HORARIOS */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl mr-4 border border-white/30">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Horarios Configurados
                </h2>
                <p className="text-white/80">
                  Gestiona tus horarios de atención semanal
                </p>
              </div>
            </div>
            <button
              onClick={cargarHorarios}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-colors duration-300 flex items-center space-x-2 border border-white/20"
            >
              <span>🔄</span>
              <span>Actualizar</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="text-white">Cargando horarios...</span>
              </div>
            </div>
          ) : horarios.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-white/30 rounded-2xl">
              <div className="text-6xl mb-4 text-white">⏰</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No hay horarios registrados
              </h3>
              <p className="text-white/80 max-w-md mx-auto">
                Comienza agregando tu primer horario de atención usando el formulario superior.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/20">
              <table className="min-w-full">
                <thead className="bg-white/20 backdrop-blur-sm text-white">
                  <tr>
                    <th className="p-4 text-left font-semibold">Día</th>
                    <th className="p-4 text-left font-semibold">Hora de Inicio</th>
                    <th className="p-4 text-left font-semibold">Hora de Fin</th>
                    <th className="p-4 text-left font-semibold">Duración</th>
                    <th className="p-4 text-left font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {horarios.map((h) => (
                    <tr
                      key={h.id}
                      className="hover:bg-white/10 transition-colors duration-300 group"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-white/20 text-white p-2 rounded-lg border border-white/30">
                            <span className="font-semibold capitalize">
                              {h.dia_semana.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-white capitalize">
                            {h.dia_semana}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
                          {h.hora_inicio}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="bg-red-500/20 text-red-200 px-3 py-1 rounded-full text-sm font-medium border border-red-500/30">
                          {h.hora_fin}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-white/80 text-sm font-medium">
                          {(() => {
                            const inicio = new Date(`2000-01-01T${h.hora_inicio}`);
                            const fin = new Date(`2000-01-01T${h.hora_fin}`);
                            const diff = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);
                            return `${diff} horas`;
                          })()}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => eliminarHorario(h.id)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 border border-red-500/30"
                        >
                          <span>🗑️</span>
                          <span>Eliminar</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Informativo */}
        <div className="mt-8 text-center">
          <p className="text-white/80 text-sm">
            💡 <strong>Consejo:</strong> Mantén tus horarios actualizados para una mejor experiencia de tus pacientes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Horarios;    