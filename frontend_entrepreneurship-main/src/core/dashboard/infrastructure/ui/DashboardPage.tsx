import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../../shared/infrastructure/components/MainLayout';
import { 
  Building2, 
  Calculator, 
  Package, 
  DollarSign,
  TrendingUp, 
  BarChart3, 
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const steps = [
  {
    id: 'business-setup',
    title: 'Configuración del Negocio',
    description: 'Define los datos básicos de tu negocio de alimentos y bebidas',
    icon: Building2,
    path: '/business-setup',
    status: 'pending' as const,
  },
  {
    id: 'fixed-costs',
    title: 'Costos Fijos',
    description: 'Ingresa todos los costos fijos mensuales de tu negocio',
    icon: Calculator,
    path: '/fixed-costs',
    status: 'pending' as const,
  },
  {
    id: 'variable-costs',
    title: 'Costos Variables',
    description: 'Define tus productos principales y sus costos variables',
    icon: Package,
    path: '/variable-costs',
    status: 'pending' as const,
  },
  {
    id: 'precio-venta',
    title: 'Precio de Venta',
    description: 'Analiza costos, precios sugeridos y rentabilidad de productos',
    icon: DollarSign,
    path: '/precio-venta',
    status: 'pending' as const,
  },
  {
    id: 'profitability-analysis',
    title: 'Análisis de Rentabilidad',
    description: 'Calcula el punto de equilibrio y analiza la rentabilidad',
    icon: TrendingUp,
    path: '/profitability-analysis',
    status: 'pending' as const,
  },
  {
    id: 'results',
    title: 'Resultados',
    description: 'Revisa el análisis completo y las recomendaciones',
    icon: BarChart3,
    path: '/results',
    status: 'pending' as const,
  },
];

export function DashboardPage() {
  const navigate = useNavigate();

  const getStatusIcon = (status: 'pending' | 'in-progress' | 'completed') => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-6 h-6 text-blue-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: 'pending' | 'in-progress' | 'completed') => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'in-progress':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simulador de Costos para Negocios de Alimentos y Bebidas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analiza la rentabilidad de tu negocio paso a paso. Calcula costos, 
            punto de equilibrio y obtén recomendaciones personalizadas con IA.
          </p>
        </div>

        {/* Progreso general */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Progreso de la Simulación</h2>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">0 de 6 completados</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
          </div>
        </div>

        {/* Pasos de la simulación */}
        <div className="grid gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            
            return (
              <div
                key={step.id}
                className={`border-2 rounded-xl p-6 transition-all duration-200 hover:shadow-md cursor-pointer ${getStatusColor(step.status)}`}
                onClick={() => navigate(step.path)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Paso {index + 1}: {step.title}
                        </h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(step.status)}
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Información adicional */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-200">
          <h3 className="text-lg font-semibold text-primary-900 mb-3">
            💡 ¿Por qué usar este simulador?
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-primary-800">
            <div>
              <p className="font-medium mb-2">🎯 Análisis Preciso</p>
              <p>Calcula el punto de equilibrio real de tu negocio con datos del mercado ecuatoriano.</p>
            </div>
            <div>
              <p className="font-medium mb-2">🤖 Validación con IA</p>
              <p>Recibe alertas cuando tus costos o precios están fuera del rango esperado.</p>
            </div>
            <div>
              <p className="font-medium mb-2">📊 Visualizaciones Claras</p>
              <p>Gráficos y tablas que te ayudan a entender la rentabilidad de tu negocio.</p>
            </div>
            <div>
              <p className="font-medium mb-2">🚀 Recomendaciones Accionables</p>
              <p>Obtén consejos específicos para mejorar la rentabilidad de tu negocio.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
