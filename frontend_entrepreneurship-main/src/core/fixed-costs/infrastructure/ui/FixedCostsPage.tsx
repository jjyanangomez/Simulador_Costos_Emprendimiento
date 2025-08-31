import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../../shared/infrastructure/components/MainLayout';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Save,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AIAnalysisService } from '../services/ai-analysis.service';
import type { FixedCost, BusinessData, FixedCostsSummary } from '../../domain/types';

// Esquema de validación para costos fijos
const fixedCostSchema = z.object({
  costs: z.array(z.object({
    name: z.string().min(3, 'El nombre del costo debe tener al menos 3 caracteres'),
    description: z.string().optional(),
    amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
    frequency: z.enum(['mensual', 'semestral', 'anual']),
    category: z.string().min(1, 'Selecciona una categoría'),
  })).min(1, 'Debes agregar al menos un costo fijo'),
});

type FixedCostForm = z.infer<typeof fixedCostSchema>;

const costCategories = [
  { value: 'arriendo', label: 'Arriendo/Renta del Local', icon: '🏠', description: 'Pago mensual del local' },
  { value: 'personal', label: 'Sueldos y Salarios', icon: '👥', description: 'Remuneraciones del personal' },
  { value: 'seguridad-social', label: 'Seguridad Social (IESS)', icon: '🛡️', description: 'Aportes patronales' },
  { value: 'servicios', label: 'Servicios Básicos', icon: '⚡', description: 'Luz, agua, internet, etc.' },
  { value: 'publicidad', label: 'Publicidad y Marketing', icon: '📢', description: 'Campañas publicitarias' },
  { value: 'licencias', label: 'Licencias y Permisos', icon: '📋', description: 'Permisos municipales' },
  { value: 'seguros', label: 'Seguros', icon: '🔒', description: 'Seguros empresariales' },
  { value: 'mantenimiento', label: 'Mantenimiento', icon: '🔧', description: 'Local y equipos' },
  { value: 'transporte', label: 'Transporte y Logística', icon: '🚚', description: 'Gastos de transporte' },
  { value: 'otros', label: 'Otros Costos', icon: '📦', description: 'Costos adicionales' },
];

const frequencyOptions = [
  { value: 'mensual', label: 'Mensual', multiplier: 1 },
  { value: 'semestral', label: 'Semestral', multiplier: 6 },
  { value: 'anual', label: 'Anual', multiplier: 12 },
];

export function FixedCostsPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiValidations, setAiValidations] = useState<Record<number, any[]>>({});

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FixedCostForm>({
    resolver: zodResolver(fixedCostSchema),
    defaultValues: {
      costs: [
        {
          name: '',
          description: '',
          amount: 0,
          frequency: 'mensual',
          category: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'costs',
  });

  const watchedCosts = watch('costs');

  // Cargar datos guardados al regresar de la página de resumen
  useEffect(() => {
    const savedCostsData = localStorage.getItem('fixedCostsData');
    if (savedCostsData) {
      try {
        const parsedData = JSON.parse(savedCostsData);
        // Restaurar los campos del formulario
        if (parsedData.costs && Array.isArray(parsedData.costs)) {
          parsedData.costs.forEach((cost: any, index: number) => {
            if (index < fields.length && cost) {
              setValue(`costs.${index}.name`, cost.name || '');
              setValue(`costs.${index}.description`, cost.description || '');
              setValue(`costs.${index}.amount`, cost.amount || 0);
              setValue(`costs.${index}.frequency`, cost.frequency || 'mensual');
              setValue(`costs.${index}.category`, cost.category || '');
            }
          });
        }
      } catch (error) {
        console.error('Error al cargar datos guardados:', error);
      }
    }
  }, [fields.length, setValue]);

  // Cargar y mostrar datos del negocio al montar el componente
  useEffect(() => {
    console.log('🔍 [FIXED_COSTS] Verificando datos del negocio en localStorage...');
    
    try {
      // Mostrar todas las claves disponibles para debugging
      const allKeys = Object.keys(localStorage);
      console.log('📋 [FIXED_COSTS] Claves disponibles en localStorage:', allKeys);
      
      // Verificar datos del negocio
      const businessAnalysisStr = localStorage.getItem('businessAnalysisData');
      const lastAnalysisStr = localStorage.getItem('lastBusinessAnalysis');
      const businessNameStr = localStorage.getItem('businessNameStorage');
      
      if (businessAnalysisStr) {
        try {
          const businessAnalysis = JSON.parse(businessAnalysisStr);
          console.log('✅ [FIXED_COSTS] Datos del negocio encontrados en businessAnalysisData:', businessAnalysis);
        } catch (error) {
          console.warn('⚠️ [FIXED_COSTS] Error al parsear businessAnalysisData:', error);
        }
      }
      
      if (lastAnalysisStr) {
        try {
          const lastAnalysis = JSON.parse(lastAnalysisStr);
          console.log('✅ [FIXED_COSTS] Datos del negocio encontrados en lastBusinessAnalysis:', lastAnalysis);
        } catch (error) {
          console.warn('⚠️ [FIXED_COSTS] Error al parsear lastBusinessAnalysis:', error);
        }
      }
      
      if (businessNameStr) {
        try {
          const businessNameData = JSON.parse(businessNameStr);
          console.log('✅ [FIXED_COSTS] Datos del negocio encontrados en businessNameStorage:', businessNameData);
        } catch (error) {
          console.warn('⚠️ [FIXED_COSTS] Error al parsear businessNameStorage:', error);
        }
      }
      
      if (!businessAnalysisStr && !lastAnalysisStr && !businessNameStr) {
        console.warn('⚠️ [FIXED_COSTS] No se encontraron datos del negocio en localStorage');
      }
    } catch (error) {
      console.error('❌ [FIXED_COSTS] Error al verificar localStorage:', error);
    }
  }, []);

  // Calcular totales
  const calculateTotals = () => {
    let totalMonthly = 0;
    let totalYearly = 0;
    const costBreakdown = { mensual: 0, semestral: 0, anual: 0 };

    watchedCosts.forEach((cost) => {
      if (!cost?.name || !cost?.amount || !cost?.frequency || cost.amount <= 0) {
        return; // Saltar costos inválidos
      }

      let monthlyAmount = cost.amount;
      if (cost.frequency === 'semestral') monthlyAmount = cost.amount / 6;
      if (cost.frequency === 'anual') monthlyAmount = cost.amount / 12;
      
      totalMonthly += monthlyAmount;
      totalYearly += monthlyAmount * 12;
      
      // Acumular por frecuencia para el desglose
      costBreakdown[cost.frequency as keyof typeof costBreakdown] += cost.amount;
    });

    return { totalMonthly, totalYearly, costBreakdown };
  };

  const { totalMonthly, totalYearly, costBreakdown } = calculateTotals();

  // Limpiar validaciones cuando cambien los costos
  useEffect(() => {
    // Limpiar validaciones de costos que ya no existen
    if (watchedCosts && Array.isArray(watchedCosts)) {
      const currentIndexes = Object.keys(watchedCosts).map(Number);
      setAiValidations(prev => {
        const newValidations: Record<number, any[]> = {};
        currentIndexes.forEach(index => {
          if (prev[index]) {
            newValidations[index] = prev[index];
          }
        });
        return newValidations;
      });
    }
  }, [watchedCosts.length]);

  const addNewCost = () => {
    append({
      name: '',
      description: '',
      amount: 0,
      frequency: 'mensual',
      category: '',
    });
  };

  const onSubmit = async (data: FixedCostForm) => {
    setIsSubmitting(true);
    
    try {
      // Obtener datos del negocio del localStorage - buscar en múltiples ubicaciones
      let businessData: BusinessData | null = null;
      
      // 1. Intentar obtener de businessAnalysisData (ubicación principal)
      const businessAnalysisStr = localStorage.getItem('businessAnalysisData');
      if (businessAnalysisStr) {
        try {
          const businessAnalysis = JSON.parse(businessAnalysisStr);
          businessData = {
            businessName: businessAnalysis.businessName,
            businessType: businessAnalysis.businessCategory,
            location: businessAnalysis.sector,
            size: businessAnalysis.businessSize,
            employeeCount: Math.ceil(businessAnalysis.capacity / 10), // Estimación basada en capacidad
            description: `${businessAnalysis.businessCategory} en ${businessAnalysis.sector}`,
          };
          console.log('✅ Datos del negocio obtenidos de businessAnalysisData');
        } catch (error) {
          console.warn('⚠️ Error al parsear businessAnalysisData:', error);
        }
      }
      
      // 2. Si no se encontró, intentar con lastBusinessAnalysis
      if (!businessData) {
        const lastAnalysisStr = localStorage.getItem('lastBusinessAnalysis');
        if (lastAnalysisStr) {
          try {
            const lastAnalysis = JSON.parse(lastAnalysisStr);
            // Buscar datos adicionales en otras claves
            const businessNameStr = localStorage.getItem('businessNameStorage');
            if (businessNameStr) {
              const businessNameData = JSON.parse(businessNameStr);
              businessData = {
                businessName: businessNameData.businessName || lastAnalysis.businessName,
                businessType: 'restaurante', // Valor por defecto
                location: 'Quito', // Valor por defecto
                size: 'micro', // Valor por defecto
                employeeCount: 5, // Valor por defecto
                description: 'Negocio configurado previamente',
              };
              console.log('✅ Datos del negocio obtenidos de lastBusinessAnalysis + businessNameStorage');
            }
          } catch (error) {
            console.warn('⚠️ Error al parsear lastBusinessAnalysis:', error);
          }
        }
      }
      
      // 3. Si aún no se encontró, mostrar error
      if (!businessData) {
        console.error('❌ No se encontraron datos del negocio en localStorage');
        try {
          console.log('🔍 Claves disponibles en localStorage:', Object.keys(localStorage));
        } catch (error) {
          console.error('❌ Error al acceder a localStorage:', error);
        }
        toast.error('No se encontraron los datos del negocio. Completa la configuración primero.');
        return;
      }

      console.log('📊 Datos del negocio para análisis:', businessData);
      
      // Convertir datos del formulario a FixedCost[]
      const fixedCosts: FixedCost[] = data.costs.map(cost => ({
        name: cost.name,
        description: cost.description || '',
        amount: cost.amount,
        frequency: cost.frequency,
        category: cost.category,
      }));

      // Mostrar toast de análisis en progreso
      toast.loading('Analizando costos fijos con IA...', { duration: 2000 });

      // Ejecutar análisis de IA
      const analysis = await AIAnalysisService.analyzeFixedCosts(fixedCosts, businessData);

      // Crear resumen completo
      const summary: FixedCostsSummary = {
        costs: fixedCosts,
        businessData,
        analysis,
      };

      // Guardar en localStorage
      localStorage.setItem('fixedCostsSummary', JSON.stringify(summary));
      localStorage.setItem('fixedCostsData', JSON.stringify(data));

      toast.success('¡Análisis completado! Redirigiendo al resumen...');
      
      // Navegar a la página de resumen
      navigate('/fixed-costs-summary');
    } catch (error) {
      toast.error('Error al analizar los costos fijos');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getValidationIcon = (validations: any[] | undefined) => {
    if (!validations || validations.length === 0) return null;
    
    const hasError = validations.some(v => v?.type === 'error');
    const hasWarning = validations.some(v => v?.type === 'warning');
    
    if (hasError) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (hasWarning) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getValidationColor = (validations: any[] | undefined) => {
    if (!validations || validations.length === 0) return 'border-gray-200';
    
    const hasError = validations.some(v => v?.type === 'error');
    const hasWarning = validations.some(v => v?.type === 'warning');
    
    if (hasError) return 'border-red-200 bg-red-50';
    if (hasWarning) return 'border-yellow-200 bg-yellow-50';
    return 'border-green-200 bg-green-50';
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Costos Fijos del Negocio
          </h1>
          <p className="text-lg text-gray-600">
            Ingresa todos los costos fijos mensuales de tu negocio. 
            La IA validará que estén dentro de rangos razonables del mercado.
          </p>
        </div>

        {/* Información del Negocio */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            🏢 Información del Negocio para Análisis
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-700 font-medium">Nombre:</span>
              <span className="ml-2 text-blue-900">
                {(() => {
                  try {
                    const businessAnalysisStr = localStorage.getItem('businessAnalysisData');
                    if (businessAnalysisStr) {
                      const data = JSON.parse(businessAnalysisStr);
                      return data?.businessName || 'No disponible';
                    }
                    return 'No configurado';
                  } catch (error) {
                    return 'Error al cargar';
                  }
                })()}
              </span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Tipo:</span>
              <span className="ml-2 text-blue-900">
                {(() => {
                  try {
                    const businessAnalysisStr = localStorage.getItem('businessAnalysisData');
                    if (businessAnalysisStr) {
                      const data = JSON.parse(businessAnalysisStr);
                      return data?.businessCategory || 'No disponible';
                    }
                    return 'No configurado';
                  } catch (error) {
                    return 'Error al cargar';
                  }
                })()}
              </span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Ubicación:</span>
              <span className="ml-2 text-blue-900">
                {(() => {
                  try {
                    const businessAnalysisStr = localStorage.getItem('businessAnalysisData');
                    if (businessAnalysisStr) {
                      const data = JSON.parse(businessAnalysisStr);
                      return data?.sector || 'No disponible';
                    }
                    return 'No configurado';
                  } catch (error) {
                    return 'Error al cargar';
                  }
                })()}
              </span>
            </div>
          </div>
          <div className="mt-3 text-xs text-blue-600">
            💡 Esta información se usará para el análisis de IA de tus costos fijos
          </div>
        </div>

        {/* Resumen de costos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen de Costos</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">${totalMonthly.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Mensual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">${totalYearly.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Anual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{fields.length}</div>
              <div className="text-sm text-gray-600">Costos Registrados</div>
            </div>
          </div>
        </div>

        {/* Formulario de costos */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-primary-600" />
                Lista de Costos Fijos
              </h2>
              <button
                type="button"
                onClick={addNewCost}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Costo</span>
              </button>
            </div>

            <div className="space-y-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={`border-2 rounded-lg p-6 transition-all duration-200 ${getValidationColor(aiValidations[index] || [])}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Costo #{index + 1}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getValidationIcon(aiValidations[index] || [])}
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Nombre del costo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Costo *
                      </label>
                      <Controller
                        name={`costs.${index}.name`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.costs?.[index]?.name ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Ej: Arriendo del local"
                          />
                        )}
                      />
                      {errors.costs?.[index]?.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.costs[index]?.name?.message}</p>
                      )}
                    </div>

                    {/* Categoría */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría *
                      </label>
                      <Controller
                        name={`costs.${index}.category`}
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.costs?.[index]?.category ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Selecciona una categoría</option>
                            {costCategories.map((category) => (
                              <option key={category.value} value={category.value}>
                                {category.icon} {category.label}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                      {errors.costs?.[index]?.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.costs[index]?.category?.message}</p>
                      )}
                    </div>

                    {/* Monto */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monto (USD) *
                      </label>
                      <Controller
                        name={`costs.${index}.amount`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.costs?.[index]?.amount ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        )}
                      />
                      {errors.costs?.[index]?.amount && (
                        <p className="mt-1 text-sm text-red-600">{errors.costs[index]?.amount?.message}</p>
                      )}
                    </div>

                    {/* Frecuencia */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frecuencia de Pago *
                      </label>
                      <Controller
                        name={`costs.${index}.frequency`}
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.costs?.[index]?.frequency ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            {frequencyOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                      {errors.costs?.[index]?.frequency && (
                        <p className="mt-1 text-sm text-red-600">{errors.costs[index]?.frequency?.message}</p>
                      )}
                    </div>

                    {/* Descripción */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción (Opcional)
                      </label>
                      <Controller
                        name={`costs.${index}.description`}
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            rows={2}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Describe brevemente este costo..."
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Resumen del costo */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Costo mensual equivalente:</span>
                      <span className="font-semibold text-gray-900">
                        ${(() => {
                          const cost = watchedCosts[index];
                          if (!cost || !cost.amount) return '0.00';
                          if (cost.frequency === 'mensual') return cost.amount.toFixed(2);
                          if (cost.frequency === 'semestral') return (cost.amount / 6).toFixed(2);
                          return (cost.amount / 12).toFixed(2);
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between items-center pt-6">
            <button
              type="button"
              onClick={() => navigate('/business-setup')}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Paso Anterior</span>
            </button>
            
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analizando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar y Analizar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
