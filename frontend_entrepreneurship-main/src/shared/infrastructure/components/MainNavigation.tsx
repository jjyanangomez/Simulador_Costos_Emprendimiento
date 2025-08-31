import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../core/auth/infrastructure/hooks/useAuth';
import { 
  Home, 
  Building2, 
  Calculator, 
  Package, 
  TrendingUp, 
  BarChart3, 
  LogOut,
  User,
  DollarSign,
  Target
} from 'lucide-react';

const navigationItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/business-setup', label: 'Configuración', icon: Building2 },
  { path: '/fixed-costs', label: 'Costos Fijos', icon: Calculator },
  { path: '/variable-costs', label: 'Costos Variables', icon: Package },
  { path: '/precio-venta', label: 'Precio de Venta', icon: DollarSign },
  { path: '/equilibrium', label: 'Equilibrio', icon: Target },
  { path: '/profitability-analysis', label: 'Análisis', icon: TrendingUp },
  { path: '/results', label: 'Resultados', icon: BarChart3 },
];

export function MainNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg border-r border-gray-200 w-64 min-h-screen fixed left-0 top-0">
      <div className="p-6">
        {/* Logo y título */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Simulador</h1>
            <p className="text-sm text-gray-500">Costos & Rentabilidad</p>
          </div>
        </div>

        {/* Información del usuario */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.nombreCompleto || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'usuario@ejemplo.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Navegación principal */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Botón de logout */}
        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 text-gray-400" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
