import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  User, 
  Building2, 
  TrendingUp, 
  Calculator,
  Sparkles,
  ArrowRight,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../../auth/infrastructure/hooks/useAuth';

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleStartSimulation = () => {
    // Aquí puedes agregar lógica para limpiar datos de simulación anterior si es necesario
    navigate('/dashboard');
  };

  const handleLogout = () => {
    // Aquí puedes agregar lógica adicional antes de cerrar sesión si es necesario
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-700 to-blue-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
                         {/* Logo de la empresa - Izquierda */}
             <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                 <Building2 className="w-6 h-6 text-white" />
               </div>
               <div>
                 <h1 className="text-xl font-bold text-white">
                   Simulador
                 </h1>
                 <p className="text-xs text-gray-300 -mt-1">Simulador de Costos</p>
               </div>
             </div>

                         {/* Información del usuario - Derecha */}
             <div className="flex items-center space-x-4">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-medium text-white">
                   {user?.nombreCompleto || 'Usuario'}
                 </p>
                 <p className="text-xs text-gray-300">
                   {user?.email || 'usuario@ejemplo.com'}
                 </p>
               </div>
               <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                 <User className="w-5 h-5 text-white" />
               </div>
               
               {/* Botón de cerrar sesión */}
               <button
                 onClick={handleLogout}
                 className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:scale-105"
                 title="Cerrar sesión"
               >
                 <LogOut className="w-4 h-4" />
                 <span className="hidden sm:inline">Cerrar</span>
               </button>
             </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto text-center">
                     {/* Título principal */}
           <div className="mb-12">
             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
               Bienvenido al
               <span className="block text-white">
                 Simulador de Costos
               </span>
             </h1>
             <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
               Analiza la rentabilidad de tu emprendimiento con herramientas inteligentes 
               y obtén insights valiosos para tomar decisiones informadas.
             </p>
           </div>

                     {/* Botones de simulación con diseño glassmorphism */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
             {/* Botón Nueva Simulación */}
             <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
               <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                 <Play className="w-8 h-8 text-white" />
               </div>
               <h3 className="text-xl font-semibold text-white mb-4 text-center">Nueva Simulación</h3>
               <p className="text-gray-300 text-sm text-center mb-6">
                 Comienza desde cero con una nueva simulación de costos para tu emprendimiento.
               </p>
               <button
                 onClick={handleStartSimulation}
                 onMouseEnter={() => setIsHovered(true)}
                 onMouseLeave={() => setIsHovered(false)}
                 className="w-full bg-gradient-to-r from-blue-600 to-gray-600 hover:from-blue-700 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
               >
                 <span>Iniciar Nueva Simulación</span>
                 <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
               </button>
             </div>

                           {/* Botón Revisar Simulación Completada */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 text-center">Revisar Simulación</h3>
                <p className="text-gray-300 text-sm text-center mb-6">
                  Revisa los resultados y análisis de tu simulación anterior completada.
                </p>
                <button
                  onClick={() => navigate('/results')}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Ver Resultados</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
           </div>

                     {/* Información adicional */}
           <div className="mt-16 text-center">
             <p className="text-gray-400 text-sm">
               ¿Necesitas ayuda? Consulta nuestra guía de uso o contacta con soporte.
             </p>
           </div>
        </div>
      </main>

             {/* Efectos de fondo */}
       <div className="fixed inset-0 pointer-events-none overflow-hidden">
         {/* Círculos decorativos */}
         <div className="absolute top-20 left-20 w-32 h-32 bg-gray-400 rounded-full opacity-20 animate-pulse"></div>
         <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-400 rounded-full opacity-30 animate-bounce"></div>
         <div className="absolute top-1/2 left-10 w-16 h-16 bg-gray-300 rounded-full opacity-25 animate-ping"></div>
         <div className="absolute bottom-1/3 right-10 w-20 h-20 bg-blue-300 rounded-full opacity-20 animate-pulse"></div>
         
         {/* Líneas onduladas */}
         <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-10 transform -skew-y-6"></div>
         <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-l from-transparent via-blue-200 to-transparent opacity-10 transform skew-y-6"></div>
       </div>
    </div>
  );
}
