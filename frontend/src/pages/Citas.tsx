import { useEffect, useState } from "react";
import { getCitasMedico, Cita, actualizarEstadoCita } from "../services/citaService";

export default function CitaPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [actualizando, setActualizando] = useState<number | null>(null);

  useEffect(() => {
    cargarCitas();
  }, []);

  async function cargarCitas() {
    try {
      const data = await getCitasMedico();
      setCitas(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const cambiarEstadoCita = async (
    citaId: number,
    nuevoEstado: "pendiente" | "confirmada" | "cancelada" | "finalizada"
  ) => {
    setActualizando(citaId);
    try {
      await actualizarEstadoCita(citaId, nuevoEstado);
      setCitas(citas.map(c => 
        c.id === citaId ? { ...c, estado: nuevoEstado } : c
      ));
    } catch (err: any) {
      alert(`Error al actualizar estado: ${err.message}`);
    } finally {
      setActualizando(null);
    }
  };

  const citasFiltradas = filtroEstado === "todos" 
    ? citas 
    : citas.filter(cita => cita.estado === filtroEstado);

  const estadisticas = {
    total: citas.length,
    confirmadas: citas.filter(c => c.estado === "confirmada").length,
    pendientes: citas.filter(c => c.estado === "pendiente").length,
    canceladas: citas.filter(c => c.estado === "cancelada").length,
    finalizadas: citas.filter(c => c.estado === "finalizada").length,
  };

  const estadosDisponibles: Array<"pendiente" | "confirmada" | "cancelada" | "finalizada"> = [
    "pendiente",
    "confirmada",
    "cancelada",
    "finalizada",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-[#004B43] p-3 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gestión de Citas Médicas</h1>
              <p className="text-gray-600 text-sm">Administra y actualiza el estado de las citas</p>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600">Total de citas</p>
            <p className="text-2xl font-bold text-[#004B43]">{estadisticas.total}</p>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard 
            titulo="Total" 
            valor={estadisticas.total} 
            color="from-blue-500 to-blue-600"
            icono={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          <StatCard 
            titulo="Confirmadas" 
            valor={estadisticas.confirmadas} 
            color="from-green-500 to-green-600"
            icono={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard 
            titulo="Pendientes" 
            valor={estadisticas.pendientes} 
            color="from-yellow-500 to-yellow-600"
            icono={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard 
            titulo="Canceladas" 
            valor={estadisticas.canceladas} 
            color="from-red-500 to-red-600"
            icono={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
          />
          <StatCard 
            titulo="Finalizadas" 
            valor={estadisticas.finalizadas} 
            color="from-gray-500 to-gray-600"
            icono={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Filtrar por estado</h2>
              <p className="text-gray-600 text-sm">Visualiza las citas según su estado actual</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["todos", "pendiente", "confirmada", "cancelada", "finalizada"].map((estado) => (
                <button
                  key={estado}
                  onClick={() => setFiltroEstado(estado)}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 capitalize border ${
                    filtroEstado === estado
                      ? "bg-[#004B43] text-white font-semibold border-[#004B43]"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                  }`}
                >
                  {estado}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#004B43] border-t-transparent"></div>
              <p className="text-gray-700 text-lg">Cargando citas médicas...</p>
              <p className="text-gray-500 text-sm">Estamos obteniendo la información más reciente</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Error al cargar las citas</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={cargarCitas}
              className="bg-[#004B43] text-white px-6 py-3 rounded-xl hover:bg-[#00382f] transition-colors font-semibold"
            >
              Reintentar
            </button>
          </div>
        ) : citasFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
            <svg className="w-20 h-20 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {filtroEstado === "todos" ? "No hay citas registradas" : `No hay citas ${filtroEstado}s`}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {filtroEstado === "todos" 
                ? "Cuando tus pacientes agenden citas, aparecerán aquí para que puedas gestionarlas."
                : `No se encontraron citas con estado "${filtroEstado}". Prueba con otro filtro.`
              }
            </p>
            {filtroEstado !== "todos" && (
              <button
                onClick={() => setFiltroEstado("todos")}
                className="bg-[#004B43] text-white px-6 py-3 rounded-xl hover:bg-[#00382f] transition-colors font-semibold"
              >
                Ver todas las citas
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Fecha y Hora
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Motivo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Estado Actual
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Cambiar Estado
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Notas
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {citasFiltradas.map((cita) => (
                    <tr key={cita.id} className="hover:bg-gray-50 transition-colors duration-300">
                      <td className="px-6 py-4">
                        <div className="text-gray-800 font-medium">
                          {new Date(cita.fecha_cita).toLocaleDateString("es-BO", {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {new Date(cita.fecha_cita).toLocaleTimeString("es-BO", {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-800 font-semibold">
                          {cita.Paciente
                            ? `${cita.Paciente.nombre} ${cita.Paciente.apellido}`
                            : "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-700 max-w-xs">
                          {cita.motivo || "Consulta general"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            cita.estado === "confirmada"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : cita.estado === "cancelada"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : cita.estado === "finalizada"
                              ? "bg-gray-100 text-gray-800 border border-gray-200"
                              : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          }`}
                        >
                          {cita.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {estadosDisponibles
                            .filter(estado => estado !== cita.estado)
                            .map((estado) => (
                              <button
                                key={estado}
                                onClick={() => cambiarEstadoCita(cita.id, estado)}
                                disabled={actualizando === cita.id}
                                className={`px-3 py-1 text-xs rounded-lg transition-all duration-300 capitalize border ${
                                  actualizando === cita.id
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:scale-105'
                                } ${
                                  estado === 'confirmada'
                                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                    : estado === 'cancelada'
                                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                    : estado === 'finalizada'
                                    ? 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                                }`}
                              >
                                {actualizando === cita.id ? '...' : estado}
                              </button>
                            ))
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-600 max-w-xs text-sm">
                          {cita.notas || "Sin notas adicionales"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Caja Nacional de Salud - Bolivia • Sistema Médico CNS
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Comprometidos con la excelencia en atención médica
          </p>
        </div>
      </footer>
    </div>
  );
}

// Componente de tarjeta de estadísticas
function StatCard({ titulo, valor, color, icono }: { 
  titulo: string; 
  valor: number; 
  color: string; 
  icono: React.ReactNode; 
}) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-4 text-white shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/90 text-sm font-medium">{titulo}</p>
          <p className="text-2xl font-bold">{valor}</p>
        </div>
        <div className="text-white">
          {icono}
        </div>
      </div>
    </div>
  );
}