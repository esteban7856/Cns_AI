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
      console.error("Error al cargar horarios:", error);
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
      alert("Horario agregado");
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header con Logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-[#004B43] p-3 rounded-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Gestión de Horarios Médicos
              </h1>
              <p className="text-gray-600 mt-1">
                Configura tus horarios de atención para una mejor organización
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-600">Horarios registrados</p>
              <p className="text-2xl font-bold text-[#004B43]">{horarios.length}</p>
            </div>
          </div>
        </div>

        {/* FORMULARIO DE NUEVO HORARIO */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="bg-[#004B43] text-white p-3 rounded-xl mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Registrar Nuevo Horario
              </h2>
              <p className="text-gray-600">
                Agrega tus horarios de atención semanal
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Día de la semana
              </label>
              <select
                className="w-full bg-white border border-gray-300 text-gray-800 rounded-xl p-4 focus:ring-2 focus:ring-[#004B43] focus:border-transparent transition-all duration-300 hover:border-gray-400"
                value={nuevo.dia_semana}
                onChange={(e) =>
                  setNuevo({ ...nuevo, dia_semana: e.target.value })
                }
              >
                <option value="" className="text-gray-500">Selecciona un día</option>
                {diasSemana.map((dia) => (
                  <option key={dia.value} value={dia.value} className="text-gray-800">
                    {dia.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de inicio
              </label>
              <input
                type="time"
                className="w-full bg-white border border-gray-300 text-gray-800 rounded-xl p-4 focus:ring-2 focus:ring-[#004B43] focus:border-transparent transition-all duration-300 hover:border-gray-400"
                value={nuevo.hora_inicio}
                onChange={(e) =>
                  setNuevo({ ...nuevo, hora_inicio: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de fin
              </label>
              <input
                type="time"
                className="w-full bg-white border border-gray-300 text-gray-800 rounded-xl p-4 focus:ring-2 focus:ring-[#004B43] focus:border-transparent transition-all duration-300 hover:border-gray-400"
                value={nuevo.hora_fin}
                onChange={(e) =>
                  setNuevo({ ...nuevo, hora_fin: e.target.value })
                }
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={registrarHorario}
                className="w-full bg-[#004B43] text-white px-6 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 hover:bg-[#00382f]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Agregar Horario</span>
              </button>
            </div>
          </div>
        </div>

        {/* LISTADO DE HORARIOS */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-[#004B43] text-white p-3 rounded-xl mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Horarios Configurados
                </h2>
                <p className="text-gray-600">
                  Gestiona tus horarios de atención semanal
                </p>
              </div>
            </div>
            <button
              onClick={cargarHorarios}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-colors duration-300 flex items-center space-x-2 border border-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Actualizar</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004B43]"></div>
                <span className="text-gray-600">Cargando horarios...</span>
              </div>
            </div>
          ) : horarios.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No hay horarios registrados
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Comienza agregando tu primer horario de atención usando el formulario superior.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="min-w-full">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="p-4 text-left font-semibold">Día</th>
                    <th className="p-4 text-left font-semibold">Hora de Inicio</th>
                    <th className="p-4 text-left font-semibold">Hora de Fin</th>
                    <th className="p-4 text-left font-semibold">Duración</th>
                    <th className="p-4 text-left font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {horarios.map((h) => (
                    <tr
                      key={h.id}
                      className="hover:bg-gray-50 transition-colors duration-300 group"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-[#004B43] text-white p-2 rounded-lg">
                            <span className="font-semibold capitalize">
                              {h.dia_semana.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-800 capitalize">
                            {h.dia_semana}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                          {h.hora_inicio}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium border border-red-200">
                          {h.hora_fin}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-600 text-sm font-medium">
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
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 border border-red-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 inline-flex items-center space-x-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-blue-700 text-sm">
              <strong>Consejo:</strong> Mantén tus horarios actualizados para una mejor experiencia de tus pacientes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Horarios;