import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import logoCNS from "../assets/logo-cns.png";

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    codigoMedico: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Limpiar datos antes de enviar
      const dataToSend = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        email: formData.email.trim(),
        codigoMedico: formData.codigoMedico.trim() || undefined
      };

      const res = await register(dataToSend);
      setSuccess(res.mensaje || "Registro exitoso. Revisa tu correo para la contraseña temporal.");
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err: any) {
      setError(err.message || "Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#00110e] to-[#00332d]">
      {/* Efectos de fondo minimalistas */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#004b44] opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#5c8884] opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#002f26] opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex w-full">
        {/* Panel izquierdo con información minimalista */}
        <div className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center mb-16">
              <img src={logoCNS} alt="Logo CNS" className="w-10 h-10 mr-3" />
              <h1 className="text-xl font-semibold">Caja Nacional de Salud</h1>
            </div>
            
            <div className="max-w-xs">
              <h2 className="text-3xl font-light mb-6 leading-tight">
                Acceso al sistema médico <span className="font-medium">más avanzado</span>
              </h2>
              
              <div className="space-y-6 mt-12">
                <div className="flex items-start">
                  <div className="bg-white/10 p-2 rounded-lg mr-4 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm">Proceso de validación seguro</span>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/10 p-2 rounded-lg mr-4 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm">Acceso rápido después de la validación</span>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/10 p-2 rounded-lg mr-4 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm">Credenciales protegidas</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} Caja Nacional de Salud - Bolivia
            </p>
          </div>
        </div>

        {/* Panel derecho con formulario - Estilo tarjeta flotante */}
        <div className="w-full lg:w-3/5 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-10">
              <div className="text-center mb-10">
                <div className="lg:hidden flex justify-center mb-6">
                  <img src={logoCNS} alt="Logo CNS" className="w-14 h-14" />
                </div>
                <h2 className="text-2xl font-light text-white mb-2">
                  Solicitar <span className="font-medium">acceso</span>
                </h2>
                <p className="text-white/60 text-sm">
                  Complete sus datos para solicitar acceso al sistema
                </p>
              </div>
              
              {error && (
                <div className="bg-red-400/10 border border-red-400/20 text-red-300 px-4 py-3 rounded-xl mb-6 flex items-center text-sm">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-400/10 border border-green-400/20 text-green-300 px-4 py-3 rounded-xl mb-6 flex items-center text-sm">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-white/70 text-xs font-medium mb-2 uppercase tracking-wide">
                      Nombre
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                        placeholder="Nombre"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-xs font-medium mb-2 uppercase tracking-wide">
                      Apellido
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                        placeholder="Apellido"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-xs font-medium mb-2 uppercase tracking-wide">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                      placeholder="correo@ejemplo.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-xs font-medium mb-2 uppercase tracking-wide">
                    Código Médico <span className="text-white/40 normal-case">(opcional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="codigoMedico"
                      value={formData.codigoMedico}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                      placeholder="Solo para personal médico"
                    />
                  </div>
                  <p className="text-white/40 text-xs mt-2">
                    Si es médico, ingrese el código especial proporcionado.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-[#002f26] py-3 px-4 rounded-xl font-medium hover:bg-white/90 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#002f26]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando solicitud...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Solicitar Acceso
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-8 pt-6 border-t border-white/10">
                <Link 
                  to="/login" 
                  className="text-white/60 hover:text-white text-sm inline-flex items-center transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  ¿Ya tienes cuenta? Inicia sesión
                </Link>
              </div>

              {/* Footer para móviles */}
              <div className="lg:hidden mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-white/40 text-center">
                  © {new Date().getFullYear()} Caja Nacional de Salud - Bolivia<br />
                  Sistema de Gestión Médica • Versión 1.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}