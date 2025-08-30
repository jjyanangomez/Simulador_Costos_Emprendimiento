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

  // Renderizado condicional basado en el modo
  if (isLoginMode) {
    // Mantener el diseño original para login
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
        <div className="bg-white rounded-brand shadow-brand-lg p-8 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-neutral-600">
              Accede a tu cuenta para continuar
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
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
                  value={loginData.email}
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
                  value={loginData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-brand focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ingresa tu contraseña"
                  required
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

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-bold py-3 px-4 rounded-brand transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaUser />
                  Iniciar Sesión
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
              ¿No tienes cuenta? Regístrate aquí
            </button>
          </div>

          {/* Datos de prueba */}
          <div className="mt-6 p-4 bg-neutral-50 rounded-brand">
            <h3 className="text-sm font-medium text-neutral-700 mb-2">Datos de Prueba:</h3>
            <div className="text-xs text-neutral-600 space-y-1">
              <p><strong>Email:</strong> maria@ejemplo.com</p>
              <p><strong>Contraseña:</strong> 123456</p>
              <p className="text-neutral-500 mt-2">También puedes usar: carlos@ejemplo.com o ana@ejemplo.com</p>
            </div>
          </div>

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

  // Diseño moderno inspirado en el banner promocional para registro
  return (
    <div className="min-h-screen flex">
      {/* Lado izquierdo - Fondo oscuro con contenido */}
      <div className="hidden lg:flex lg:w-2/3 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8 items-center justify-center">
        <div className="max-w-lg text-white">
          {/* Logo circular */}
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-purple-500 rounded-full flex items-center justify-center">
              <FaUserPlus className="h-6 w-6 text-white" />
            </div>
          </div>
          
          {/* Texto promocional */}
          <div className="mb-6">
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-2">
              Simulador de Emprendimientos
            </p>
            <h1 className="text-4xl font-bold mb-2">
              Registro de Usuario
            </h1>
            <p className="text-blue-100 text-lg">
              Únete a nuestra comunidad y comienza tu viaje emprendedor
            </p>
          </div>
          
          {/* Elementos decorativos */}
          <div className="flex space-x-4">
            <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="w-full lg:w-1/3 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Formulario principal */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
            {/* Header del formulario */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Crear Cuenta
              </h2>
              <p className="text-gray-600">
                Completa tus datos para comenzar
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Nombre completo */}
              <div>
                <label htmlFor="nombreCompleto" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-purple-500" />
                  </div>
                  <input
                    type="text"
                    id="nombreCompleto"
                    value={registerData.nombreCompleto}
                    onChange={(e) => handleInputChange('nombreCompleto', e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-purple-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={registerData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-purple-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={registerData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-purple-500 transition-colors" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 hover:text-purple-500 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-purple-500" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Confirma tu contraseña"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-purple-500 transition-colors" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 hover:text-purple-500 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-purple-300 disabled:to-blue-300 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FaUserPlus className="h-5 w-5" />
                    Crear Cuenta
                  </>
                )}
              </button>
            </form>

            {/* Cambiar modo */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-purple-600 hover:text-purple-700 font-medium underline transition-colors"
              >
                ¿Ya tienes cuenta? Inicia sesión aquí
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
