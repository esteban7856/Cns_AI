import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import logoCNS from "../assets/logo-cns.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await forgotPassword(email.trim());
      setSuccess(res.mensaje || "Se ha enviado un código temporal a tu correo electrónico.");
    } catch (err: any) {
      setError(err.message || "Error al procesar la solicitud");
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
            <span className="text-[#5c8884] text-sm">Recuperación de Acceso</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-[#316963] mt-16">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img src={logoCNS} alt="Logo CNS" className="w-16 h-16" />
          </div>
          <h2 className="text-2xl font-bold text-[#004b44] mb-2">
            Recuperar Contraseña
          </h2>
          <p className="text-[#5c8884]">
            Sistema de recuperación de acceso
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-[#002f26] text-sm font-bold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-[#5c8884] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#316963] focus:border-[#316963]"
              placeholder="usuario@cns.gob.bo"
              required
            />
            <p className="text-xs text-[#5c8884] mt-2">
              Te enviaremos un código temporal para que puedas iniciar sesión.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#004b44] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#002f26] transition duration-200 disabled:bg-[#5c8884] disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? "Enviando código..." : "Enviar Código Temporal"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link 
            to="/login" 
            className="text-[#316963] hover:text-[#004b44] hover:underline text-sm"
          >
            ← Volver al inicio de sesión
          </Link>
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