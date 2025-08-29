import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import { useApiState } from '../../../../shared/infrastructure/hooks/useApiState';
import { useAuth } from '../hooks/useAuth';

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
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState<RegisterData>({
    nombreCompleto: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { loading, error, execute } = useApiState();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await execute(async () => {
      const user = await login({
        email: loginData.email,
        password: loginData.password
      });
      alert(`¡Bienvenido ${user.nombreCompleto}!`);
      navigate('/businesses');
      return user;
    });
    
    if (result) {
      console.log('✅ [FRONTEND] Login completado:', result);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    const result = await execute(async () => {
      const user = await register({
        nombreCompleto: registerData.nombreCompleto,
        email: registerData.email,
        password: registerData.password
      });
      alert(`¡Usuario registrado exitosamente! Bienvenido ${user.nombreCompleto}`);
      // Cambiar a modo login después del registro exitoso
      setIsLoginMode(true);
      setRegisterData({
        nombreCompleto: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      return user;
    });
    
    if (result) {
      console.log('✅ [FRONTEND] Registro completado:', result);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (isLoginMode) {
      setLoginData(prev => ({ ...prev, [field]: value }));
    } else {
      setRegisterData(prev => ({ ...prev, [field]: value }));
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setLoginData({ email: '', password: '' });
    setRegisterData({
      nombreCompleto: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="bg-white rounded-brand shadow-brand-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">
            {isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}
          </h1>
          <p className="text-neutral-600">
            {isLoginMode 
              ? 'Accede a tu cuenta para continuar' 
              : 'Crea tu cuenta para comenzar'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={isLoginMode ? handleLogin : handleRegister} className="space-y-6">
          {/* Nombre completo (solo en registro) */}
          {!isLoginMode && (
            <div>
              <label htmlFor="nombreCompleto" className="block text-sm font-medium text-neutral-700 mb-2">
                Nombre Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  id="nombreCompleto"
                  value={registerData.nombreCompleto}
                  onChange={(e) => handleInputChange('nombreCompleto', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-brand focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ingresa tu nombre completo"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="email"
                id="email"
                value={isLoginMode ? loginData.email : registerData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-brand focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={isLoginMode ? loginData.password : registerData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-brand focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={isLoginMode ? "Ingresa tu contraseña" : "Mínimo 6 caracteres"}
                required
                minLength={isLoginMode ? undefined : 6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-neutral-400" />
                ) : (
                  <FaEye className="h-5 w-5 text-neutral-400" />
                )}
              </button>
            </div>
          </div>

          {/* Confirmar Contraseña (solo en registro) */}
          {!isLoginMode && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-brand focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Confirma tu contraseña"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-neutral-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-neutral-400" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-bold py-3 px-4 rounded-brand transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : isLoginMode ? (
              <>
                <FaUser />
                Iniciar Sesión
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
            className="text-primary-500 hover:text-primary-600 font-medium underline"
          >
            {isLoginMode 
              ? '¿No tienes cuenta? Regístrate aquí' 
              : '¿Ya tienes cuenta? Inicia sesión aquí'
            }
          </button>
        </div>

        {/* Datos de prueba */}
        {isLoginMode && (
          <div className="mt-6 p-4 bg-neutral-50 rounded-brand">
            <h3 className="text-sm font-medium text-neutral-700 mb-2">Datos de Prueba:</h3>
            <div className="text-xs text-neutral-600 space-y-1">
              <p><strong>Email:</strong> maria@ejemplo.com</p>
              <p><strong>Contraseña:</strong> 123456</p>
              <p className="text-neutral-500 mt-2">También puedes usar: carlos@ejemplo.com o ana@ejemplo.com</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-brand">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
