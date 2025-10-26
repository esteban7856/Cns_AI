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
      {/* Header */}
      <nav className="bg-cns-blue shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center text-white">
          <h1 className="text-xl font-bold">CNS - Sistema Médico</h1>
          <div className="flex items-center space-x-3">
            <span>👨‍⚕️ {user.nombre} {user.apellido}</span>
            <span className="bg-cns-blue-light text-white px-2 py-1 rounded text-xs uppercase">
              {user.rol}
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-cns-blue px-3 py-1 rounded hover:bg-gray-100 text-sm"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <main className="flex-grow max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-cns-blue-dark mb-6">
          Panel del Médico
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Estadísticas */}
          <DashboardCard
            title="📊 Estadísticas"
            description="Visualiza los casos registrados y el seguimiento de enfermedades respiratorias."
            color="from-cns-blue to-cns-blue-light"
            onClick={() => navigate("/estadisticas")}
          />

          {/* Horarios */}
          <DashboardCard
            title="🕒 Horarios"
            description="Configura tus horarios disponibles para atender citas médicas."
            color="from-green-600 to-green-400"
            onClick={() => navigate("/horarios")}
          />

          {/* Citas */}
          <DashboardCard
            title="📅 Citas"
            description="Consulta las citas programadas con tus pacientes."
            color="from-yellow-500 to-yellow-400"
            onClick={() => navigate("/citas")}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-cns-blue-dark py-4 mt-8">
        <div className="text-center text-white text-sm">
          © {new Date().getFullYear()} Caja Nacional de Salud - Bolivia • Sistema Médico CNS
        </div>
      </footer>
    </div>
  );
}

interface CardProps {
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

const DashboardCard: React.FC<CardProps> = ({ title, description, color, onClick }) => {

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-gradient-to-b ${color} rounded-xl shadow-lg p-6 text-white hover:scale-105 transition-transform`}
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm opacity-90">{description}</p>
    </div>
  );
}
export default Dashboard;