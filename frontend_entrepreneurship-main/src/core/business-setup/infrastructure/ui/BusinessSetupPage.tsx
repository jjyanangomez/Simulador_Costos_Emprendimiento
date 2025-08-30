import { useState } from 'react';
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
  Save
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

export function BusinessSetupPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const totalInvestment = watchedValues.investmentItems.reduce((sum, item) => sum + item.amount, 0);
  const totalFinancing = watchedValues.ownCapital + watchedValues.loanCapital;

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
  };

  // Función para manejar el cambio de tipo de financiamiento
  const handleFinancingTypeChange = (type: 'personal' | 'prestamo' | 'mixto') => {
    setValue('financingType', type);
    
    // Resetear valores según el tipo
    if (type === 'personal') {
      setValue('loanCapital', 0);
      setValue('interestRate', 0);
    } else if (type === 'prestamo') {
      setValue('ownCapital', 0);
    }
  };

  const onSubmit = async (data: BusinessSetupForm) => {
    setIsSubmitting(true);
    
    try {
      // Aquí se enviarían los datos al backend
      console.log('Datos del negocio:', data);
      
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
                      placeholder="Ej: Av. Amazonas N45-123"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Tamaño y capacidad */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary-600" />
              Tamaño y Capacidad
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
                      <option value="">Selecciona un tamaño</option>
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
                {watchedValues.businessSize && (
                  <p className="mt-2 text-sm text-gray-600">
                    {businessSizes.find(s => s.value === watchedValues.businessSize)?.description}
                  </p>
                )}
              </div>

              {/* Aforo de personas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aforo de Personas *
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
                <label className="block text-sm font-medium text-gray-700 mb-4">
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
                  <label className="block text-sm font-medium text-gray-700">
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
                        <input
                          type="text"
                          placeholder="Ej: Sillas, mesas, equipos..."
                          value={item.description}
                          onChange={(e) => updateInvestmentItem(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div className="w-32">
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
                          ✕
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
                      <p className="font-semibold text-green-600">${watchedValues.ownCapital.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Préstamo:</span>
                      <p className="font-semibold text-blue-600">${watchedValues.loanCapital.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total:</span>
                      <p className="font-semibold text-gray-900">${totalFinancing.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {totalFinancing !== totalInvestment && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                      ⚠️ La suma del capital propio y préstamo debe igualar la inversión total requerida
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

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
