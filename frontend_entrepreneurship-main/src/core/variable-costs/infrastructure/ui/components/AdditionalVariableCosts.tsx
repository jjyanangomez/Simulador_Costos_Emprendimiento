import { useState, useEffect } from 'react';
import { Plus, Trash2, Brain } from 'lucide-react';
import type { AdditionalCost } from '../../../domain/types';

interface AdditionalVariableCostsProps {
  businessType: string;
  onCostsChange: (costs: AdditionalCost[]) => void;
}

// Categorías de costos variables generadas por IA según el tipo de negocio
const getCostCategories = (businessType: string): string[] => {
  const categoriesMap: Record<string, string[]> = {
    'restaurante': [
      'Servicios de limpieza',
      'Mantenimiento de equipos',
      'Servicios de delivery',
      'Embalajes y envases',
      'Servicios de seguridad',
      'Mantenimiento de instalaciones',
      'Servicios de internet/tecnología',
      'Materiales de limpieza',
      'Servicios de contabilidad',
      'Seguros comerciales'
    ],
    'cafeteria': [
      'Servicios de limpieza',
      'Mantenimiento de equipos',
      'Embalajes y envases',
      'Servicios de internet/tecnología',
      'Materiales de limpieza',
      'Servicios de contabilidad',
      'Seguros comerciales',
      'Mantenimiento de instalaciones',
      'Servicios de música/entretenimiento',
      'Materiales de oficina'
    ],
    'tienda': [
      'Servicios de limpieza',
      'Mantenimiento de equipos',
      'Embalajes y bolsas',
      'Servicios de internet/tecnología',
      'Materiales de limpieza',
      'Servicios de contabilidad',
      'Seguros comerciales',
      'Mantenimiento de instalaciones',
      'Servicios de seguridad',
      'Materiales de exhibición'
    ],
    'servicios': [
      'Servicios de limpieza',
      'Mantenimiento de equipos',
      'Servicios de internet/tecnología',
      'Materiales de oficina',
      'Servicios de contabilidad',
      'Seguros comerciales',
      'Mantenimiento de instalaciones',
      'Servicios de transporte',
      'Materiales de trabajo',
      'Servicios de marketing'
    ]
  };

  return categoriesMap[businessType.toLowerCase()] || [
    'Servicios de limpieza',
    'Mantenimiento de equipos',
    'Servicios de internet/tecnología',
    'Materiales de oficina',
    'Servicios de contabilidad',
    'Seguros comerciales',
    'Mantenimiento de instalaciones',
    'Servicios de transporte',
    'Materiales de trabajo',
    'Otros servicios'
  ];
};

export function AdditionalVariableCosts({ businessType, onCostsChange }: AdditionalVariableCostsProps) {
  const [costs, setCosts] = useState<AdditionalCost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isGeneratingCategories, setIsGeneratingCategories] = useState(false);

  useEffect(() => {
    if (businessType) {
      setIsGeneratingCategories(true);
      // Simular generación de categorías por IA
      setTimeout(() => {
        const generatedCategories = getCostCategories(businessType);
        setCategories(generatedCategories);
        setIsGeneratingCategories(false);
      }, 1000);
    }
  }, [businessType]);

  const addCost = () => {
    const newCost: AdditionalCost = {
      id: Date.now().toString(),
      category: '',
      name: '',
      value: 0,
    };
    const updatedCosts = [...costs, newCost];
    setCosts(updatedCosts);
    onCostsChange(updatedCosts);
  };

  const updateCost = (id: string, field: keyof AdditionalCost, value: string | number) => {
    const updatedCosts = costs.map(cost =>
      cost.id === id ? { ...cost, [field]: value } : cost
    );
    setCosts(updatedCosts);
    onCostsChange(updatedCosts);
  };

  const removeCost = (id: string) => {
    const updatedCosts = costs.filter(cost => cost.id !== id);
    setCosts(updatedCosts);
    onCostsChange(updatedCosts);
  };

  const totalCosts = costs.reduce((sum, cost) => sum + cost.value, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-600" />
          Costos Variables Adicionales
        </h2>
        <button
          onClick={addCost}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Costo</span>
        </button>
      </div>

      {isGeneratingCategories ? (
        <div className="text-center py-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-purple-600 font-medium">Generando categorías de costos con IA...</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Analizando el tipo de negocio: {businessType}
          </p>
        </div>
      ) : (
        <>
          {costs.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Categorías de Costos Generadas
              </h3>
              <p className="text-gray-600 mb-4">
                La IA ha identificado las siguientes categorías de costos variables para tu negocio:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-2xl mx-auto">
                {categories.map((category, index) => (
                  <div key={index} className="px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-700">
                    {category}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Haz clic en "Agregar Costo" para comenzar a registrar tus costos variables adicionales.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {costs.map((cost) => (
                <div key={cost.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría *
                      </label>
                      <select
                        value={cost.category}
                        onChange={(e) => updateCost(cost.id, 'category', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Seleccionar categoría</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Costo *
                      </label>
                      <input
                        type="text"
                        value={cost.name}
                        onChange={(e) => updateCost(cost.id, 'name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ej: Limpieza mensual"
                      />
                    </div>
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Valor (USD) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={cost.value}
                          onChange={(e) => updateCost(cost.id, 'value', parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                      <button
                        onClick={() => removeCost(cost.id)}
                        className="px-3 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Resumen de costos adicionales */}
              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-purple-900">
                    Total Costos Variables Adicionales:
                  </span>
                  <span className="text-2xl font-bold text-purple-600">
                    ${totalCosts.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
