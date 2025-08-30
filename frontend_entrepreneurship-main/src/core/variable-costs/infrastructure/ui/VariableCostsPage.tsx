import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../../shared/infrastructure/components/MainLayout';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Package, 
  Plus, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Save,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

// Tipo para las validaciones de IA
interface AIValidation {
  type: 'warning' | 'error' | 'success';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'none';
}

const variableCostSchema = z.object({
  products: z.array(z.object({
    name: z.string().min(3, 'El nombre del producto debe tener al menos 3 caracteres'),
    ingredients: z.string().min(1, 'Describe los ingredientes principales'),
    unitOfMeasure: z.string().min(1, 'Selecciona una unidad de medida'),
    portion: z.number().min(0.01, 'La porción debe ser mayor a 0'),
    unitPrice: z.number().min(0.01, 'El precio debe ser mayor a 0'),
    preparationTime: z.number().min(1, 'El tiempo debe ser mayor a 0'),
    staffRequired: z.number().min(1, 'Se requieren al menos 1 persona'),
    additionalCosts: z.number().min(0, 'Los costos adicionales no pueden ser negativos'),
    sellingPrice: z.number().min(0.01, 'El precio de venta debe ser mayor a 0'),
  })).min(3, 'Debes agregar al menos 3 productos').max(5, 'Máximo 5 productos'),
});

type VariableCostForm = z.infer<typeof variableCostSchema>;

const unitMeasures = [
  { value: 'unidad', label: 'Unidad', description: 'Por pieza individual' },
  { value: 'litro', label: 'Litro', description: 'Por litro de producto' },
  { value: 'kilogramo', label: 'Kilogramo', description: 'Por kilogramo de producto' },
  { value: 'libra', label: 'Libra', description: 'Por libra de producto' },
  { value: 'gramo', label: 'Gramo', description: 'Por gramo de producto' },
];

export function VariableCostsPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiValidations, setAiValidations] = useState<Record<number, AIValidation[]>>({});

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<VariableCostForm>({
    resolver: zodResolver(variableCostSchema),
    defaultValues: {
      products: [
        {
          name: 'Hamburguesa Clásica',
          ingredients: 'Pan, carne, lechuga, tomate, queso',
          unitOfMeasure: 'unidad',
          portion: 1,
          unitPrice: 2.50,
          preparationTime: 15,
          staffRequired: 1,
          additionalCosts: 0.30,
          sellingPrice: 8.50,
        },
        {
          name: 'Papas Fritas',
          ingredients: 'Papas, aceite, sal',
          unitOfMeasure: 'porcion',
          portion: 1,
          unitPrice: 1.20,
          preparationTime: 8,
          staffRequired: 1,
          additionalCosts: 0.15,
          sellingPrice: 4.50,
        },
        {
          name: 'Bebida Gaseosa',
          ingredients: 'Refresco, hielo, vaso',
          unitOfMeasure: 'unidad',
          portion: 1,
          unitPrice: 0.80,
          preparationTime: 2,
          staffRequired: 1,
          additionalCosts: 0.10,
          sellingPrice: 3.00,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  const watchedProducts = watch('products');

  const validateProductWithAI = (product: any, index: number) => {
    const validations: AIValidation[] = [];
    
    // Validar margen de ganancia
    const totalCost = product.unitPrice + product.additionalCosts;
    const margin = ((product.sellingPrice - totalCost) / product.sellingPrice) * 100;
    
    if (margin < 20) {
      validations.push({
        type: 'warning',
        message: `El margen de ganancia es bajo (${margin.toFixed(1)}%). Se recomienda al menos 30%`,
        severity: 'medium'
      });
    } else if (margin > 80) {
      validations.push({
        type: 'warning',
        message: `El margen de ganancia es muy alto (${margin.toFixed(1)}%). Verifica que el precio sea competitivo`,
        severity: 'low'
      });
    } else {
      validations.push({
        type: 'success',
        message: `Margen de ganancia óptimo: ${margin.toFixed(1)}%`,
        severity: 'none'
      });
    }

    // Validar tiempo de preparación
    if (product.preparationTime > 30) {
      validations.push({
        type: 'warning',
        message: 'El tiempo de preparación es alto. Considera optimizar el proceso',
        severity: 'medium'
      });
    }

    setAiValidations(prev => ({ ...prev, [index]: validations as AIValidation[] }));
  };

  const addNewProduct = () => {
    if (fields.length < 5) {
      append({
        name: '',
        ingredients: '',
        unitOfMeasure: '',
        portion: 1,
        unitPrice: 0,
        preparationTime: 1,
        staffRequired: 1,
        additionalCosts: 0,
        sellingPrice: 0,
      });
    }
  };

  const onSubmit = async (data: VariableCostForm) => {
    setIsSubmitting(true);
    
    try {
      console.log('Productos:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('¡Productos guardados exitosamente!');
      navigate('/profitability-analysis');
    } catch (error) {
      toast.error('Error al guardar los productos');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Productos Principales y Costos Variables
          </h1>
          <p className="text-lg text-gray-600">
            Define entre 3 y 5 productos principales de tu negocio con sus costos y precios
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Package className="w-5 h-5 mr-2 text-primary-600" />
                Productos Principales
              </h2>
              {fields.length < 5 && (
                <button
                  type="button"
                  onClick={addNewProduct}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Producto</span>
                </button>
              )}
            </div>

            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="border-2 border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Producto #{index + 1}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getValidationIcon(aiValidations[index] || [])}
                      {fields.length > 3 && (
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Producto *
                      </label>
                      <Controller
                        name={`products.${index}.name`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.products?.[index]?.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Ej: Hamburguesa Clásica"
                          />
                        )}
                      />
                      {errors.products?.[index]?.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.products[index]?.name?.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unidad de Medida *
                      </label>
                      <Controller
                        name={`products.${index}.unitOfMeasure`}
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.products?.[index]?.unitOfMeasure ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Selecciona una unidad</option>
                            {unitMeasures.map((unit) => (
                              <option key={unit.value} value={unit.value}>
                                {unit.label}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                      {errors.products?.[index]?.unitOfMeasure && (
                        <p className="mt-1 text-sm text-red-600">{errors.products[index]?.unitOfMeasure?.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio por Unidad (USD) *
                      </label>
                      <Controller
                        name={`products.${index}.unitPrice`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            min="0.01"
                            step="0.01"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.products?.[index]?.unitPrice ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                            onBlur={() => validateProductWithAI(watchedProducts[index], index)}
                          />
                        )}
                      />
                      {errors.products?.[index]?.unitPrice && (
                        <p className="mt-1 text-sm text-red-600">{errors.products[index]?.unitPrice?.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio de Venta (USD) *
                      </label>
                      <Controller
                        name={`products.${index}.sellingPrice`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            min="0.01"
                            step="0.01"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.products?.[index]?.sellingPrice ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                            onBlur={() => validateProductWithAI(watchedProducts[index], index)}
                          />
                        )}
                      />
                      {errors.products?.[index]?.sellingPrice && (
                        <p className="mt-1 text-sm text-red-600">{errors.products[index]?.sellingPrice?.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiempo de Preparación (minutos) *
                      </label>
                      <Controller
                        name={`products.${index}.preparationTime`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            min="1"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.products?.[index]?.preparationTime ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="15"
                          />
                        )}
                      />
                      {errors.products?.[index]?.preparationTime && (
                        <p className="mt-1 text-sm text-red-600">{errors.products[index]?.preparationTime?.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Personal Requerido *
                      </label>
                      <Controller
                        name={`products.${index}.staffRequired`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            min="1"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.products?.[index]?.staffRequired ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="1"
                          />
                        )}
                      />
                      {errors.products?.[index]?.staffRequired && (
                        <p className="mt-1 text-sm text-red-600">{errors.products[index]?.staffRequired?.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ingredientes Principales *
                      </label>
                      <Controller
                        name={`products.${index}.ingredients`}
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            rows={2}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.products?.[index]?.ingredients ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Describe los ingredientes principales..."
                          />
                        )}
                      />
                      {errors.products?.[index]?.ingredients && (
                        <p className="mt-1 text-sm text-red-600">{errors.products[index]?.ingredients?.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Costos Adicionales (USD)
                      </label>
                      <Controller
                        name={`products.${index}.additionalCosts`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="0.00"
                            onBlur={() => validateProductWithAI(watchedProducts[index], index)}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Porción
                      </label>
                      <Controller
                        name={`products.${index}.portion`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            min="0.01"
                            step="0.01"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="1"
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

                  {/* Resumen del producto */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Costo total:</span>
                        <p className="font-semibold text-red-600">
                          ${(watchedProducts[index]?.unitPrice + watchedProducts[index]?.additionalCosts).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Margen:</span>
                        <p className="font-semibold text-green-600">
                          {(() => {
                            const cost = watchedProducts[index]?.unitPrice + watchedProducts[index]?.additionalCosts;
                            const price = watchedProducts[index]?.sellingPrice;
                            if (cost && price) {
                              return (((price - cost) / price) * 100).toFixed(1) + '%';
                            }
                            return '0%';
                          })()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Ganancia:</span>
                        <p className="font-semibold text-blue-600">
                          ${(() => {
                            const cost = watchedProducts[index]?.unitPrice + watchedProducts[index]?.additionalCosts;
                            const price = watchedProducts[index]?.sellingPrice;
                            if (cost && price) {
                              return (price - cost).toFixed(2);
                            }
                            return '0.00';
                          })()}
                        </p>
                      </div>
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
              onClick={() => navigate('/fixed-costs')}
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

function getValidationIcon(validations: any[]) {
  if (validations.length === 0) return null;
  
  const hasError = validations.some(v => v.type === 'error');
  const hasWarning = validations.some(v => v.type === 'warning');
  
  if (hasError) return <AlertTriangle className="w-5 h-5 text-red-500" />;
  if (hasWarning) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
  return <CheckCircle className="w-5 h-4 text-green-500" />;
}
