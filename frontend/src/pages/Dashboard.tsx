import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.primerIngreso) {
      navigate("/cambiar-password");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header CNS */}
      <nav className="bg-cns-blue shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-cns-blue font-bold text-sm">CNS</span>
              </div>
              <h1 className="text-white text-lg font-bold">CNS - Sistema Médico</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">Bienvenido, Dr. {user.email.split('@')[0]}</span>
              <span className="bg-cns-blue-light text-white px-3 py-1 rounded text-xs">
                {user.rol.toUpperCase()}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-cns-blue px-4 py-2 rounded text-sm hover:bg-gray-100"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-cns-blue">
              <h3 className="text-lg font-semibold text-cns-blue-dark mb-2">Pacientes del día</h3>
              <p className="text-3xl font-bold text-cns-blue">24</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-cns-blue-light">
              <h3 className="text-lg font-semibold text-cns-blue-dark mb-2">Citas pendientes</h3>
              <p className="text-3xl font-bold text-cns-blue">8</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-cns-blue-dark mb-2">Disponibilidad</h3>
              <p className="text-3xl font-bold text-green-600">65%</p>
            </div>
          </div>

          {/* Área principal */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-cns-blue-dark mb-4">
              Panel de Control - CNS
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-cns-blue">Accesos Rápidos</h3>
                <ul className="mt-2 space-y-2">
                  <li className="text-cns-blue-light hover:text-cns-blue cursor-pointer">• Gestión de Citas</li>
                  <li className="text-cns-blue-light hover:text-cns-blue cursor-pointer">• Historias Clínicas</li>
                  <li className="text-cns-blue-light hover:text-cns-blue cursor-pointer">• Reportes Médicos</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-cns-blue">Información de Usuario</h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>📧 Email: {user.email}</p>
                  <p>👤 Rol: {user.rol}</p>
                  <p>🏥 Sistema: Caja Nacional de Salud</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CNS */}
      <footer className="bg-cns-blue-dark mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-white text-sm">
          © {new Date().getFullYear()} Caja Nacional de Salud - Bolivia • 
          Sistema de Gestión Médica • Versión 1.0
        </div>
      </footer>
    </div>
  );
}