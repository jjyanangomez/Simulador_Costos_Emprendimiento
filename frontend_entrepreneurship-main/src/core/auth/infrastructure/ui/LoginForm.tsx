import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserPlus,
} from "react-icons/fa";
import { useApiState } from "../../../../shared/infrastructure/hooks/useApiState";
import { useAuth } from "../hooks/useAuth";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  nombreCompleto: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function LoginForm() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState<RegisterData>({
    nombreCompleto: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { loading, error, execute } = useApiState();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await execute(async () => {
      const user = await login({
        email: loginData.email,
        password: loginData.password,
      });
      alert(`¡Bienvenido ${user.nombreCompleto}!`);
      navigate("/businesses");
      return user;
    });

    if (result) {
      console.log("✅ [FRONTEND] Login completado:", result);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const result = await execute(async () => {
      const user = await register({
        nombreCompleto: registerData.nombreCompleto,
        email: registerData.email,
        password: registerData.password,
      });
      alert(
        `¡Usuario registrado exitosamente! Bienvenido ${user.nombreCompleto}`
      );
      // Cambiar a modo login después del registro exitoso
      setIsLoginMode(true);
      setRegisterData({
        nombreCompleto: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      return user;
    });

    if (result) {
      console.log("✅ [FRONTEND] Registro completado:", result);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (isLoginMode) {
      setLoginData((prev) => ({ ...prev, [field]: value }));
    } else {
      setRegisterData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setLoginData({ email: "", password: "" });
    setRegisterData({
      nombreCompleto: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-gray-700 to-blue-800 p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Círculos decorativos */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gray-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-gray-300 rounded-full opacity-25 animate-ping"></div>
        <div className="absolute bottom-1/3 right-10 w-20 h-20 bg-blue-300 rounded-full opacity-20 animate-pulse"></div>

        {/* Líneas onduladas */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-10 transform -skew-y-6"></div>
        <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-l from-transparent via-blue-200 to-transparent opacity-10 transform skew-y-6"></div>
      </div>

      <div className="relative z-10 flex w-full max-w-6xl">
        {/* Sección izquierda - Información */}
        <div className="hidden lg:flex lg:w-2/3 items-center justify-center p-8">
          <div className="text-white max-w-md">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-blue-500 rounded-full flex items-center justify-center mb-6">
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
              <p className="text-gray-200 text-sm font-medium tracking-wider uppercase mb-4">
                SHOWCASE
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Login Page Examples to Inspire Your Next Design
              </h1>
              <p className="text-gray-100 text-lg opacity-90">
                Descubre el poder de un diseño moderno y atractivo para tu
                experiencia de usuario
              </p>
            </div>
          </div>
        </div>

        {/* Sección derecha - Formulario */}
        <div className="w-full lg:w-1/3 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            {/* Elementos decorativos del formulario */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-gray-400 to-blue-500 rounded-full"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-blue-400 to-gray-500 rounded-full"></div>

            {/* Header del formulario */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {isLoginMode ? "LOGIN" : "REGISTER"}
              </h2>
              <p className="text-gray-600">
                {isLoginMode
                  ? "Accede a tu cuenta para continuar"
                  : "Crea tu cuenta para comenzar"}
              </p>
            </div>

            {/* Formulario */}
            <form
              onSubmit={isLoginMode ? handleLogin : handleRegister}
              className="space-y-6"
            >
              {/* Nombre completo (solo en registro) */}
              {!isLoginMode && (
                <div>
                  <label
                    htmlFor="nombreCompleto"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-blue-400" />
                    </div>
                    <input
                      type="text"
                      id="nombreCompleto"
                      value={registerData.nombreCompleto}
                      onChange={(e) =>
                        handleInputChange("nombreCompleto", e.target.value)
                      }
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Ingresa tu nombre completo"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={isLoginMode ? loginData.email : registerData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={
                      isLoginMode ? loginData.password : registerData.password
                    }
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder={
                      isLoginMode
                        ? "Ingresa tu contraseña"
                        : "Mínimo 6 caracteres"
                    }
                    required
                    minLength={isLoginMode ? undefined : 6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-blue-400" />
                    ) : (
                      <FaEye className="h-5 w-5 text-blue-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña (solo en registro) */}
              {!isLoginMode && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-blue-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Confirma tu contraseña"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-blue-400" />
                      ) : (
                        <FaEye className="h-5 w-5 text-blue-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-gray-600 hover:from-blue-700 hover:to-gray-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : isLoginMode ? (
                  <>
                    <FaUser />
                    Sign In
                  </>
                ) : (
                  <>
                    <FaUserPlus />
                    Registrarse
                  </>
                )}
              </button>
            </form>

            {/* Cambiar modo */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-600 hover:text-blue-700 font-medium underline transition-colors duration-200"
              >
                {isLoginMode
                  ? "¿No tienes cuenta? Regístrate aquí"
                  : "¿Ya tienes cuenta? Inicia sesión aquí"}
              </button>
            </div>

            {/* Datos de prueba */}
            {isLoginMode && (
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Datos de Prueba:
                </h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    <strong>Email:</strong> maria@ejemplo.com
                  </p>
                  <p>
                    <strong>Contraseña:</strong> 123456
                  </p>
                  <p className="text-gray-500 mt-2">
                    También puedes usar: carlos@ejemplo.com o ana@ejemplo.com
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
