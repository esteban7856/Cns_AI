import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";
import React from "react";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) navigate("/login");
    else if (user.primerIngreso) navigate("/cambiar-password");
  }, [user, navigate]);

  const handleLogout = (): void => {
    logout();
    navigate("/login");
  };

  if (!user) return <></>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Mejorado */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-[#004B43] p-3 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">CNS Salud Infantil</h1>
              <p className="text-gray-600 text-sm">Sistema Médico Integral</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-semibold text-gray-800">Dr. {user.nombre} {user.apellido}</p>
              <p className="text-gray-600 text-sm">Bienvenido al sistema</p>
            </div>
            <div className="bg-green-50 px-3 py-1 rounded-full border border-green-200">
              <span className="text-sm font-medium text-green-700 capitalize">{user.rol}</span>
            </div>
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

      {/* Hero Section de Bienvenida */}
      <section className="bg-gradient-to-r from-[#004B43] to-[#00695C] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                ¡Bienvenido, Dr. {user.nombre}! 
              </h2>
              <p className="text-green-100 text-lg max-w-2xl">
                Estamos comprometidos con la salud materno infantil. 
                Aquí puedes gestionar tus pacientes, citas y estadísticas de manera eficiente.
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <div className="text-center">
                <svg className="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="font-semibold">Sistema Actualizado</p>
                <p className="text-green-100 text-sm">Versión 2.1</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-8 -mt-8">
        {/* Tarjetas de Acceso Rápido */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <DashboardCard
            title="Panel de Estadísticas"
            description="Monitorea los casos de enfermedades respiratorias y el progreso de tus pacientes con gráficos interactivos."
            color="from-green-600 to-green-700"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            onClick={() => navigate("/estadisticas")}
          />

          <DashboardCard
            title="Gestión de Horarios"
            description="Organiza y configura tus horarios de atención para una mejor planificación de consultas."
            color="from-emerald-600 to-emerald-700"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            onClick={() => navigate("/horarios")}
          />

          <DashboardCard
            title="Agenda de Citas"
            description="Consulta y gestiona todas las citas programadas con tus pacientes de manera organizada."
            color="from-teal-600 to-teal-700"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            onClick={() => navigate("/citas")}
          />
        </div>

        {/* Sección de Información CNS */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="bg-[#004B43] p-2 rounded-lg mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            Sobre la Caja Nacional de Salud
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoCard 
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              title="Fundación"
              description="15 de abril de 1987"
              detail="Más de 36 años de servicio"
            />
            <InfoCard 
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="Cobertura"
              description="Trabajadores y familias"
              detail="Atención a nivel nacional"
            />
            <InfoCard 
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              }
              title="Prestaciones"
              description="Salud integral"
              detail="Riesgo común, profesional y maternidad"
            />
            <InfoCard 
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Misión"
              description="Protección social"
              detail="Cuidando el capital humano de Bolivia"
            />
          </div>
          
          {/* Línea de tiempo histórica */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Nuestra Historia</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TimelineItem 
                year="1956"
                title="Inicio de actividades"
                description="Creación del Seguro de la CNSS"
              />
              <TimelineItem 
                year="1987"
                title="Nueva identidad"
                description="Cambio a Caja Nacional de Salud"
              />
              <TimelineItem 
                year="Actualidad"
                title="Expansión continua"
                description="+65 años protegiendo la salud"
              />
            </div>
          </div>
        </div>

        {/* Estadísticas Institucionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Años de Servicio" 
            value="65+" 
            change="Desde 1956" 
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 013 15.546V6.454C3 5.651 3.695 5 4.5 5c.524 0 1.046.151 1.5.454a2.704 2.704 0 013 0 2.704 2.704 0 003 0 2.704 2.704 0 013 0 2.704 2.704 0 003 0 2.704 2.704 0 013 0c.454-.303.976-.454 1.5-.454.805 0 1.5.65 1.5 1.454v9.092z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h2m4 0h2m-8 4h4" />
              </svg>
            }
            color="text-green-600"
          />
          <StatCard 
            title="Afiliados" 
            value="2M+" 
            change="Cobertura nacional" 
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            color="text-emerald-600"
          />
          <StatCard 
            title="Unidades Médicas" 
            value="150+" 
            change="En todo el país" 
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            color="text-teal-600"
          />
          <StatCard 
            title="Profesionales" 
            value="5,000+" 
            change="Equipo médico" 
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            color="text-cyan-600"
          />
        </div>

        {/* Compromisos y Valores */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="bg-[#004B43] p-2 rounded-lg mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            Nuestros Compromisos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CommitmentCard 
              icon={
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
              title="Calidad en Atención"
              description="Brindamos servicios médicos con los más altos estándares de calidad y calidez humana."
            />
            <CommitmentCard 
              icon={
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Protección Social"
              description="Garantizamos la seguridad social integral para todos nuestros afiliados y sus familias."
            />
            <CommitmentCard 
              icon={
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Innovación Continua"
              description="Implementamos tecnologías modernas para mejorar la experiencia de nuestros usuarios."
            />
            <CommitmentCard 
              icon={
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="Trabajo en Equipo"
              description="Fomentamos la colaboración entre profesionales para una atención integral al paciente."
            />
          </div>
        </div>
      </main>

      {/* Footer Mejorado */}
      <footer className="bg-gray-100 border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-[#004B43] rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Caja Nacional de Salud - Bolivia</p>
                <p className="text-gray-600 text-sm">"Protegiendo tu salud desde 1956"</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-600">© {new Date().getFullYear()} Sistema Médico CNS</p>
              <p className="text-gray-500 text-sm">Versión 2.1 • Todos los derechos reservados</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface CardProps {
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const DashboardCard: React.FC<CardProps> = ({ title, description, color, icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-gradient-to-br ${color} rounded-2xl shadow-xl p-6 text-white hover:scale-105 transition-all duration-300 hover:shadow-2xl group relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-6 -mt-6"></div>
      <div className="relative z-10">
        <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-white/90 text-sm leading-relaxed">{description}</p>
        <div className="mt-4 flex items-center text-white/80 group-hover:text-white transition-colors">
          <span className="text-sm font-medium">Acceder</span>
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  detail: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, description, detail }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-green-300 transition-colors">
      <div className="text-green-600 mb-2">{icon}</div>
      <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
      <p className="text-gray-700 font-medium text-sm">{description}</p>
      <p className="text-gray-500 text-xs mt-1">{detail}</p>
    </div>
  );
}

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ year, title, description }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="bg-[#004B43] text-white px-3 py-1 rounded-full text-sm font-semibold min-w-16 text-center">
        {year}
      </div>
      <div>
        <h5 className="font-semibold text-gray-800 text-sm">{title}</h5>
        <p className="text-gray-600 text-xs">{description}</p>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`${color}`}>{icon}</div>
      </div>
      <h4 className="text-gray-600 text-sm font-medium mb-2">{title}</h4>
      <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
      <p className="text-gray-500 text-sm">{change}</p>
    </div>
  );
}

interface CommitmentCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const CommitmentCard: React.FC<CommitmentCardProps> = ({ icon, title, description }) => {
  return (
    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}

export default Dashboard;