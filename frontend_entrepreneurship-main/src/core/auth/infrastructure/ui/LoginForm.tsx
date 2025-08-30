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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-gray-700 to-blue-800 p-4 relative overflow-hidden">
      <div className="relative z-10 flex w-full max-w-6xl">
        {/* Left Section */}
        <div className="hidden lg:flex lg:w-2/3 items-center justify-center p-8">
          <div className="text-white max-w-md">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-blue-500 rounded-full flex items-center justify-center mb-6">
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Login Page Examples to Inspire Your Next Design
              </h1>
              <p className="text-gray-100 text-lg opacity-90">
                Descubre el poder de un diseño moderno y atractivo para tu experiencia de usuario
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full lg:w-1/3 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {isLoginMode ? 'LOGIN' : 'REGISTER'}
              </h2>
              <p className="text-gray-600">
                {isLoginMode ? 'Accede a tu cuenta para continuar' : 'Crea tu cuenta para comenzar'}
              </p>
            </div>

            <form onSubmit={isLoginMode ? handleLogin : handleRegister} className="space-y-6">
              {!isLoginMode && (
                <div>
                  <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="nombreCompleto"
                    value={registerData.nombreCompleto}
                    onChange={(e) => handleInputChange('nombreCompleto', e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ingresa tu nombre completo"
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={isLoginMode ? loginData.email : registerData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={isLoginMode ? loginData.password : registerData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder={isLoginMode ? "Ingresa tu contraseña" : "Mínimo 6 caracteres"}
                  required
                  minLength={isLoginMode ? undefined : 6}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5 text-blue-400" /> : <FaEye className="h-5 w-5 text-blue-400" />}
                </button>
              </div>

              {!isLoginMode && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña
                  </label>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Confirma tu contraseña"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash className="h-5 w-5 text-blue-400" /> : <FaEye className="h-5 w-5 text-blue-400" />}
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-
