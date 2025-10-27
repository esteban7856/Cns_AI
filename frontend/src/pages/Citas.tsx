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
    <div className="min-h-screen bg-gradient-to-br from-[#004B43] to-[#00695C]">
      {/* Header */}
      <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-3 rounded-xl border border-white/30">
              <span className="text-2xl">📅</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Gestión de Citas Médicas</h1>
              <p className="text-white/80 text-sm">Administra y actualiza el estado de las citas</p>
            </div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20">
            <p className="text-sm text-white/80">Total de citas</p>
            <p className="text-2xl font-bold text-white">{estadisticas.total}</p>
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
            icono="📋"
          />
          <StatCard 
            titulo="Confirmadas" 
            valor={estadisticas.confirmadas} 
            color="from-green-500 to-green-600"
            icono="✅"
          />
          <StatCard 
            titulo="Pendientes" 
            valor={estadisticas.pendientes} 
            color="from-yellow-500 to-yellow-600"
            icono="⏳"
          />
          <StatCard 
            titulo="Canceladas" 
            valor={estadisticas.canceladas} 
            color="from-red-500 to-red-600"
            icono="❌"
          />
          <StatCard 
            titulo="Finalizadas" 
            valor={estadisticas.finalizadas} 
            color="from-gray-500 to-gray-600"
            icono="🏁"
          />
        </div>

        {/* Filtros */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Filtrar por estado</h2>
              <p className="text-white/80 text-sm">Visualiza las citas según su estado actual</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["todos", "pendiente", "confirmada", "cancelada", "finalizada"].map((estado) => (
                <button
                  key={estado}
                  onClick={() => setFiltroEstado(estado)}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 capitalize ${
                    filtroEstado === estado
                      ? "bg-white text-[#004B43] font-semibold"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
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
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
              <p className="text-white text-lg">Cargando citas médicas...</p>
              <p className="text-white/70 text-sm">Estamos obteniendo la información más reciente</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-white mb-2">Error al cargar las citas</h3>
            <p className="text-white/80">{error}</p>
            <button 
              onClick={cargarCitas}
              className="mt-4 bg-white text-[#004B43] px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
            >
              Reintentar
            </button>
          </div>
        ) : citasFiltradas.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20">
            <div className="text-8xl mb-6">📅</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {filtroEstado === "todos" ? "No hay citas registradas" : `No hay citas ${filtroEstado}s`}
            </h3>
            <p className="text-white/80 max-w-md mx-auto mb-6">
              {filtroEstado === "todos" 
                ? "Cuando tus pacientes agenden citas, aparecerán aquí para que puedas gestionarlas."
                : `No se encontraron citas con estado "${filtroEstado}". Prueba con otro filtro.`
              }
            </p>
            {filtroEstado !== "todos" && (
              <button
                onClick={() => setFiltroEstado("todos")}
                className="bg-white text-[#004B43] px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
              >
                Ver todas las citas
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-white/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Fecha y Hora
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Motivo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Estado Actual
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Cambiar Estado
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Notas
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {citasFiltradas.map((cita) => (
                    <tr key={cita.id} className="hover:bg-white/10 transition-colors duration-300">
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">
                          {new Date(cita.fecha_cita).toLocaleDateString("es-BO", {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-white/70 text-sm">
                          {new Date(cita.fecha_cita).toLocaleTimeString("es-BO", {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-semibold">
                          {cita.Paciente
                            ? `${cita.Paciente.nombre} ${cita.Paciente.apellido}`
                            : "—"}
                        </div>
                       
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white max-w-xs">
                          {cita.motivo || "Consulta general"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            cita.estado === "confirmada"
                              ? "bg-green-500/20 text-green-200 border border-green-500/30"
                              : cita.estado === "cancelada"
                              ? "bg-red-500/20 text-red-200 border border-red-500/30"
                              : cita.estado === "finalizada"
                              ? "bg-gray-500/20 text-gray-200 border border-gray-500/30"
                              : "bg-yellow-500/20 text-yellow-200 border border-yellow-500/30"
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
                                    ? 'bg-green-500/20 text-green-200 border-green-500/30 hover:bg-green-500/30'
                                    : estado === 'cancelada'
                                    ? 'bg-red-500/20 text-red-200 border-red-500/30 hover:bg-red-500/30'
                                    : estado === 'finalizada'
                                    ? 'bg-gray-500/20 text-gray-200 border-gray-500/30 hover:bg-gray-500/30'
                                    : 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30 hover:bg-yellow-500/30'
                                }`}
                              >
                                {actualizando === cita.id ? '...' : estado}
                              </button>
                            ))
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white/80 max-w-xs text-sm">
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
      <footer className="bg-white/10 backdrop-blur-sm border-t border-white/20 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/80 text-sm">
            © {new Date().getFullYear()} Caja Nacional de Salud - Bolivia • Sistema Médico CNS
          </p>
          <p className="text-white/60 text-xs mt-1">
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
  icono: string; 
}) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-4 text-white shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{titulo}</p>
          <p className="text-2xl font-bold">{valor}</p>
        </div>
        <div className="text-2xl">
          {icono}
        </div>
      </div>
    </div>
  );
}