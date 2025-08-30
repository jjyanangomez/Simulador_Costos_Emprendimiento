import { useEffect, useState } from 'react';
import { FaCheckCircle, FaRocket } from 'react-icons/fa';

interface WelcomeAnimationProps {
  userName: string;
  isVisible: boolean;
  onComplete: () => void;
}

export function WelcomeAnimation({ userName, isVisible, onComplete }: WelcomeAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState<'entering' | 'visible' | 'exiting'>('entering');

  useEffect(() => {
    if (isVisible) {
      // Fase 1: Entrada
      setAnimationPhase('entering');
      
      // Fase 2: Visible
      const visibleTimer = setTimeout(() => {
        setAnimationPhase('visible');
      }, 500);

      // Fase 3: Salida y callback
      const exitTimer = setTimeout(() => {
        setAnimationPhase('exiting');
        setTimeout(onComplete, 800); // Esperar a que termine la animación de salida
      }, 2500);

      return () => {
        clearTimeout(visibleTimer);
        clearTimeout(exitTimer);
      };
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`
          bg-white rounded-3xl shadow-2xl p-12 text-center transform transition-all duration-800 ease-out
          ${animationPhase === 'entering' ? 'scale-0 opacity-0 rotate-12' : ''}
          ${animationPhase === 'visible' ? 'scale-100 opacity-100 rotate-0' : ''}
          ${animationPhase === 'exiting' ? 'scale-110 opacity-0 -rotate-12' : ''}
        `}
      >
        {/* Icono de éxito */}
        <div className="mb-6 flex justify-center">
          <div
            className={`
              w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center
              transform transition-all duration-500 ease-out
              ${animationPhase === 'entering' ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}
            `}
          >
            <FaCheckCircle className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Mensaje de bienvenida */}
        <h1
          className={`
            text-4xl font-bold text-gray-800 mb-4
            transform transition-all duration-700 ease-out delay-200
            ${animationPhase === 'entering' ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}
          `}
        >
          ¡Bienvenido!
        </h1>

        <p
          className={`
            text-2xl text-blue-600 font-semibold mb-6
            transform transition-all duration-700 ease-out delay-400
            ${animationPhase === 'entering' ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}
          `}
        >
          {userName}
        </p>

        {/* Mensaje de entrada al sistema */}
        <div
          className={`
            flex items-center justify-center space-x-3 text-gray-600
            transform transition-all duration-700 ease-out delay-600
            ${animationPhase === 'entering' ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}
          `}
        >
          <FaRocket className="w-5 h-5 text-blue-500 animate-pulse" />
          <span className="text-lg">Entrando al sistema...</span>
        </div>

        {/* Barra de progreso */}
        <div
          className={`
            mt-6 w-full bg-gray-200 rounded-full h-2 overflow-hidden
            transform transition-all duration-700 ease-out delay-800
            ${animationPhase === 'entering' ? 'scale-x-0' : 'scale-x-100'}
          `}
        >
          <div
            className={`
              h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full
              transform transition-all duration-2000 ease-out
              ${animationPhase === 'visible' ? 'w-full' : 'w-0'}
            `}
          />
        </div>
      </div>
    </div>
  );
}
