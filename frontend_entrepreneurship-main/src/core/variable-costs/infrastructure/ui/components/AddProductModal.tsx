import { useState, useEffect } from 'react';
import { X, Plus, Trash2, ChefHat, ShoppingBag, Edit, Save } from 'lucide-react';
import type { Ingredient, Product } from '../../../domain/types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  editingProduct?: Product | null;
}

const unitMeasures = [
  { value: 'unidad', label: 'Unidad', description: 'Por pieza individual' },
  { value: 'litro', label: 'Litro', description: 'Por litro de producto' },
  { value: 'kilogramo', label: 'Kilogramo', description: 'Por kilogramo de producto' },
  { value: 'libra', label: 'Libra', description: 'Por libra de producto' },
  { value: 'gramo', label: 'Gramo', description: 'Por gramo de producto' },
  { value: 'cualquiera', label: 'Cualquiera', description: 'Otra unidad de medida' },
];

export function AddProductModal({ isOpen, onClose, onSave, editingProduct }: AddProductModalProps) {
  const [productType, setProductType] = useState<'recipe' | 'resale' | null>(null);
  const [productName, setProductName] = useState('');
  const [preparationTime, setPreparationTime] = useState(0);
  const [staffRequired, setStaffRequired] = useState(1);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState<Partial<Ingredient>>({});
  const [showIngredientForm, setShowIngredientForm] = useState(false);
  const [editingIngredientIndex, setEditingIngredientIndex] = useState<number | null>(null);
  const [resaleCost, setResaleCost] = useState(0);

  // Inicializar datos si estamos editando
  useEffect(() => {
    if (editingProduct) {
      setProductType(editingProduct.type);
      setProductName(editingProduct.name);
      setPreparationTime(editingProduct.preparationTime || 0);
      setStaffRequired(editingProduct.staffRequired || 1);
      setIngredients(editingProduct.ingredients || []);
      setResaleCost(editingProduct.resaleCost || 0);
    }
  }, [editingProduct]);

  const resetForm = () => {
    setProductType(null);
    setProductName('');
    setPreparationTime(0);
    setStaffRequired(1);
    setIngredients([]);
    setCurrentIngredient({});
    setShowIngredientForm(false);
    setEditingIngredientIndex(null);
    setResaleCost(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const showAddIngredientForm = () => {
    setShowIngredientForm(true);
    setCurrentIngredient({});
    setEditingIngredientIndex(null);
  };

  const cancelIngredientForm = () => {
    setShowIngredientForm(false);
    setCurrentIngredient({});
    setEditingIngredientIndex(null);
  };

  const editIngredient = (ingredient: Ingredient, index: number) => {
    setCurrentIngredient(ingredient);
    setEditingIngredientIndex(index);
    setShowIngredientForm(true);
  };

  const saveIngredient = () => {
    if (currentIngredient.name && currentIngredient.unitOfMeasure && currentIngredient.unitPrice) {
      const newIngredient: Ingredient = {
        name: currentIngredient.name,
        unitOfMeasure: currentIngredient.unitOfMeasure,
        portion: currentIngredient.portion || 0,
        portionsObtained: currentIngredient.unitOfMeasure === 'unidad' ? currentIngredient.portionsObtained : undefined,
        unitPrice: currentIngredient.unitPrice,
        preparationTime: currentIngredient.preparationTime || 0,
        staffRequired: currentIngredient.staffRequired || 1,
      };

      if (editingIngredientIndex !== null) {
        // Actualizar ingrediente existente
        const updatedIngredients = [...ingredients];
        updatedIngredients[editingIngredientIndex] = newIngredient;
        setIngredients(updatedIngredients);
      } else {
        // Agregar nuevo ingrediente
        setIngredients([...ingredients, newIngredient]);
      }

      // Limpiar formulario y ocultar
      setCurrentIngredient({});
      setShowIngredientForm(false);
      setEditingIngredientIndex(null);
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!productType || !productName) return;

    const product: Product = {
      id: editingProduct?.id || Date.now().toString(),
      type: productType,
      name: productName,
      ...(productType === 'recipe' && {
        ingredients,
        preparationTime,
        staffRequired,
      }),
      ...(productType === 'resale' && {
        resaleCost,
      }),
    };

    onSave(product);
    handleClose();
  };

  // Calcular costo total de ingredientes
  const calculateTotalCost = () => {
    return ingredients.reduce((total, ingredient) => {
      const costPerPortion = ingredient.unitPrice / (ingredient.portionsObtained || 1);
      return total + (costPerPortion * ingredient.portion);
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Selección de tipo de producto */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipo de Producto</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setProductType('recipe')}
              className={`p-4 border-2 rounded-lg flex items-center space-x-3 transition-colors ${
                productType === 'recipe'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-300 hover:border-primary-300'
              }`}
            >
              <ChefHat className="w-6 h-6" />
              <div className="text-left">
                <p className="font-semibold">Producto de Preparación</p>
                <p className="text-sm text-gray-600">Receta con ingredientes</p>
              </div>
            </button>
            <button
              onClick={() => setProductType('resale')}
              className={`p-4 border-2 rounded-lg flex items-center space-x-3 transition-colors ${
                productType === 'resale'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-300 hover:border-primary-300'
              }`}
            >
              <ShoppingBag className="w-6 h-6" />
              <div className="text-left">
                <p className="font-semibold">Producto de Reventa</p>
                <p className="text-sm text-gray-600">Producto comprado y vendido</p>
              </div>
            </button>
          </div>
        </div>

        {productType && (
          <div className="space-y-6">
            {/* Información básica del producto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ej: Hamburguesa Clásica"
                />
              </div>
              {productType === 'recipe' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo Total de Ingredientes
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                    <span className="text-lg font-semibold text-red-600">
                      ${calculateTotalCost().toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
              {productType === 'resale' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo del Producto (USD) *
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={resaleCost}
                    onChange={(e) => setResaleCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="2.25"
                  />
                </div>
              )}
            </div>

            {/* Campos específicos para producto de preparación */}
            {productType === 'recipe' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiempo de Preparación (minutos)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={preparationTime}
                      onChange={(e) => setPreparationTime(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Personal Requerido
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={staffRequired}
                      onChange={(e) => setStaffRequired(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* Sección de ingredientes */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Ingredientes</h3>
                    {!showIngredientForm && (
                      <button
                        onClick={showAddIngredientForm}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Agregar Ingrediente</span>
                      </button>
                    )}
                  </div>
                  
                  {/* Lista de ingredientes agregados */}
                  {ingredients.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {ingredients.map((ingredient, index) => {
                        const costPerPortion = ingredient.unitPrice / (ingredient.portionsObtained || 1);
                        const totalCost = costPerPortion * ingredient.portion;
                        
                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium">{ingredient.name}</p>
                              <p className="text-sm text-gray-600">
                                {ingredient.portion} {ingredient.unitOfMeasure}
                                {ingredient.portionsObtained && ` (${ingredient.portionsObtained} porciones)`}
                                {' - $'}{ingredient.unitPrice} por unidad
                                {' - Costo: $'}{totalCost.toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => editIngredient(ingredient, index)}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeIngredient(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Formulario para agregar/editar ingrediente */}
                  {showIngredientForm && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">
                        {editingIngredientIndex !== null ? 'Editar Ingrediente' : 'Agregar Ingrediente'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Ingrediente
                          </label>
                          <input
                            type="text"
                            value={currentIngredient.name || ''}
                            onChange={(e) => setCurrentIngredient({...currentIngredient, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Ej: Tomate"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unidad de Medida
                          </label>
                          <select
                            value={currentIngredient.unitOfMeasure || ''}
                            onChange={(e) => setCurrentIngredient({...currentIngredient, unitOfMeasure: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            <option value="">Seleccionar</option>
                            {unitMeasures.map((unit) => (
                              <option key={unit.value} value={unit.value}>
                                {unit.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Porción Utilizada
                          </label>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={currentIngredient.portion || ''}
                            onChange={(e) => setCurrentIngredient({...currentIngredient, portion: parseFloat(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="0.5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Precio por Unidad (USD)
                          </label>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={currentIngredient.unitPrice || ''}
                            onChange={(e) => setCurrentIngredient({...currentIngredient, unitPrice: parseFloat(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="0.80"
                          />
                        </div>
                      </div>

                      {/* Campos adicionales para unidad específica */}
                      {currentIngredient.unitOfMeasure === 'unidad' && (
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Porciones Obtenidas de la Unidad
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={currentIngredient.portionsObtained || ''}
                            onChange={(e) => setCurrentIngredient({...currentIngredient, portionsObtained: parseInt(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="5"
                          />
                        </div>
                      )}

                      {/* Mostrar cálculo en tiempo real */}
                      {currentIngredient.unitPrice && currentIngredient.portion && (
                        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm text-blue-800">
                            Costo calculado: $
                            {(() => {
                              const costPerPortion = currentIngredient.unitPrice / (currentIngredient.portionsObtained || 1);
                              return (costPerPortion * currentIngredient.portion).toFixed(2);
                            })()}
                          </p>
                        </div>
                      )}

                      {/* Botones de acción del ingrediente */}
                      <div className="mt-4 flex justify-end space-x-3">
                        <button
                          onClick={cancelIngredientForm}
                          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={saveIngredient}
                          disabled={!currentIngredient.name || !currentIngredient.unitOfMeasure || !currentIngredient.unitPrice}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>{editingIngredientIndex !== null ? 'Actualizar' : 'Guardar'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Botones de acción del producto */}
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
          <button
            onClick={handleClose}
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!productType || !productName || (productType === 'resale' && resaleCost <= 0)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {editingProduct ? 'Actualizar Producto' : 'Guardar Producto'}
          </button>
        </div>
      </div>
    </div>
  );
}
