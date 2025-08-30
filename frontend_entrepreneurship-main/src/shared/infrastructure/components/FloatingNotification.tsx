import { useEffect, useState } from 'react';
import { FaTimes, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface FloatingNotificationProps {
  message: string;
  type: NotificationType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number; // Duración en milisegundos antes de auto-ocultar
}

export function FloatingNotification({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 5000 
}: FloatingNotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      // Auto-ocultar después de la duración especificada
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Esperar a que termine la animación
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <FaExclamationTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <FaInfoCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <FaInfoCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div
        className={`
          ${getBackgroundColor()}
          border rounded-lg shadow-lg p-4 
          transform transition-all duration-300 ease-in-out
          ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => {
                setIsAnimating(false);
                setTimeout(onClose, 300);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
