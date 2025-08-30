import { useState } from 'react';
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

// Simulación de validación con IA
const validateCostWithAI = (cost: any) => {
  const validations = [];
  
  // Validaciones basadas en rangos típicos del mercado ecuatoriano
  const marketRanges: Record<string, { min: number; max: number; unit: string }> = {
    arriendo: { min: 800, max: 5000, unit: 'USD/mes' },
    personal: { min: 425, max: 2000, unit: 'USD/mes por empleado' },
    'seguridad-social': { min: 50, max: 200, unit: 'USD/mes por empleado' },
    servicios: { min: 150, max: 800, unit: 'USD/mes' },
    publicidad: { min: 200, max: 2000, unit: 'USD/mes' },
    licencias: { min: 50, max: 500, unit: 'USD/año' },
    seguros: { min: 100, max: 800, unit: 'USD/mes' },
    mantenimiento: { min: 100, max: 1000, unit: 'USD/mes' },
    transporte: { min: 200, max: 1500, unit: 'USD/mes' },
  };

  const range = marketRanges[cost.category];
  if (range) {
    const monthlyAmount = cost.frequency === 'mensual' ? cost.amount : 
                         cost.frequency === 'semestral' ? cost.amount / 6 : 
                         cost.amount / 12;
    
    if (monthlyAmount < range.min) {
      validations.push({
        type: 'warning',
        message: `El costo parece estar por debajo del rango típico del mercado (${range.min}-${range.max} ${range.unit})`,
        severity: 'low'
      });
    } else if (monthlyAmount > range.max) {
      validations.push({
        type: 'error',
        message: `El costo está significativamente por encima del rango típico del mercado (${range.min}-${range.max} ${range.unit})`,
        severity: 'high'
      });
    } else {
      validations.push({
        type: 'success',
        message: 'El costo está dentro del rango esperado del mercado',
        severity: 'none'
      });
    }
  }

  return validations;
};

export function FixedCostsPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiValidations, setAiValidations] = useState<Record<number, any[]>>({});

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FixedCostForm>({
    resolver: zodResolver(fixedCostSchema),
    defaultValues: {
      costs: [
        {
          name: 'Arriendo del Local',
          description: 'Renta mensual del local comercial',
          amount: 1200,
          frequency: 'mensual',
          category: 'arriendo',
        }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'costs',
  });

  const watchedCosts = watch('costs');

  // Calcular totales
  const calculateTotals = () => {
    let totalMonthly = 0;
    let totalYearly = 0;

    watchedCosts.forEach((cost) => {
      let monthlyAmount = cost.amount;
      if (cost.frequency === 'semestral') monthlyAmount = cost.amount / 6;
      if (cost.frequency === 'anual') monthlyAmount = cost.amount / 12;
      
      totalMonthly += monthlyAmount;
      totalYearly += monthlyAmount * 12;
    });

    return { totalMonthly, totalYearly };
  };

  const { totalMonthly, totalYearly } = calculateTotals();

  // Validar costo con IA
  const validateCost = (index: number) => {
    const cost = watchedCosts[index];
    if (cost.name && cost.amount && cost.category) {
      const validations = validateCostWithAI(cost);
      setAiValidations(prev => ({ ...prev, [index]: validations }));
    }
  };

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
      // Aquí se enviarían los datos al backend
      console.log('Costos fijos:', data);
      
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('¡Costos fijos guardados exitosamente!');
      
      // Navegar al siguiente paso
      navigate('/variable-costs');
    } catch (error) {
      toast.error('Error al guardar los costos fijos');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getValidationIcon = (validations: any[]) => {
    if (validations.length === 0) return null;
    
    const hasError = validations.some(v => v.type === 'error');
    const hasWarning = validations.some(v => v.type === 'warning');
    
    if (hasError) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (hasWarning) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getValidationColor = (validations: any[]) => {
    if (validations.length === 0) return 'border-gray-200';
    
    const hasError = validations.some(v => v.type === 'error');
    const hasWarning = validations.some(v => v.type === 'warning');
    
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
                              errors.costs?.[index]?.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Ej: Arriendo del Local"
                            onBlur={() => validateCost(index)}
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
                              errors.costs?.[index]?.category ? 'border-red-500' : 'border-gray-300'
                            }`}
                            onChange={(e) => {
                              field.onChange(e);
                              validateCost(index);
                            }}
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
                      {watchedCosts[index]?.category && (
                        <p className="mt-2 text-sm text-gray-600">
                          {costCategories.find(c => c.value === watchedCosts[index].category)?.description}
                        </p>
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
                            min="0.01"
                            step="0.01"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.costs?.[index]?.amount ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                            onBlur={() => validateCost(index)}
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
                              errors.costs?.[index]?.frequency ? 'border-red-500' : 'border-gray-300'
                            }`}
                            onChange={(e) => {
                              field.onChange(e);
                              validateCost(index);
                            }}
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

                  {/* Validaciones de IA */}
                  {aiValidations[index] && aiValidations[index].length > 0 && (
                    <div className="mt-4 space-y-2">
                      {aiValidations[index].map((validation, vIndex) => (
                        <div
                          key={vIndex}
                          className={`p-3 rounded-lg text-sm ${
                            validation.type === 'error'
                              ? 'bg-red-50 border border-red-200 text-red-800'
                              : validation.type === 'warning'
                              ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                              : 'bg-green-50 border border-green-200 text-green-800'
                          }`}
                        >
                          {validation.message}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Resumen del costo */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Costo mensual equivalente:</span>
                      <span className="font-semibold text-gray-900">
                        ${(() => {
                          const cost = watchedCosts[index];
                          if (cost.frequency === 'mensual') return cost.amount;
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
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar y Continuar</span>
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
