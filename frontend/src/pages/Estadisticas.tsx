import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";
import React from "react";

const Estadisticas: React.FC = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    console.log('Usuario actual:', user);
    console.log('Primer ingreso:', user?.primerIngreso);
    
    if (!user) {
      console.log('Redirigiendo a login - No hay usuario');
      navigate("/login");
    } else if (user.primerIngreso) {
      console.log('Redirigiendo a cambiar contraseña - Primer ingreso');
      navigate("/cambiar-password");
    }
  }, [user, navigate]);

  const handleLogout = (): void => {
    logout();
    navigate("/login");
  };

  // Datos de enfermedades respiratorias
  const datosEnfermedades = [
    { año: 2020, neumonia: 73, bronquitisAguda: 0, bronquiolitisAguda: 25 },
    { año: 2021, neumonia: 70, bronquitisAguda: 11, bronquiolitisAguda: 37 },
    { año: 2022, neumonia: 292, bronquitisAguda: 1, bronquiolitisAguda: 113 },
    { año: 2023, neumonia: 435, bronquitisAguda: 0, bronquiolitisAguda: 200 },
    { año: 2024, neumonia: 368, bronquitisAguda: 0, bronquiolitisAguda: 176 },
    { año: 2025, neumonia: 246, bronquitisAguda: 8, bronquiolitisAguda: 179 }
  ];

  // Cálculo de totales
  const totales = {
    neumonia: datosEnfermedades.reduce((sum, item) => sum + item.neumonia, 0),
    bronquitisAguda: datosEnfermedades.reduce((sum, item) => sum + item.bronquitisAguda, 0),
    bronquiolitisAguda: datosEnfermedades.reduce((sum, item) => sum + item.bronquiolitisAguda, 0),
    totalGeneral: datosEnfermedades.reduce((sum, item) => sum + item.neumonia + item.bronquitisAguda + item.bronquiolitisAguda, 0)
  };

  if (!user) return <></>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-[#004B43] p-3 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Estadísticas Respiratorias</h1>
              <p className="text-gray-600 text-sm">Monitoreo de enfermedades 2020-2025</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-semibold text-gray-800">Dr. {user.nombre} {user.apellido}</p>
              <p className="text-gray-600 text-sm">Panel de análisis</p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-all duration-300 border border-gray-300 hover:border-[#004B43] flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Inicio</span>
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#004B43] hover:bg-[#00382f] text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Salir</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#004B43] to-[#00695C] text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-3">
                Estadísticas Epidemiológicas 
              </h2>
              <p className="text-green-100 text-lg max-w-2xl">
                Análisis detallado de enfermedades respiratorias agudas en pacientes pediátricos
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30">
              <div className="text-center">
                <svg className="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="font-semibold">Período 2020-2025</p>
                <p className="text-green-100 text-sm">{totales.totalGeneral} casos totales</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-6">
        {/* Tarjetas de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <ResumenCard 
            titulo="Neumonía" 
            valor={totales.neumonia} 
            tendencia="+435% desde 2020"
            color="from-red-500 to-red-600"
            icono={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
            descripcion="Infección pulmonar grave"
          />
          <ResumenCard 
            titulo="Bronquiolitis Aguda" 
            valor={totales.bronquiolitisAguda} 
            tendencia="+616% desde 2020"
            color="from-orange-500 to-orange-600"
            icono={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            descripcion="Infección vías respiratorias bajas"
          />
          <ResumenCard 
            titulo="Bronquitis Aguda" 
            valor={totales.bronquitisAguda} 
            tendencia="Casos esporádicos"
            color="from-amber-500 to-amber-600"
            icono={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            descripcion="Inflamación bronquial"
          />
          <ResumenCard 
            titulo="Total General" 
            valor={totales.totalGeneral} 
            tendencia="+482% desde 2020"
            color="from-[#004B43] to-[#00695C]"
            icono={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            descripcion="Suma total de casos"
          />
        </div>

        {/* Gráfico de Evolución Anual */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Evolución Anual 2020-2025</h3>
              <p className="text-gray-600">Distribución de casos por enfermedad respiratoria</p>
            </div>
            <div className="flex space-x-4">
              <LeyendaItem color="red-500" texto="Neumonía" />
              <LeyendaItem color="orange-500" texto="Bronquiolitis" />
              <LeyendaItem color="amber-500" texto="Bronquitis" />
            </div>
          </div>

          <div className="space-y-4">
            {datosEnfermedades.map((año) => (
              <BarraAnual 
                key={año.año}
                año={año.año}
                neumonia={año.neumonia}
                bronquiolitis={año.bronquiolitisAguda}
                bronquitis={año.bronquitisAguda}
                total={año.neumonia + año.bronquiolitisAguda + año.bronquitisAguda}
              />
            ))}
          </div>
        </div>

        {/* Tabla Detallada */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Desglose Estadístico por Año</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-gray-700 font-semibold py-3 px-4">Año</th>
                  <th className="text-left text-gray-700 font-semibold py-3 px-4">Neumonía</th>
                  <th className="text-left text-gray-700 font-semibold py-3 px-4">Bronquiolitis Aguda</th>
                  <th className="text-left text-gray-700 font-semibold py-3 px-4">Bronquitis Aguda</th>
                  <th className="text-left text-gray-700 font-semibold py-3 px-4">Total Anual</th>
                  <th className="text-left text-gray-700 font-semibold py-3 px-4">Variación</th>
                </tr>
              </thead>
              <tbody>
                {datosEnfermedades.map((año, index) => {
                  const totalAño = año.neumonia + año.bronquiolitisAguda + año.bronquitisAguda;
                  const añoAnterior = index > 0 ? datosEnfermedades[index - 1] : null;
                  const variacion = añoAnterior 
                    ? ((totalAño - (añoAnterior.neumonia + añoAnterior.bronquiolitisAguda + añoAnterior.bronquitisAguda)) / (añoAnterior.neumonia + añoAnterior.bronquiolitisAguda + añoAnterior.bronquitisAguda)) * 100
                    : 0;
                  
                  return (
                    <tr key={año.año} className="border-b border-gray-100 hover:bg-[#004B43]/5 transition-colors">
                      <td className="py-3 px-4 text-gray-800 font-semibold">{año.año}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600 font-semibold">{año.neumonia}</span>
                          {año.neumonia > 100 && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Alta</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-orange-600 font-semibold">{año.bronquiolitisAguda}</span>
                          {año.bronquiolitisAguda > 100 && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Alta</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-amber-600 font-semibold">{año.bronquitisAguda}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-800 font-bold">{totalAño}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-semibold ${
                          variacion > 0 ? 'text-green-600' : variacion < 0 ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {variacion > 0 ? `+${variacion.toFixed(0)}%` : variacion < 0 ? `${variacion.toFixed(0)}%` : '0%'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Análisis e Interpretación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
            <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 text-[#004B43] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Hallazgos Estadísticos
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong className="text-gray-800">Pico Epidemiológico:</strong>
                  <p className="text-sm text-gray-600">2023 registró la mayor incidencia con 635 casos totales</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-orange-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <div>
                  <strong className="text-gray-800">Tendencia Creciente:</strong>
                  <p className="text-sm text-gray-600">Bronquiolitis muestra crecimiento constante (+616%)</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-amber-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <strong className="text-gray-800">Estacionalidad:</strong>
                  <p className="text-sm text-gray-600">Bronquitis aguda presenta casos mínimos y esporádicos</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <div>
                  <strong className="text-gray-800">Distribución:</strong>
                  <p className="text-sm text-gray-600">Neumonía representa el 58% del total de casos</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Interpretación Clínica
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-red-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <div>
                  <strong className="text-gray-800">Neumonía:</strong>
                  <p className="text-sm text-gray-600">Requiere fortalecer protocolos en temporadas altas</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-orange-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <div>
                  <strong className="text-gray-800">Bronquiolitis:</strong>
                  <p className="text-sm text-gray-600">Monitoreo continuo en población lactante</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <div>
                  <strong className="text-gray-800">Medicamentos:</strong>
                  <p className="text-sm text-gray-600">Optimizar inventario basado en tendencias</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <strong className="text-gray-800">Personal:</strong>
                  <p className="text-sm text-gray-600">Capacitación en manejo de infecciones respiratorias</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-[#004B43] rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm font-semibold">
              Caja Nacional de Salud - Departamento de Pediatría
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Componente de tarjeta de resumen
function ResumenCard({ titulo, valor, tendencia, color, icono, descripcion }: { 
  titulo: string; 
  valor: number; 
  tendencia: string; 
  color: string; 
  icono: React.ReactNode; 
  descripcion: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-white">{icono}</div>
      </div>
      <h3 className="text-lg font-semibold mb-1">{titulo}</h3>
      <p className="text-white/90 text-xs mb-3">{descripcion}</p>
      <p className="text-3xl font-bold mb-2">{valor.toLocaleString()}</p>
      <p className="text-white/90 text-sm">{tendencia}</p>
    </div>
  );
}

// Componente de barra anual
function BarraAnual({ año, neumonia, bronquiolitis, bronquitis, total }: { 
  año: number; 
  neumonia: number; 
  bronquiolitis: number; 
  bronquitis: number; 
  total: number; 
}) {
  const maxTotal = 435; // Máximo histórico (2023)
  
  return (
    <div className="flex items-center space-x-4">
      <div className="w-16 text-gray-700 font-semibold text-lg">{año}</div>
      <div className="flex-1 bg-gray-100 rounded-full h-10 overflow-hidden">
        <div className="flex h-full">
          <div 
            className="bg-red-500 transition-all duration-500 hover:bg-red-400"
            style={{ width: `${(neumonia / maxTotal) * 100}%` }}
            title={`Neumonía: ${neumonia} casos`}
          ></div>
          <div 
            className="bg-orange-500 transition-all duration-500 hover:bg-orange-400"
            style={{ width: `${(bronquiolitis / maxTotal) * 100}%` }}
            title={`Bronquiolitis: ${bronquiolitis} casos`}
          ></div>
          <div 
            className="bg-amber-500 transition-all duration-500 hover:bg-amber-400"
            style={{ width: `${(bronquitis / maxTotal) * 100}%` }}
            title={`Bronquitis: ${bronquitis} casos`}
          ></div>
        </div>
      </div>
      <div className="w-24 text-right">
        <span className="text-gray-800 font-bold text-lg">{total}</span>
        <span className="text-gray-500 text-sm block">casos</span>
      </div>
    </div>
  );
}

// Componente de leyenda
function LeyendaItem({ color, texto }: { color: string; texto: string }) {
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-4 h-4 bg-${color} rounded`}></div>
      <span className="text-gray-700 text-sm">{texto}</span>
    </div>
  );
}

export default Estadisticas;