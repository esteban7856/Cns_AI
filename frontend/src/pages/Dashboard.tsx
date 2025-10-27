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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      {/* Header Mejorado */}
      <nav className="bg-gradient-to-r from-[#004B43] to-[#00695C] shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <span className="text-2xl">🏥</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">CNS Salud Infantil</h1>
              <p className="text-blue-100 text-sm">Sistema Médico Integral</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-semibold">Dr. {user.nombre} {user.apellido}</p>
              <p className="text-blue-100 text-sm">Bienvenido al sistema</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
              <span className="text-sm font-medium capitalize">{user.rol}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-300 border border-white/30 backdrop-blur-sm flex items-center space-x-2"
            >
              <span>🚪</span>
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
              <p className="text-blue-100 text-lg max-w-2xl">
                Estamos comprometidos con la salud materno infantil. 
                Aquí puedes gestionar tus pacientes, citas y estadísticas de manera eficiente.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <p className="font-semibold">Sistema Actualizado</p>
                <p className="text-blue-100 text-sm">Versión 2.1</p>
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
            color="from-blue-500 to-blue-600"
            icon="📈"
            onClick={() => navigate("/estadisticas")}
          />

          <DashboardCard
            title="🕒 Gestión de Horarios"
            description="Organiza y configura tus horarios de atención para una mejor planificación de consultas."
            color="from-green-500 to-green-600"
            icon="⏰"
            onClick={() => navigate("/horarios")}
          />

          <DashboardCard
            title="📅 Agenda de Citas"
            description="Consulta y gestiona todas las citas programadas con tus pacientes de manera organizada."
            color="from-purple-500 to-purple-600"
            icon="👥"
            onClick={() => navigate("/citas")}
          />
        </div>

        {/* Sección de Acciones Rápidas */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="bg-gradient-to-r from-[#004B43] to-[#00695C] text-white p-2 rounded-lg mr-3">⚡</span>
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction 
              icon="👶" 
              label="Nuevo Paciente" 
              onClick={() => navigate("/nuevo-paciente")}
            />
            <QuickAction 
              icon="📝" 
              label="Registrar Consulta" 
              onClick={() => navigate("/nueva-consulta")}
            />
            <QuickAction 
              icon="🔍" 
              label="Buscar Paciente" 
              onClick={() => navigate("/buscar-paciente")}
            />
            <QuickAction 
              icon="📋" 
              label="Reportes Médicos" 
              onClick={() => navigate("/reportes")}
            />
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Pacientes Activos" 
            value="124" 
            change="+12%" 
            icon="👨‍👩‍👧‍👦"
            color="text-blue-600"
          />
          <StatCard 
            title="Citas Hoy" 
            value="8" 
            change="+2" 
            icon="📅"
            color="text-green-600"
          />
          <StatCard 
            title="Consultas Mes" 
            value="45" 
            change="+15%" 
            icon="🏥"
            color="text-purple-600"
          />
          <StatCard 
            title="Satisfacción" 
            value="96%" 
            change="+3%" 
            icon="⭐"
            color="text-yellow-600"
          />
        </div>
      </main>

      {/* Footer Mejorado */}
      <footer className="bg-gradient-to-r from-[#004B43] to-[#00695C] py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-white">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <span className="text-2xl">❤️</span>
              <div>
                <p className="font-semibold">Caja Nacional de Salud - Bolivia</p>
                <p className="text-blue-100 text-sm">Comprometidos con tu salud</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-blue-100">© {new Date().getFullYear()} Sistema Médico CNS</p>
              <p className="text-blue-200 text-sm">Versión 2.1 • Todos los derechos reservados</p>
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
        <p className="text-blue-100 text-sm leading-relaxed">{description}</p>
        <div className="mt-4 flex items-center text-blue-200 group-hover:text-white transition-colors">
          <span className="text-sm font-medium">Acceder</span>
          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  icon: string;
  label: string;
  onClick: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-gray-50 hover:bg-white border border-gray-200 rounded-xl p-4 text-center transition-all duration-300 hover:shadow-md hover:border-[#004B43] group"
    >
      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
      <p className="text-gray-700 font-medium text-sm group-hover:text-[#004B43]">{label}</p>
    </button>
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
  const isPositive = change.includes('+');
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`text-2xl ${color}`}>{icon}</div>
        <span className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'} bg-${isPositive ? 'green' : 'red'}-50 px-2 py-1 rounded-full`}>
          {change}
        </span>
      </div>
      <h4 className="text-gray-600 text-sm font-medium mb-2">{title}</h4>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

export default Dashboard;