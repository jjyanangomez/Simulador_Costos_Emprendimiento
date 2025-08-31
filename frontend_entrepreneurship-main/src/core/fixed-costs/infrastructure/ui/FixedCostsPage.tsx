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
  ArrowLeft,
  X,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCategorias } from '../hooks/useCategorias';
import { CategoriaSelector } from '../components/CategoriaSelector';
import { LocalStorageService } from '../../../../shared/services/localStorage.service';
import type { CostosFijosData } from '../../../../shared/services/localStorage.service';
import { AiAnalysisBackendService } from '../../../../shared/services/aiAnalysisBackend.service';
import { apiService } from '../../../../shared/infrastructure/services/api.service';


// Esquema de validación para costos fijos
const fixedCostSchema = z.object({
  costs: z.array(z.object({
    name: z.string().min(3, 'El nombre del costo debe tener al menos 3 caracteres'),
    description: z.string().optional(),
    amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
    frequency: z.enum(['mensual', 'semestral', 'anual']),
    category: z.string().min(1, 'Selecciona una categoría'),
  })).min(0), // Permite lista vacía - el usuario puede guardar sin costos si lo desea
});

type FixedCostForm = z.infer<typeof fixedCostSchema>;

// Las categorías se cargarán dinámicamente desde el backend
const getCostCategories = (costTypes: any[]) => {
  return costTypes.map(type => ({
    value: type.tipo_costo_id.toString(),
    label: type.nombre,
    icon: '💰', // Icono genérico
    description: type.descripcion || 'Tipo de costo'
  }));
};

const frequencyOptions = [
  { value: 'mensual', label: 'Mensual', multiplier: 1 },
  { value: 'semestral', label: 'Semestral', multiplier: 6 },
  { value: 'anual', label: 'Anual', multiplier: 12 },
];

// Simulación de validación con IA
const validateCostWithAI = (cost: any, costTypes: any[]) => {
  const validations = [];
  
  // Obtener el nombre de la categoría para la validación
  const categoryName = costTypes.find(type => type.tipo_costo_id.toString() === cost.category)?.nombre?.toLowerCase() || '';
  
  // Validaciones basadas en rangos típicos del mercado ecuatoriano
  const marketRanges: Record<string, { min: number; max: number; unit: string }> = {
    'arriendo': { min: 800, max: 5000, unit: 'USD/mes' },
    'renta': { min: 800, max: 5000, unit: 'USD/mes' },
    'local': { min: 800, max: 5000, unit: 'USD/mes' },
    'sueldos': { min: 425, max: 2000, unit: 'USD/mes por empleado' },
    'salarios': { min: 425, max: 2000, unit: 'USD/mes por empleado' },
    'personal': { min: 425, max: 2000, unit: 'USD/mes por empleado' },
    'servicios': { min: 150, max: 800, unit: 'USD/mes' },
    'básicos': { min: 150, max: 800, unit: 'USD/mes' },
    'publicidad': { min: 200, max: 2000, unit: 'USD/mes' },
    'marketing': { min: 200, max: 2000, unit: 'USD/mes' },
    'licencias': { min: 50, max: 500, unit: 'USD/año' },
    'permisos': { min: 50, max: 500, unit: 'USD/año' },
    'seguros': { min: 100, max: 800, unit: 'USD/mes' },
    'mantenimiento': { min: 100, max: 1000, unit: 'USD/mes' },
    'transporte': { min: 200, max: 1500, unit: 'USD/mes' },
  };

  // Buscar coincidencias en el nombre de la categoría
  let range = null;
  for (const [key, value] of Object.entries(marketRanges)) {
    if (categoryName.includes(key)) {
      range = value;
      break;
    }
  }

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

// Función de utilidad para formatear números de manera segura
const formatCurrency = (value: number | string | undefined): string => {
  const numValue = Number(value);
  if (!Number.isFinite(numValue) || numValue < 0) {
    return '0.00';
  }
  return numValue.toFixed(2);
};

export function FixedCostsPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiValidations, setAiValidations] = useState<Record<number, any[]>>({});
  const [negocioId, setNegocioId] = useState<number>(16); // Usar el negocio que creamos
  const [costTypes, setCostTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

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
          name: 'Arriendo del Local',
          description: 'Renta mensual del local comercial',
          amount: 1200,
          frequency: 'mensual',
          category: '',
        }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'costs',
  });

  const watchedCosts = watch('costs');

  // Calcular totales - CORREGIDO para sumar todos los costos
  const calculateTotals = () => {
    let totalMonthly = 0;
    let totalYearly = 0;
    let costBreakdown = {
      mensual: 0,
      semestral: 0,
      anual: 0
    };

    watchedCosts.forEach((cost) => {
      // Asegurar que amount sea un número válido
      const amount = Number(cost.amount) || 0;
      
      if (isNaN(amount) || amount <= 0) {
        return; // Saltar costos inválidos
      }

      let monthlyAmount = amount;
      if (cost.frequency === 'semestral') monthlyAmount = amount / 6;
      if (cost.frequency === 'anual') monthlyAmount = amount / 12;
      
      totalMonthly += monthlyAmount;
      totalYearly += monthlyAmount * 12;
      
      // Acumular por frecuencia para el desglose
      costBreakdown[cost.frequency as keyof typeof costBreakdown] += amount;
    });

    return { totalMonthly, totalYearly, costBreakdown };
  };

  const { totalMonthly, totalYearly, costBreakdown } = calculateTotals();

  // Limpiar validaciones cuando cambien los costos
  useEffect(() => {
    // Limpiar validaciones de costos que ya no existen
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
  }, [watchedCosts.length]);

  // Cargar SOLO las categorías disponibles del backend
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);

        console.log('🔍 Intentando conectar con el backend...');
        
        // SOLO cargar tipos de costo (categorías disponibles)
        console.log('📋 Cargando categorías disponibles...');
        const costTypesResponse = await apiService.getCostTypes();
        console.log('✅ Respuesta categorías:', costTypesResponse);
        
        if (costTypesResponse.data) {
          setCostTypes(costTypesResponse.data);
          console.log(`📊 ${costTypesResponse.data.length} categorías cargadas`);
        } else {
          console.warn('⚠️ No se recibieron categorías del backend');
          setCostTypes([]);
        }
        
        // NO cargar costos existentes - el usuario los ingresará manualmente
        
      } catch (error) {
        console.error('💥 Error cargando categorías:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error de conexión:', errorMessage);
        toast.error('Error al cargar las categorías disponibles');
        
        // Fallback: usar categorías hardcodeadas si falla la conexión
        setCostTypes([
          { tipo_costo_id: 1, nombre: 'Arriendo/Renta del Local', descripcion: 'Pago mensual del local' },
          { tipo_costo_id: 2, nombre: 'Sueldos y Salarios', descripcion: 'Remuneraciones del personal' },
          { tipo_costo_id: 3, nombre: 'Servicios Básicos', descripcion: 'Luz, agua, internet, etc.' },
          { tipo_costo_id: 4, nombre: 'Publicidad y Marketing', descripcion: 'Campañas publicitarias' },
          { tipo_costo_id: 5, nombre: 'Otros Costos', descripcion: 'Costos adicionales' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []); // Solo se ejecuta una vez al cargar la página

  // Validar costo con IA - CORREGIDO para usar categorías del backend
  const validateCost = (index: number) => {
    const cost = watchedCosts[index];
    if (cost.name && cost.amount && cost.category && costTypes.length > 0) {
      const validations = validateCostWithAI(cost, costTypes);
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
      console.log('🚀 Guardando costos fijos...', data.costs);
      
      // Guardar cada costo en el backend
      const savePromises = data.costs.map(async (cost) => {
        // Mapear el formato del frontend al formato del backend
        const backendCostData = {
          negocioId: negocioId,
          tipoCostoId: parseInt(cost.category), // Convertir string a number
          nombre: cost.name,
          descripcion: cost.description || '',
          monto: cost.amount,
          frecuencia: cost.frequency,
          activo: true
        };
        
        console.log('📤 Enviando costo al backend:', backendCostData);
        return apiService.createFixedCost(backendCostData);
      });
      
      // Esperar a que se guarden todos los costos
      const results = await Promise.all(savePromises);
      console.log('✅ Costos guardados:', results);
      
      toast.success(`¡${data.costs.length} costos fijos guardados exitosamente en la base de datos!`);
      
      // Navegar al siguiente paso
      navigate('/variable-costs');
    } catch (error) {
      console.error('❌ Error al guardar los costos fijos:', error);
      toast.error('Error al guardar los costos fijos en la base de datos');
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
            Selecciona una categoría y la IA validará que estén dentro de rangos razonables del mercado.
          </p>
          
          {/* Indicador de estado de conexión */}
          {isLoading && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                🔄 Conectando con la base de datos...
              </p>
            </div>
          )}
        </div>

        {/* Resumen de costos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Resumen de Costos</h2>
            <div className="text-xs text-gray-500">
              💾 Los costos se guardan al hacer clic en "Guardar y Continuar"
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">${(totalMonthly || 0).toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Mensual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">${(totalYearly || 0).toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Anual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{fields.length}</div>
              <div className="text-sm text-gray-600">Costos Registrados</div>
            </div>
          </div>
          
                     {/* Desglose detallado por frecuencia */}
           <div className="mt-6 pt-6 border-t border-gray-200">
             <h3 className="text-lg font-medium text-gray-900 mb-3">Desglose por Frecuencia de Pago</h3>
             <div className="grid md:grid-cols-3 gap-4">
               {/* Costos Mensuales - Siempre visible */}
               <div className={`p-4 rounded-lg transition-all duration-200 ${
                 costBreakdown.mensual > 0 
                   ? 'bg-blue-50 border border-blue-200' 
                   : 'bg-gray-50 border border-gray-200'
               }`}>
                 <div className="flex items-center justify-between mb-2">
                   <div className={`text-sm font-medium ${
                     costBreakdown.mensual > 0 ? 'text-blue-800' : 'text-gray-500'
                   }`}>
                     Costos Mensuales
                   </div>
                   <div className={`w-3 h-3 rounded-full ${
                     costBreakdown.mensual > 0 ? 'bg-blue-500' : 'bg-gray-300'
                   }`}></div>
                 </div>
                 <div className={`text-2xl font-bold ${
                   costBreakdown.mensual > 0 ? 'text-blue-600' : 'text-gray-400'
                 }`}>
                   ${formatCurrency(costBreakdown.mensual)}
                 </div>
                 <div className={`text-xs ${
                   costBreakdown.mensual > 0 ? 'text-blue-600' : 'text-gray-400'
                 }`}>
                   {costBreakdown.mensual > 0 ? 'Se pagan cada mes' : 'Sin costos mensuales'}
                 </div>
               </div>

               {/* Costos Semestrales - Siempre visible */}
               <div className={`p-4 rounded-lg transition-all duration-200 ${
                 costBreakdown.semestral > 0 
                   ? 'bg-green-50 border border-green-200' 
                   : 'bg-gray-50 border border-gray-200'
               }`}>
                 <div className="flex items-center justify-between mb-2">
                   <div className={`text-sm font-medium ${
                     costBreakdown.semestral > 0 ? 'text-green-800' : 'text-gray-500'
                   }`}>
                     Costos Semestrales
                   </div>
                   <div className={`w-3 h-3 rounded-full ${
                     costBreakdown.semestral > 0 ? 'bg-green-500' : 'bg-gray-300'
                   }`}></div>
                 </div>
                 <div className={`text-2xl font-bold ${
                   costBreakdown.semestral > 0 ? 'text-green-600' : 'text-gray-400'
                 }`}>
                   ${formatCurrency(costBreakdown.semestral)}
                 </div>
                 <div className={`text-xs ${
                   costBreakdown.semestral > 0 ? 'text-green-600' : 'text-gray-400'
                 }`}>
                   {costBreakdown.semestral > 0 ? 'Se pagan cada 6 meses' : 'Sin costos semestrales'}
                 </div>
               </div>

               {/* Costos Anuales - Siempre visible */}
               <div className={`p-4 rounded-lg transition-all duration-200 ${
                 costBreakdown.anual > 0 
                   ? 'bg-purple-50 border border-purple-200' 
                   : 'bg-gray-50 border border-gray-200'
               }`}>
                 <div className="flex items-center justify-between mb-2">
                   <div className={`text-sm font-medium ${
                     costBreakdown.anual > 0 ? 'text-purple-800' : 'text-gray-500'
                   }`}>
                     Costos Anuales
                   </div>
                   <div className={`w-3 h-3 rounded-full ${
                     costBreakdown.anual > 0 ? 'bg-purple-500' : 'bg-gray-300'
                   }`}></div>
                 </div>
                 <div className={`text-2xl font-bold ${
                   costBreakdown.anual > 0 ? 'text-purple-600' : 'text-gray-400'
                 }`}>
                   ${formatCurrency(costBreakdown.anual)}
                 </div>
                 <div className={`text-xs ${
                   costBreakdown.anual > 0 ? 'text-purple-600' : 'text-gray-400'
                 }`}>
                   {costBreakdown.anual > 0 ? 'Se pagan cada año' : 'Sin costos anuales'}
                 </div>
               </div>
             </div>
             
             {/* Leyenda explicativa */}
             <div className="mt-4 pt-4 border-t border-gray-200">
               <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                 <div className="flex items-center space-x-2">
                   <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                   <span>Con costos</span>
                 </div>
                 <div className="flex items-center space-x-2">
                   <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                   <span>Sin costos</span>
                 </div>
               </div>
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
               {/* Mensaje cuando no hay costos */}
               {fields.length === 0 && (
                 <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                   <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                   <h3 className="text-lg font-medium text-gray-900 mb-2">
                     No hay costos fijos agregados
                   </h3>
                   <p className="text-gray-600 mb-4">
                     Haz clic en "Agregar Costo" para comenzar a registrar los costos fijos de tu negocio
                   </p>
                   <button
                     type="button"
                     onClick={addNewCost}
                     className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 mx-auto"
                   >
                     <Plus className="w-4 h-4" />
                     <span>Agregar Primer Costo</span>
                   </button>
                 </div>
               )}
               
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
                            {getCostCategories(costTypes).map((category: any) => (
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
                          {getCostCategories(costTypes).find((c: any) => c.value === watchedCosts[index].category)?.description}
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
                            value={field.value || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Convertir a número o mantener string vacío para validación
                              const numValue = value === '' ? '' : Number(value);
                              field.onChange(numValue);
                            }}
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
                       <span className="text-gray-600">
                         {(() => {
                           const cost = watchedCosts[index];
                           switch (cost.frequency) {
                             case 'mensual':
                               return 'Costo mensual:';
                             case 'semestral':
                               return 'Costo mensual equivalente:';
                             case 'anual':
                               return 'Costo mensual equivalente:';
                             default:
                               return 'Costo mensual equivalente:';
                           }
                         })()}
                       </span>
                       <span className="font-semibold text-gray-900">
                         ${(() => {
                           const cost = watchedCosts[index];
                           if (cost.frequency === 'mensual') return cost.amount;
                           if (cost.frequency === 'semestral') return (cost.amount / 6).toFixed(2);
                           return (cost.amount / 12).toFixed(2);
                         })()}
                       </span>
                     </div>
                     
                     {/* Mostrar también el costo total según la frecuencia */}
                     {watchedCosts[index]?.frequency !== 'mensual' && (
                       <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-gray-200">
                         <span className="text-gray-600">
                           {(() => {
                             const cost = watchedCosts[index];
                             switch (cost.frequency) {
                               case 'semestral':
                                 return 'Costo semestral total:';
                               case 'anual':
                                 return 'Costo anual total:';
                               default:
                                 return 'Costo total:';
                             }
                           })()}
                         </span>
                         <span className="font-semibold text-gray-900">
                           ${watchedCosts[index]?.amount || '0.00'}
                         </span>
                       </div>
                     )}
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
              type="button"
              onClick={() => setShowResultsModal(true)}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Ver Resultados</span>
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
