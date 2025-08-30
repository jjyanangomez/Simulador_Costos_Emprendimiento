import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import { useApiState } from "../../../../shared/infrastructure/hooks/useApiState";
import { useAuth } from "../hooks/useAuth";
import { FloatingNotification } from "../../../../shared/infrastructure/ui/FloatingNotification";

interface ResetPasswordData {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [resetData, setResetData] = useState<ResetPasswordData>({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { loading, error, execute } = useApiState();

  const addNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Remover la notificación después de 5 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (resetData.newPassword !== resetData.confirmPassword) {
      addNotification("Las contraseñas no coinciden", "error");
      return;
    }

    if (resetData.newPassword.length < 6) {
      addNotification("La contraseña debe tener al menos 6 caracteres", "error");
      return;
    }

    const result = await execute(async () => {
      const data = await resetPassword({
        email: resetData.email,
        newPassword: resetData.newPassword,
        confirmPassword: resetData.confirmPassword,
      });
      return data;
    });

    if (result) {
      addNotification("¡Contraseña actualizada exitosamente! Ahora puedes iniciar sesión con tu nueva contraseña.", "success");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setResetData((prev) => ({ ...prev, [field]: value }));
  };

  const goBackToLogin = () => {
    navigate("/login");
  };

  // Mostrar notificaciones de error del useApiState
  useEffect(() => {
    if (error && !notifications.some(n => n.message === error)) {
      addNotification(error, 'error');
    }
  }, [error, notifications]);

  return (
    <>
      {/* Notificaciones flotantes */}
      {notifications.map(notification => (
        <FloatingNotification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

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
              
                <h1 className="text-3x1 lg:text-5xl font-bold leading-tight mb-4">
                  <div>Descubre tus costos</div>
                  <div>Ingresando</div>
                </h1>
                <p className="text-gray-100 text-lg opacity-90">
                  Ingresa tu correo electrónico y establece una nueva contraseña para recuperar el acceso a tu cuenta.
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
                  RECUPERAR CONTRASEÑA
                </h2>
                <p className="text-gray-600">
                  Establece una nueva contraseña para tu cuenta
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleResetPassword} className="space-y-6">
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
                      value={resetData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="ejemplo@correo.com"
                      required
                    />
                  </div>
                </div>

                {/* Nueva Contraseña */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-blue-400" />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      value={resetData.newPassword}
                      onChange={(e) => handleInputChange("newPassword", e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Mínimo 6 caracteres"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-blue-400" />
                      ) : (
                        <FaEye className="h-5 w-5 text-blue-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirmar Nueva Contraseña */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-blue-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={resetData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Confirma tu nueva contraseña"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-blue-400" />
                      ) : (
                        <FaEye className="h-5 w-5 text-blue-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Botón de envío */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-gray-600 hover:from-blue-700 hover:to-gray-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <FaLock />
                      Cambiar Contraseña
                    </>
                  )}
                </button>
              </form>

              {/* Botón para volver al login */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={goBackToLogin}
                  className="text-blue-600 hover:text-blue-700 font-medium underline transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
                >
                  <FaArrowLeft />
                  Volver al Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
