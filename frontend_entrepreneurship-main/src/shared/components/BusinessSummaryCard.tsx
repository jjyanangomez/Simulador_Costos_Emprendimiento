import React from 'react';
import { Building2, MapPin, Users, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import { useBusinessAnalysisData } from '../utils/businessAnalysisStorage';

interface BusinessSummaryCardProps {
  showFullDetails?: boolean;
  className?: string;
}

export function BusinessSummaryCard({ 
  showFullDetails = false, 
  className = '' 
}: BusinessSummaryCardProps) {
  const { businessData, hasData, isViable } = useBusinessAnalysisData();

  if (!hasData || !businessData) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
          <p className="text-yellow-800 font-medium">
            No hay datos de análisis de negocio disponibles
          </p>
        </div>
        <p className="text-yellow-700 text-sm mt-1">
          Completa la configuración del negocio primero
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Building2 className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-bold text-gray-900">Resumen del Negocio</h3>
        </div>
        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isViable 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isViable ? (
            <>
              <CheckCircle className="w-4 h-4 mr-1" />
              Viable
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 mr-1" />
              No Viable
            </>
          )}
        </div>
      </div>

      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center">
          <Building2 className="w-4 h-4 text-gray-400 mr-2" />
          <div>
            <p className="text-xs text-gray-600">Nombre</p>
            <p className="font-semibold text-gray-900">{businessData.businessName}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
          <div>
            <p className="text-xs text-gray-600">Ubicación</p>
            <p className="font-semibold text-gray-900">{businessData.sector}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Users className="w-4 h-4 text-gray-400 mr-2" />
          <div>
            <p className="text-xs text-gray-600">Capacidad</p>
            <p className="font-semibold text-gray-900">{businessData.capacity} personas</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
          <div>
            <p className="text-xs text-gray-600">Inversión Total</p>
            <p className="font-semibold text-gray-900">${businessData.totalInvestment.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Detalles adicionales si se requieren */}
      {showFullDetails && (
        <>
          <div className="border-t pt-4 mt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Detalles Financieros</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Tipo de Financiamiento</p>
                <p className="font-medium text-gray-900 capitalize">{businessData.financingType}</p>
              </div>
              <div>
                <p className="text-gray-600">Capital Propio</p>
                <p className="font-medium text-gray-900">${businessData.ownCapital.toLocaleString()}</p>
              </div>
              {businessData.loanCapital > 0 && (
                <div>
                  <p className="text-gray-600">Capital de Préstamo</p>
                  <p className="font-medium text-gray-900">${businessData.loanCapital.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Análisis de IA */}
          <div className="border-t pt-4 mt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Resultado del Análisis</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className={`p-3 rounded-lg ${
                businessData.aiAnalysis.riskLevel === 'low' ? 'bg-green-50' :
                businessData.aiAnalysis.riskLevel === 'medium' ? 'bg-yellow-50' : 'bg-red-50'
              }`}>
                <p className="text-gray-600">Nivel de Riesgo</p>
                <p className={`font-bold ${
                  businessData.aiAnalysis.riskLevel === 'low' ? 'text-green-800' :
                  businessData.aiAnalysis.riskLevel === 'medium' ? 'text-yellow-800' : 'text-red-800'
                }`}>
                  {businessData.aiAnalysis.riskLevel === 'low' ? '🟢 BAJO' :
                   businessData.aiAnalysis.riskLevel === 'medium' ? '🟡 MEDIO' : '🔴 ALTO'}
                </p>
              </div>
              
              <div className={`p-3 rounded-lg ${
                businessData.aiAnalysis.financialHealth === 'good' ? 'bg-green-50' :
                businessData.aiAnalysis.financialHealth === 'fair' ? 'bg-yellow-50' : 'bg-red-50'
              }`}>
                <p className="text-gray-600">Salud Financiera</p>
                <p className={`font-bold ${
                  businessData.aiAnalysis.financialHealth === 'good' ? 'text-green-800' :
                  businessData.aiAnalysis.financialHealth === 'fair' ? 'text-yellow-800' : 'text-red-800'
                }`}>
                  {businessData.aiAnalysis.financialHealth === 'good' ? '💚 BUENA' :
                   businessData.aiAnalysis.financialHealth === 'fair' ? '💛 REGULAR' : '❤️ MALA'}
                </p>
              </div>
              
              <div>
                <p className="text-gray-600">Categoría</p>
                <p className="font-medium text-gray-900 capitalize">{businessData.businessCategory}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
