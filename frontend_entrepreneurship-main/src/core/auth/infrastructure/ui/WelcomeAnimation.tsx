import { useEffect, useState } from 'react';
import { FaCheckCircle, FaUser, FaRocket, FaStar } from 'react-icons/fa';

interface WelcomeAnimationProps {
  userName: string;
  onComplete: () => void;
}

export function WelcomeAnimation({ userName, onComplete }: WelcomeAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Secuencia de animación de exactamente 3 segundos
    setShowAnimation(true);
    
    // Animación de progreso más rápida para completar en 3 segundos
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 3; // Más rápido: 3% por intervalo
      });
    }, 90); // 90ms para completar en ~3 segundos
    
    setTimeout(() => {
      setShowText(true);
    }, 300); // 300ms
    
    setTimeout(() => {
      setShowName(true);
    }, 800); // 800ms
    
    setTimeout(() => {
      setShowStars(true);
    }, 1200); // 1200ms
    
    setTimeout(() => {
      setShowCheck(true);
    }, 1600); // 1600ms
    
    // Tiempo total: 3 segundos exactos
    setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-indigo-900/90 backdrop-blur-md z-50 flex items-center justify-center transition-all duration-700 ${showAnimation ? 'opacity-100' : 'opacity-0'}`}>
      {/* Partículas de fondo animadas */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 max-w-lg w-full mx-4 text-center border border-white/20">
        {/* Icono principal con animación mejorada */}
        <div className="mb-8">
          <div className={`relative w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-1000 ${showAnimation ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-ping opacity-20"></div>
            <FaUser className="text-white text-4xl relative z-10" />
          </div>
        </div>

        {/* Texto de bienvenida con animación mejorada */}
        <div className={`transition-all duration-700 transform ${showText ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            ¡Bienvenido!
          </h2>
        </div>

        {/* Nombre del usuario con efecto especial */}
        <div className={`transition-all duration-700 transform delay-300 ${showName ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
          <div className="relative">
            <p className="text-2xl font-bold text-gray-800 mb-4">{userName}</p>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </div>

        {/* Estrellas decorativas */}
        <div className={`flex justify-center gap-2 mb-6 transition-all duration-700 delay-500 ${showStars ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          {[...Array(5)].map((_, i) => (
            <FaStar 
              key={i} 
              className="text-yellow-400 text-lg animate-bounce" 
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        {/* Check de confirmación mejorado */}
        <div className={`transition-all duration-700 transform delay-700 ${showCheck ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-75'}`}>
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <FaCheckCircle className="text-white text-2xl" />
            </div>
            <p className="text-green-600 font-semibold text-lg">Acceso exitoso</p>
            <p className="text-gray-500 text-sm mt-1">Redirigiendo al sistema...</p>
          </div>
        </div>

        {/* Barra de progreso mejorada */}
        <div className="mt-8">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2 font-medium">{progress}% completado</p>
        </div>

        {/* Icono de cohete flotante */}
        <div className={`absolute -top-4 -right-4 transition-all duration-1000 delay-1000 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-bounce">
            <FaRocket className="text-white text-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
