import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../../shared/infrastructure/components/MainLayout';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Building2, 
  Users, 
  DollarSign, 
  ArrowRight,
  Save,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

// Esquema de validación
const businessSetupSchema = z.object({
  businessName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  businessCategory: z.string().min(1, 'Selecciona una categoría'),
  sector: z.string().min(1, 'Selecciona un sector'),
  exactLocation: z.string().optional(),
  businessSize: z.string().min(1, 'Selecciona un tamaño'),
  capacity: z.number().min(1, 'El aforo debe ser mayor a 0'),
  financingType: z.enum(['personal', 'prestamo', 'mixto'], { required_error: 'Selecciona el tipo de financiamiento' }),
  investmentItems: z.array(z.object({
    description: z.string().min(1, 'La descripción es requerida'),
    amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  })).min(1, 'Debes agregar al menos un item de inversión'),
  ownCapital: z.number().min(0, 'El capital propio no puede ser negativo'),
  loanCapital: z.number().min(0, 'El capital prestado no puede ser negativo'),
  interestRate: z.number().min(0, 'La tasa de interés no puede ser negativa'),
});

type BusinessSetupForm = z.infer<typeof businessSetupSchema>;

const businessCategories = [
  { value: 'restaurante', label: 'Restaurante', icon: '🍽️' },
  { value: 'cafeteria', label: 'Cafetería', icon: '☕' },
  { value: 'bar', label: 'Bar', icon: '🍺' },
  { value: 'pizzeria', label: 'Pizzería', icon: '🍕' },
  { value: 'heladeria', label: 'Heladería', icon: '🍦' },
  { value: 'panaderia', label: 'Panadería', icon: '🥖' },
  { value: 'fast-food', label: 'Comida Rápida', icon: '🍔' },
  { value: 'catering', label: 'Catering', icon: '🎉' },
];

const sectors = [
  'Centro Histórico',
  'La Mariscal',
  'La Floresta',
  'Guápulo',
  'Bellavista',
  'Cumbayá',
  'Tumbaco',
  'Valle de los Chillos',
  'San Rafael',
  'Calderón',
  'Carapungo',
  'Pomasqui',
  'San Antonio',
  'Conocoto',
  'Sangolquí',
];

const businessSizes = [
  { value: 'micro', label: 'Microempresa (1-10 empleados)', description: 'Ideal para negocios familiares' },
  { value: 'pequena', label: 'Pequeña empresa (11-50 empleados)', description: 'Negocios en crecimiento' },
  { value: 'mediana', label: 'Mediana empresa (51-200 empleados)', description: 'Negocios establecidos' },
  { value: 'grande', label: 'Gran empresa (200+ empleados)', description: 'Cadenas y franquicias' },
];

// Interfaz para el análisis de IA
interface AIAnalysis {
  isViable: boolean;
  score: number;
  recommendations: string[];
  warnings: string[];
  businessInsights: string[];
  financialHealth: 'good' | 'fair' | 'poor';
  riskLevel: 'low' | 'medium' | 'high';
}

export function BusinessSetupPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  // Función helper para formatear números de manera segura
  const formatCurrency = (value: any): string => {
    const numValue = Number(value || 0);
    return isNaN(numValue) ? '0.00' : numValue.toFixed(2);
  };
  
  // Función para generar análisis de IA
  const generateAIAnalysis = async (data: BusinessSetupForm) => {
    setIsAnalyzing(true);
    
    try {
      // Simular análisis de IA con delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Análisis simulado basado en los datos ingresados
      const analysis: AIAnalysis = {
        isViable: true,
        score: 85,
        recommendations: [] as string[],
        warnings: [] as string[],
        businessInsights: [] as string[],
        financialHealth: 'good',
        riskLevel: 'medium'
      };
      
      // Análisis del nombre del negocio
      if (data.businessName.length < 5) {
        analysis.warnings.push('El nombre del negocio es muy corto. Considera un nombre más descriptivo.');
      }
      
      // Análisis de la ubicación
      if (data.sector === 'Centro Histórico' || data.sector === 'La Mariscal') {
        analysis.businessInsights.push('Excelente ubicación en zona de alto tráfico turístico y comercial.');
        analysis.score += 10;
      }
      
      // Análisis del tamaño vs capacidad
      if (data.businessSize === 'micro' && data.capacity > 30) {
        analysis.warnings.push('La capacidad parece alta para una microempresa. Considera ajustar o cambiar el tamaño.');
        analysis.score -= 5;
      }
      
      // Análisis financiero
      if (data.financingType === 'mixto') {
        analysis.businessInsights.push('Financiamiento mixto es una estrategia inteligente para distribuir riesgos.');
        analysis.score += 5;
      }
      
      if (data.interestRate > 15) {
        analysis.warnings.push('La tasa de interés es alta. Considera negociar mejores condiciones.');
        analysis.score -= 10;
      }
      
      // Análisis de inversión
      const avgInvestmentPerPerson = data.investmentItems.reduce((sum, item) => sum + item.amount, 0) / data.capacity;
      if (avgInvestmentPerPerson > 1000) {
        analysis.businessInsights.push('Inversión por persona alta, indica un negocio premium.');
        analysis.score += 5;
      } else if (avgInvestmentPerPerson < 200) {
        analysis.warnings.push('Inversión por persona baja. Verifica que cubra todos los costos necesarios.');
        analysis.score -= 5;
      }
      
      // Determinar viabilidad
      if (analysis.score < 70) {
        analysis.isViable = false;
        analysis.riskLevel = 'high';
      } else if (analysis.score < 80) {
        analysis.riskLevel = 'medium';
      } else {
        analysis.riskLevel = 'low';
      }
      
      // Generar recomendaciones específicas
      if (data.businessCategory === 'restaurante') {
        analysis.recommendations.push('Considera implementar un sistema de reservas online.');
        analysis.recommendations.push('Evalúa la posibilidad de delivery para aumentar ingresos.');
      }
      
      if (data.financingType === 'prestamo') {
        analysis.recommendations.push('Asegúrate de tener un plan de pago claro para el préstamo.');
        analysis.recommendations.push('Considera un fondo de emergencia para cubrir pagos en meses difíciles.');
      }
      
      setAiAnalysis(analysis);
      setShowAnalysis(true);
      
    } catch (error) {
      console.error('Error en análisis de IA:', error);
      toast.error('Error al generar el análisis de IA');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm<BusinessSetupForm>({
    resolver: zodResolver(businessSetupSchema),
    defaultValues: {
      businessName: '',
      businessCategory: '',
      sector: '',
      exactLocation: '',
      businessSize: '',
      capacity: 50,
      financingType: 'personal',
      investmentItems: [{ description: '', amount: 0 }],
      ownCapital: 0,
      loanCapital: 0,
      interestRate: 8.5,
    },
  });

  const watchedValues = watch();
  const totalInvestment = watchedValues.investmentItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  
  // Calcular el total del préstamo incluyendo intereses
  const loanWithInterest = Number(watchedValues.loanCapital || 0) * (1 + (Number(watchedValues.interestRate || 0) / 100));
  
  // El total de financiamiento es capital propio + préstamo con intereses
  const totalFinancing = Number(watchedValues.ownCapital || 0) + loanWithInterest;
  
  // Para validación: solo capital propio + capital prestado (sin intereses)
  const totalCapitalForValidation = Number(watchedValues.ownCapital || 0) + Number(watchedValues.loanCapital || 0);

  // Sincronizar automáticamente los valores de financiamiento cuando cambie la inversión total
  useEffect(() => {
    if (totalInvestment > 0) {
      if (watchedValues.financingType === 'personal') {
        setValue('ownCapital', totalInvestment);
        setValue('loanCapital', 0);
      } else if (watchedValues.financingType === 'prestamo') {
        setValue('ownCapital', 0);
        // El capital prestado debe ser igual a la inversión requerida (sin intereses)
        setValue('loanCapital', totalInvestment);
      } else if (watchedValues.financingType === 'mixto') {
        // Mantener la proporción actual si ya hay valores, o distribuir equitativamente
        const currentTotal = (watchedValues.ownCapital || 0) + (watchedValues.loanCapital || 0);
        if (currentTotal === 0) {
          const mitad = totalInvestment / 2;
          setValue('ownCapital', mitad);
          setValue('loanCapital', mitad);
        }
      }
    }
  }, [totalInvestment, watchedValues.financingType, setValue]);

  // Función para agregar un nuevo item de inversión
  const addInvestmentItem = () => {
    const newItems = [...watchedValues.investmentItems, { description: '', amount: 0 }];
    setValue('investmentItems', newItems);
  };

  // Función para eliminar un item de inversión
  const removeInvestmentItem = (index: number) => {
    if (watchedValues.investmentItems.length > 1) {
      const newItems = watchedValues.investmentItems.filter((_, i) => i !== index);
      setValue('investmentItems', newItems);
    }
  };

  // Función para actualizar un item de inversión
  const updateInvestmentItem = (index: number, field: 'description' | 'amount', value: string | number) => {
    const newItems = [...watchedValues.investmentItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setValue('investmentItems', newItems);
    
    // Si es préstamo bancario, actualizar automáticamente el capital prestado
    if (field === 'amount' && watchedValues.financingType === 'prestamo') {
      const newTotal = newItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      setValue('loanCapital', newTotal);
    }
  };

  // Función para manejar el cambio de tipo de financiamiento
  const handleFinancingTypeChange = (type: 'personal' | 'prestamo' | 'mixto') => {
    setValue('financingType', type);
    
    // Resetear valores según el tipo
    if (type === 'personal') {
      setValue('loanCapital', 0);
      setValue('interestRate', 0);
      // Si es personal, el capital propio debe igualar la inversión total
      if (totalInvestment > 0) {
        setValue('ownCapital', totalInvestment);
      }
    } else if (type === 'prestamo') {
      setValue('ownCapital', 0);
      // Si es préstamo, el capital prestado debe igualar la inversión total (sin intereses)
      if (totalInvestment > 0) {
        setValue('loanCapital', totalInvestment);
      }
    } else if (type === 'mixto') {
      // Si es mixto, distribuir equitativamente o dejar que el usuario ajuste
      if (totalInvestment > 0) {
        const mitad = totalInvestment / 2;
        setValue('ownCapital', mitad);
        setValue('loanCapital', mitad);
      }
    }
  };

  const onSubmit = async (data: BusinessSetupForm) => {
    // Si no hay análisis de IA, generarlo primero
    if (!aiAnalysis) {
      await generateAIAnalysis(data);
      return;
    }
    
    // Si el análisis no es viable, no permitir continuar
    if (!aiAnalysis.isViable) {
      toast.error('El análisis de IA indica que el negocio no es viable. Revisa las recomendaciones.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Aquí se enviarían los datos al backend
      console.log('Datos del negocio:', data);
      console.log('Análisis de IA:', aiAnalysis);
      
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('¡Configuración del negocio guardada exitosamente!');
      
      // Navegar al siguiente paso
      navigate('/fixed-costs');
    } catch (error) {
      toast.error('Error al guardar la configuración');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Configuración del Negocio
          </h1>
          <p className="text-lg text-gray-600">
            Define los datos básicos de tu negocio de alimentos y bebidas
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Información básica */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-primary-600" />
              Información Básica
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Nombre del negocio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Negocio *
                </label>
                <Controller
                  name="businessName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.businessName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ej: La Buena Mesa"
                    />
                  )}
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
                )}
              </div>

              {/* Categoría del negocio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría del Negocio *
                </label>
                <Controller
                  name="businessCategory"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.businessCategory ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecciona una categoría</option>
                      {businessCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.businessCategory && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessCategory.message}</p>
                )}
              </div>

              {/* Sector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sector en Quito *
                </label>
                <Controller
                  name="sector"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.sector ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecciona un sector</option>
                      {sectors.map((sector) => (
                        <option key={sector} value={sector}>
                          {sector}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.sector && (
                  <p className="mt-1 text-sm text-red-600">{errors.sector.message}</p>
                )}
              </div>

              {/* Ubicación exacta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación Exacta (Opcional)
                </label>
                <Controller
                  name="exactLocation"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ej: Av. Amazonas y Naciones Unidas"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Características del negocio */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary-600" />
              Características del Negocio
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Tamaño del negocio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño del Negocio *
                </label>
                <Controller
                  name="businessSize"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.businessSize ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecciona el tamaño</option>
                      {businessSizes.map((size) => (
                        <option key={size.value} value={size.value}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.businessSize && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessSize.message}</p>
                )}
              </div>

              {/* Capacidad/Aforo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacidad/Aforo (personas) *
                </label>
                <Controller
                  name="capacity"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      min="1"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.capacity ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="50"
                    />
                  )}
                />
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información financiera */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
              Información Financiera
            </h2>

            <div className="space-y-6">
              {/* Tipo de financiamiento */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-4">
                  Tipo de Financiamiento *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="financingType"
                      value="personal"
                      checked={watchedValues.financingType === 'personal'}
                      onChange={() => handleFinancingTypeChange('personal')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Capital Personal/Propio</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="financingType"
                      value="prestamo"
                      checked={watchedValues.financingType === 'prestamo'}
                      onChange={() => handleFinancingTypeChange('prestamo')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Préstamo Bancario</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="financingType"
                      value="mixto"
                      checked={watchedValues.financingType === 'mixto'}
                      onChange={() => handleFinancingTypeChange('mixto')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Mixto (Personal + Préstamo)</span>
                  </label>
                </div>
                {errors.financingType && (
                  <p className="mt-1 text-sm text-red-600">{errors.financingType.message}</p>
                )}
              </div>

              {/* Items de inversión */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-base font-semibold text-gray-700">
                    Items de Inversión *
                  </label>
                  <button
                    type="button"
                    onClick={addInvestmentItem}
                    className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    + Agregar Item
                  </button>
                </div>

                <div className="space-y-3">
                  {watchedValues.investmentItems.map((item, index) => (
                    <div key={index} className="flex space-x-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Sillas, mesas, equipos..."
                          value={item.description}
                          onChange={(e) => updateInvestmentItem(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Precio
                        </label>
                        <input
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          value={item.amount}
                          onChange={(e) => updateInvestmentItem(index, 'amount', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                                             {watchedValues.investmentItems.length > 1 && (
                         <button
                           type="button"
                           onClick={() => removeInvestmentItem(index)}
                           className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                         )}
                    </div>
                  ))}
                </div>

                {errors.investmentItems && (
                  <p className="mt-1 text-sm text-red-600">{errors.investmentItems.message}</p>
                )}
              </div>

              {/* Resumen de la inversión total */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Resumen de la Inversión</h3>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    ${totalInvestment.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Inversión Total Requerida</p>
                </div>
              </div>

              {/* Desglose del financiamiento */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capital Propio (USD)
                  </label>
                  <Controller
                    name="ownCapital"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="0"
                        step="0.01"
                        disabled={watchedValues.financingType === 'prestamo'}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          watchedValues.financingType === 'prestamo' ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                        placeholder="0"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capital por Préstamo (USD)
                  </label>
                  <Controller
                    name="loanCapital"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="0"
                        step="0.01"
                        disabled={watchedValues.financingType === 'personal'}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          watchedValues.financingType === 'personal' ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                        placeholder="0"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Tasa de interés */}
              {watchedValues.financingType !== 'personal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tasa de Interés Anual (%) *
                  </label>
                  <Controller
                    name="interestRate"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="0"
                        step="0.1"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.interestRate ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="8.5"
                      />
                    )}
                  />
                  {errors.interestRate && (
                    <p className="mt-1 text-sm text-red-600">{errors.interestRate.message}</p>
                  )}
                </div>
              )}

              {/* Validación del financiamiento */}
              {totalInvestment > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Validación del Financiamiento</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Capital Propio:</span>
                      <p className="font-semibold text-green-600">${(watchedValues.ownCapital || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Préstamo:</span>
                      <p className="font-semibold text-blue-600">${(watchedValues.loanCapital || 0).toLocaleString()}</p>
                    </div>
                                         <div>
                       <span className="text-gray-600">Total:</span>
                       <p className="font-semibold text-gray-900">${formatCurrency(totalFinancing)}</p>
                     </div>
                  </div>
                  
                                     {/* Mostrar información adicional para préstamos */}
                   {watchedValues.financingType === 'prestamo' && watchedValues.loanCapital > 0 && (
                     <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <span className="text-blue-700 font-medium">Capital Prestado:</span>
                           <p className="font-semibold text-blue-600">${(watchedValues.loanCapital || 0).toLocaleString()}</p>
                         </div>
                         <div>
                           <span className="text-blue-700 font-medium">Intereses ({watchedValues.interestRate || 0}%):</span>
                           <p className="font-semibold text-blue-600">${((watchedValues.loanCapital || 0) * ((watchedValues.interestRate || 0) / 100)).toLocaleString()}</p>
                         </div>
                       </div>
                                                                                                 <div className="mt-2 pt-2 border-t border-blue-200">
                            <span className="text-blue-700 font-medium">Total a Pagar:</span>
                            <p className="font-semibold text-blue-800">${formatCurrency(loanWithInterest)}</p>
                          </div>
                     </div>
                   )}
                   
                   {/* Mostrar información adicional para financiamiento mixto */}
                   {watchedValues.financingType === 'mixto' && watchedValues.loanCapital > 0 && (
                     <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded text-sm">
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <span className="text-purple-700 font-medium">Capital Propio:</span>
                           <p className="font-semibold text-green-600">${(watchedValues.ownCapital || 0).toLocaleString()}</p>
                         </div>
                         <div>
                           <span className="text-purple-700 font-medium">Capital Prestado:</span>
                           <p className="font-semibold text-blue-600">${(watchedValues.loanCapital || 0).toLocaleString()}</p>
                         </div>
                       </div>
                       <div className="mt-2 grid grid-cols-2 gap-4">
                         <div>
                           <span className="text-purple-700 font-medium">Intereses ({watchedValues.interestRate || 0}%):</span>
                           <p className="font-semibold text-blue-600">${((watchedValues.loanCapital || 0) * ((watchedValues.interestRate || 0) / 100)).toLocaleString()}</p>
                         </div>
                         <div>
                           <span className="text-purple-700 font-medium">Total a Pagar:</span>
                           <p className="font-semibold text-purple-800">${formatCurrency(totalFinancing)}</p>
                         </div>
                       </div>
                       <div className="mt-2 pt-2 border-t border-purple-200 text-center">
                         <span className="text-purple-700 font-medium">Resumen:</span>
                         <p className="text-sm text-purple-600">
                           Capital inicial: ${formatCurrency(totalCapitalForValidation)} | 
                           Total con intereses: ${formatCurrency(totalFinancing)}
                         </p>
                       </div>
                     </div>
                   )}
                  
                  {/* Validación principal */}
                  {watchedValues.financingType === 'personal' && totalFinancing !== totalInvestment && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                      ⚠️ El capital propio debe igualar la inversión total requerida
                    </div>
                  )}
                  
                  {watchedValues.financingType === 'prestamo' && (watchedValues.loanCapital || 0) !== totalInvestment && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                      ⚠️ El capital prestado debe igualar la inversión total requerida (${totalInvestment.toLocaleString()})
                    </div>
                  )}
                  
                  {watchedValues.financingType === 'mixto' && totalCapitalForValidation !== totalInvestment && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                      ⚠️ La suma del capital propio (${(watchedValues.ownCapital || 0).toLocaleString()}) y capital prestado (${(watchedValues.loanCapital || 0).toLocaleString()}) = ${totalCapitalForValidation.toLocaleString()}, debe igualar la inversión total requerida (${totalInvestment.toLocaleString()})
                    </div>
                  )}
                  
                  {/* Mensaje de éxito */}
                  {((watchedValues.financingType === 'personal' && (watchedValues.ownCapital || 0) === totalInvestment) ||
                    (watchedValues.financingType === 'prestamo' && (watchedValues.loanCapital || 0) === totalInvestment) ||
                    (watchedValues.financingType === 'mixto' && totalCapitalForValidation === totalInvestment)) && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                      ✅ Financiamiento válido: La suma coincide con la inversión total requerida
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

                     {/* Análisis de IA */}
           {showAnalysis && aiAnalysis && (
             <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                   <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                     <span className="text-white text-sm font-bold">AI</span>
                   </div>
                   Análisis de Inteligencia Artificial
                 </h3>
                 <div className="flex items-center space-x-2">
                   <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                     aiAnalysis.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                     aiAnalysis.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                     'bg-red-100 text-red-800'
                   }`}>
                     Riesgo: {aiAnalysis.riskLevel === 'low' ? 'Bajo' : aiAnalysis.riskLevel === 'medium' ? 'Medio' : 'Alto'}
                   </span>
                   <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                     aiAnalysis.financialHealth === 'good' ? 'bg-green-100 text-green-800' :
                     aiAnalysis.financialHealth === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                     'bg-red-100 text-red-800'
                   }`}>
                     Salud Financiera: {aiAnalysis.financialHealth === 'good' ? 'Buena' : aiAnalysis.financialHealth === 'fair' ? 'Regular' : 'Mala'}
                   </span>
                 </div>
               </div>
               
               {/* Puntuación */}
               <div className="text-center mb-6">
                 <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold">
                   {aiAnalysis.score}
                 </div>
                 <p className="text-sm text-gray-600 mt-2">Puntuación de Viabilidad</p>
               </div>
               
               {/* Resultado principal */}
               <div className={`text-center p-4 rounded-lg mb-6 ${
                 aiAnalysis.isViable ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
               }`}>
                 <h4 className={`text-lg font-semibold ${
                   aiAnalysis.isViable ? 'text-green-800' : 'text-red-800'
                 }`}>
                   {aiAnalysis.isViable ? '✅ Negocio Viable' : '❌ Negocio No Viable'}
                 </h4>
                 <p className={`text-sm ${
                   aiAnalysis.isViable ? 'text-green-700' : 'text-red-700'
                 }`}>
                   {aiAnalysis.isViable 
                     ? 'El análisis indica que tu negocio tiene buenas posibilidades de éxito.'
                     : 'Se requieren ajustes para mejorar la viabilidad del negocio.'
                   }
                 </p>
               </div>
               
               {/* Detalles del análisis */}
               <div className="grid md:grid-cols-2 gap-6">
                 {/* Insights positivos */}
                 {aiAnalysis.businessInsights.length > 0 && (
                   <div>
                     <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                       <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                       Aspectos Positivos
                     </h4>
                     <ul className="space-y-2">
                       {aiAnalysis.businessInsights.map((insight, index) => (
                         <li key={index} className="text-sm text-green-700 flex items-start">
                           <span className="text-green-500 mr-2">•</span>
                           {insight}
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
                 
                 {/* Advertencias */}
                 {aiAnalysis.warnings.length > 0 && (
                   <div>
                     <h4 className="font-semibold text-yellow-700 mb-3 flex items-center">
                       <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                       Advertencias
                     </h4>
                     <ul className="space-y-2">
                       {aiAnalysis.warnings.map((warning, index) => (
                         <li key={index} className="text-sm text-yellow-700 flex items-start">
                           <span className="text-yellow-500 mr-2">•</span>
                           {warning}
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
               </div>
               
               {/* Recomendaciones */}
               {aiAnalysis.recommendations.length > 0 && (
                 <div className="mt-6">
                   <h4 className="font-semibold text-blue-700 mb-3 flex items-center">
                     <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                     Recomendaciones
                   </h4>
                   <ul className="space-y-2">
                     {aiAnalysis.recommendations.map((recommendation, index) => (
                       <li key={index} className="text-sm text-blue-700 flex items-start">
                         <span className="text-blue-500 mr-2">•</span>
                         {recommendation}
                       </li>
                     ))}
                   </ul>
                 </div>
               )}
               
               {/* Botón para regenerar análisis */}
               <div className="mt-6 text-center">
                 <button
                   type="button"
                   onClick={() => generateAIAnalysis(watchedValues)}
                   disabled={isAnalyzing}
                   className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                 >
                   {isAnalyzing ? 'Regenerando...' : '🔄 Regenerar Análisis'}
                 </button>
               </div>
             </div>
           )}
           
           {/* Botones de acción */}
           <div className="flex justify-between items-center pt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Volver al Dashboard
            </button>
            
                         <button
               type="submit"
               disabled={!isValid || isSubmitting || isAnalyzing}
               className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
             >
               {isSubmitting ? (
                 <>
                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                   <span>Guardando...</span>
                 </>
               ) : isAnalyzing ? (
                 <>
                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                   <span>Analizando con IA...</span>
                 </>
               ) : !aiAnalysis ? (
                 <>
                   <div className="w-4 h-4 mr-2">🤖</div>
                   <span>Analizar con IA</span>
                   <ArrowRight className="w-4 h-4" />
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
