import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cambiarPasswordPrimeraVez } from "../services/authService";
import logoCNS from "../assets/logo-cns.png";

export default function ChangePassword() {
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validaciones
    if (nuevaContraseña.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (nuevaContraseña !== confirmarContraseña) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      // Llamada a la API para cambiar la contraseña
      const response = await cambiarPasswordPrimeraVez(nuevaContraseña);
      
      // Verificar si es recuperación de contraseña (sin usuario en localStorage)
      const currentUser = localStorage.getItem("user");
      if (!currentUser) {
        // Si no hay usuario en localStorage, es recuperación de contraseña
        // Hacer login automático o redirigir a login
        alert("Contraseña actualizada exitosamente. Por favor inicia sesión.");
        navigate("/login");
        return;
      }

      // Si hay usuario en localStorage, actualizarlo
      const user = JSON.parse(currentUser);
      localStorage.setItem("user", JSON.stringify({
        ...user,
        primerIngreso: false
      }));

      alert("Contraseña cambiada exitosamente");
      navigate("/dashboard");

    } catch (err: any) {
      setError(err.message || "Error al cambiar contraseña");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
      {/* Header con colores CNS */}
      <div className="absolute top-0 w-full bg-[#004b44] py-3 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={logoCNS} alt="Logo CNS" className="w-10 h-10 mr-3" />
              <h1 className="text-white text-xl font-bold">Caja Nacional de Salud</h1>
            </div>
            <span className="text-[#5c8884] text-sm">Seguridad del Sistema</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-[#316963] mt-16">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img src={logoCNS} alt="Logo CNS" className="w-16 h-16" />
          </div>
          <h2 className="text-2xl font-bold text-[#004b44] mb-2">
            Cambio de Contraseña
          </h2>
          <p className="text-[#5c8884]">
            Primer ingreso. Establezca una nueva contraseña segura.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#002f26] text-sm font-bold mb-2">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={nuevaContraseña}
              onChange={(e) => setNuevaContraseña(e.target.value)}
              className="w-full p-3 border border-[#5c8884] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#316963] focus:border-[#316963]"
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
            <p className="text-xs text-[#5c8884] mt-1">
              La contraseña debe contener al menos 6 caracteres.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-[#002f26] text-sm font-bold mb-2">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              value={confirmarContraseña}
              onChange={(e) => setConfirmarContraseña(e.target.value)}
              className="w-full p-3 border border-[#5c8884] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#316963] focus:border-[#316963]"
              placeholder="Repita la contraseña"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#004b44] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#002f26] transition duration-200 disabled:bg-[#5c8884] disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? "Actualizando contraseña..." : "Establecer Contraseña"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="text-[#316963] hover:text-[#004b44] text-sm hover:underline"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#5c8884]">
          <p className="text-xs text-[#5c8884] text-center">
            © {new Date().getFullYear()} Caja Nacional de Salud - Bolivia<br />
            Sistema de Gestión Médica • Versión 1.0
          </p>
        </div>
      </div>
    </div>
  );
}