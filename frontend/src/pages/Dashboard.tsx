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
    <div className="min-h-screen bg-gradient-to-br from-[#004B43] to-[#00695C] flex flex-col">
      {/* Header Mejorado */}
      <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-3 rounded-xl border border-white/30">
              <span className="text-2xl">🏥</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">CNS Salud Infantil</h1>
              <p className="text-white/80 text-sm">Sistema Médico Integral</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-semibold">Dr. {user.nombre} {user.apellido}</p>
              <p className="text-white/80 text-sm">Bienvenido al sistema</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
              <span className="text-sm font-medium capitalize">{user.rol}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-300 border border-white/30 backdrop-blur-sm flex items-center space-x-2"
            >
              <span></span>
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
                ¡Bienvenido, Dr. {user.nombre}! 👨‍⚕️
              </h2>
              <p className="text-white/80 text-lg max-w-2xl">
                Estamos comprometidos con la salud materno infantil. 
                Aquí puedes gestionar tus pacientes, citas y estadísticas de manera eficiente.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <p className="font-semibold">Sistema Actualizado</p>
                <p className="text-white/80 text-sm">Versión 2.1</p>
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
            title="📊 Panel de Estadísticas"
            description="Monitorea los casos de enfermedades respiratorias y el progreso de tus pacientes con gráficos interactivos."
            color="from-green-600 to-green-700"
            icon="📈"
            onClick={() => navigate("/estadisticas")}
          />

          <DashboardCard
            title="🕒 Gestión de Horarios"
            description="Organiza y configura tus horarios de atención para una mejor planificación de consultas."
            color="from-emerald-600 to-emerald-700"
            icon="⏰"
            onClick={() => navigate("/horarios")}
          />

          <DashboardCard
            title="📅 Agenda de Citas"
            description="Consulta y gestiona todas las citas programadas con tus pacientes de manera organizada."
            color="from-teal-600 to-teal-700"
            icon="👥"
            onClick={() => navigate("/citas")}
          />
        </div>

        {/* Sección de Información CNS */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="bg-white/20 p-2 rounded-lg mr-3">🏛️</span>
            Sobre la Caja Nacional de Salud
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoCard 
              icon="📅"
              title="Fundación"
              description="15 de abril de 1987"
              detail="Más de 36 años de servicio"
            />
            <InfoCard 
              icon="👥"
              title="Cobertura"
              description="Trabajadores y familias"
              detail="Atención a nivel nacional"
            />
            <InfoCard 
              icon="🩺"
              title="Prestaciones"
              description="Salud integral"
              detail="Riesgo común, profesional y maternidad"
            />
            <InfoCard 
              icon="🎯"
              title="Misión"
              description="Protección social"
              detail="Cuidando el capital humano de Bolivia"
            />
          </div>
          
          {/* Línea de tiempo histórica */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <h4 className="text-lg font-semibold text-white mb-4">Nuestra Historia</h4>
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
            icon="🎂"
            color="text-green-300"
          />
          <StatCard 
            title="Afiliados" 
            value="2M+" 
            change="Cobertura nacional" 
            icon="👨‍👩‍👧‍👦"
            color="text-emerald-300"
          />
          <StatCard 
            title="Unidades Médicas" 
            value="150+" 
            change="En todo el país" 
            icon="🏥"
            color="text-teal-300"
          />
          <StatCard 
            title="Profesionales" 
            value="5,000+" 
            change="Equipo médico" 
            icon="👨‍⚕️"
            color="text-cyan-300"
          />
        </div>

        {/* Compromisos y Valores */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="bg-white/20 p-2 rounded-lg mr-3">⭐</span>
            Nuestros Compromisos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CommitmentCard 
              icon="❤️"
              title="Calidad en Atención"
              description="Brindamos servicios médicos con los más altos estándares de calidad y calidez humana."
            />
            <CommitmentCard 
              icon="🛡️"
              title="Protección Social"
              description="Garantizamos la seguridad social integral para todos nuestros afiliados y sus familias."
            />
            <CommitmentCard 
              icon="🌱"
              title="Innovación Continua"
              description="Implementamos tecnologías modernas para mejorar la experiencia de nuestros usuarios."
            />
            <CommitmentCard 
              icon="🤝"
              title="Trabajo en Equipo"
              description="Fomentamos la colaboración entre profesionales para una atención integral al paciente."
            />
          </div>
        </div>
      </main>

      {/* Footer Mejorado */}
      <footer className="bg-white/10 backdrop-blur-sm border-t border-white/20 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-white">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <span className="text-2xl">🇧🇴</span>
              <div>
                <p className="font-semibold">Caja Nacional de Salud - Bolivia</p>
                <p className="text-white/80 text-sm">"Protegiendo tu salud desde 1956"</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-white/80">© {new Date().getFullYear()} Sistema Médico CNS</p>
              <p className="text-white/60 text-sm">Versión 2.1 • Todos los derechos reservados</p>
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
  icon: string;
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
        <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-white/90 text-sm leading-relaxed">{description}</p>
        <div className="mt-4 flex items-center text-white/80 group-hover:text-white transition-colors">
          <span className="text-sm font-medium">Acceder</span>
          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </div>
  );
}

interface InfoCardProps {
  icon: string;
  title: string;
  description: string;
  detail: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, description, detail }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors">
      <div className="text-2xl mb-2">{icon}</div>
      <h4 className="font-semibold text-white mb-1">{title}</h4>
      <p className="text-white font-medium text-sm">{description}</p>
      <p className="text-white/70 text-xs mt-1">{detail}</p>
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
      <div className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold min-w-16 text-center">
        {year}
      </div>
      <div>
        <h5 className="font-semibold text-white text-sm">{title}</h5>
        <p className="text-white/70 text-xs">{description}</p>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className={`text-3xl ${color}`}>{icon}</div>
      </div>
      <h4 className="text-white/80 text-sm font-medium mb-2">{title}</h4>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-white/60 text-sm">{change}</p>
    </div>
  );
}

interface CommitmentCardProps {
  icon: string;
  title: string;
  description: string;
}

const CommitmentCard: React.FC<CommitmentCardProps> = ({ icon, title, description }) => {
  return (
    <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl border border-white/10">
      <div className="text-2xl flex-shrink-0">{icon}</div>
      <div>
        <h4 className="font-semibold text-white mb-2">{title}</h4>
        <p className="text-white/80 text-sm">{description}</p>
      </div>
    </div>
  );
}

export default Dashboard;