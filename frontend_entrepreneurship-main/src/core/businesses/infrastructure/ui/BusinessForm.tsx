import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle, FaSave, FaTimes, FaBuilding, FaMapMarkerAlt, FaStore, FaUsers } from "react-icons/fa";
import type { CreateBusinessData } from "../../domain/repositories/IBusinessRepository";
import { CreateBusiness } from "../../application/useCase/CreateBusiness";
import { BusinessRepositoryApi } from "../adapters/BusinessRepositoryApi";
import { SizeRepositoryApi } from "../adapters/SizeRepositoryApi";
import { GetSizes } from "../../application/useCase/GetSizes";
import { VisualSelector } from "../../../../shared/infrastructure/components/VisualSelector";
import { useAuth } from "../../../auth/infrastructure/hooks/useAuth";

// Opciones para el selector de iconos con la estructura correcta
const iconOptions = [
  {
    value: "fas fa-utensils",
    display: <i className="fas fa-utensils text-2xl text-neutral-600"></i>,
    label: "Restaurante"
  },
  {
    value: "fas fa-coffee",
    display: <i className="fas fa-coffee text-2xl text-neutral-600"></i>,
    label: "Cafetería"
  },
  {
    value: "fas fa-tshirt",
    display: <i className="fas fa-tshirt text-2xl text-neutral-600"></i>,
    label: "Tienda de Ropa"
  },
  {
    value: "fas fa-tools",
    display: <i className="fas fa-tools text-2xl text-neutral-600"></i>,
    label: "Ferretería"
  },
  {
    value: "fas fa-pills",
    display: <i className="fas fa-pills text-2xl text-neutral-600"></i>,
    label: "Farmacia"
  },
  {
    value: "fas fa-shopping-cart",
    display: <i className="fas fa-shopping-cart text-2xl text-neutral-600"></i>,
    label: "Supermercado"
  },
  {
    value: "fas fa-cut",
    display: <i className="fas fa-cut text-2xl text-neutral-600"></i>,
    label: "Salón de Belleza"
  },
  {
    value: "fas fa-dumbbell",
    display: <i className="fas fa-dumbbell text-2xl text-neutral-600"></i>,
    label: "Gimnasio"
  },
  {
    value: "fas fa-paw",
    display: <i className="fas fa-paw text-2xl text-neutral-600"></i>,
    label: "Veterinaria"
  },
  {
    value: "fas fa-book",
    display: <i className="fas fa-book text-2xl text-neutral-600"></i>,
    label: "Librería"
  }
];

const colorOptions = [
  { value: "primary-500", display: <div className="w-full h-8 rounded-md bg-primary-500"></div>, label: "Azul Principal" },
  { value: "secondary-500", display: <div className="w-full h-8 rounded-md bg-secondary-500"></div>, label: "Verde Secundario" },
  { value: "accent-500", display: <div className="w-full h-8 rounded-md bg-accent-500"></div>, label: "Naranja Acento" },
  { value: "green-500", display: <div className="w-full h-8 rounded-md bg-green-500"></div>, label: "Verde" },
  { value: "blue-500", display: <div className="w-full h-8 rounded-md bg-blue-500"></div>, label: "Azul" },
  { value: "purple-500", display: <div className="w-full h-8 rounded-md bg-purple-500"></div>, label: "Púrpura" },
  { value: "pink-500", display: <div className="w-full h-8 rounded-md bg-pink-500"></div>, label: "Rosa" },
  { value: "indigo-500", display: <div className="w-full h-8 rounded-md bg-indigo-500"></div>, label: "Índigo" }
];

export function BusinessForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<Omit<CreateBusinessData, "userId">>({
    name: "",
    businessType: "",
    location: "",
    sizeId: 0, // Cambiar a 0 para que no haya un valor por defecto
    icon: iconOptions[0].value,
    color: colorOptions[0].value,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sizes, setSizes] = useState<Array<{sizeId: number, sizeName: string}>>([]);
  const [sizesLoading, setSizesLoading] = useState(true);

  // Cargar tamaños de negocio al montar el componente
  useEffect(() => {
    const loadSizes = async () => {
      try {
        const sizeRepository = new SizeRepositoryApi();
        const getSizesUseCase = new GetSizes(sizeRepository);
        const sizesData = await getSizesUseCase.execute();
        setSizes(sizesData);
        
        // Establecer automáticamente el primer tamaño disponible si no hay uno seleccionado
        if (sizesData.length > 0 && (!formData.sizeId || formData.sizeId === 0)) {
          console.log("🔄 [FRONTEND] Estableciendo primer tamaño automáticamente:", sizesData[0]);
          setFormData(prev => ({ ...prev, sizeId: sizesData[0].sizeId }));
        }
      } catch (error) {
        console.error('Error al cargar tamaños:', error);
        setError('No se pudieron cargar los tamaños de negocio');
      } finally {
        setSizesLoading(false);
      }
    };

    loadSizes();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVisualSelectorChange = (
    name: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!user) {
        throw new Error("Debes estar autenticado para crear un negocio");
      }

      // Validación de campos requeridos
      if (!formData.name.trim()) {
        throw new Error("El nombre del negocio es obligatorio");
      }
      if (!formData.businessType.trim()) {
        throw new Error("El tipo de negocio es obligatorio");
      }
      if (!formData.location.trim()) {
        throw new Error("La ubicación es obligatoria");
      }
      if (!formData.sizeId || formData.sizeId <= 0) {
        throw new Error("Debes seleccionar un tamaño de negocio");
      }
      
      // Verificar que el tamaño seleccionado existe en la lista de tamaños disponibles
      console.log("🔍 [FRONTEND] Validando tamaño seleccionado:");
      console.log("  - formData.sizeId:", formData.sizeId, "tipo:", typeof formData.sizeId);
      console.log("  - sizes disponibles:", sizes);
      console.log("  - sizeId convertido:", Number(formData.sizeId));
      
      const selectedSizeExists = sizes.some(size => size.sizeId === Number(formData.sizeId));
      console.log("  - ¿Existe el tamaño?:", selectedSizeExists);
      
      if (!selectedSizeExists) {
        throw new Error("El tamaño de negocio seleccionado no es válido");
      }

      const businessRepository = new BusinessRepositoryApi();
      const createBusinessUseCase = new CreateBusiness(businessRepository);

      // Asegurar que sizeId sea un número
      const dataToSave: CreateBusinessData = { 
        ...formData, 
        userId: user.usuarioId,
        sizeId: Number(formData.sizeId) // Convertir explícitamente a número
      };

      console.log("🔧 [FRONTEND] Creando negocio:", dataToSave);
      console.log("🔍 [FRONTEND] Verificación de datos del formulario:");
      console.log("  - formData:", formData);
      console.log("  - user.usuarioId:", user.usuarioId);
      console.log("  - dataToSave:", dataToSave);
      console.log("  - sizeId type:", typeof dataToSave.sizeId, "value:", dataToSave.sizeId);
      await createBusinessUseCase.execute(dataToSave);

      console.log("✅ [FRONTEND] Negocio creado exitosamente");
      // Si todo va bien, volvemos a la lista de negocios
      navigate("/businesses");
    } catch (err: any) {
      console.error("❌ [FRONTEND] Error al crear negocio:", err);
      setError(err.message || "Error al crear el negocio");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/businesses"); // Volver a la página anterior
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <FaBuilding className="text-3xl text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-neutral-800 mb-2">
            Crear Nuevo Negocio
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Completa la información de tu negocio para comenzar a gestionar tus costos y optimizar tu emprendimiento.
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaInfoCircle />
              Información del Negocio
            </h2>
            <p className="text-primary-100 mt-1">
              Los datos marcados con * son obligatorios
            </p>
          </div>

          <form onSubmit={handleSave} className="p-8 space-y-8">
            {/* Nombre del Negocio */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-neutral-700 flex items-center gap-2"
              >
                <FaStore className="text-primary-500" />
                Nombre del Negocio *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-lg"
                placeholder="Ej: Cafecito, Mi Restaurante, etc."
                required
              />
            </div>

            {/* Tipo de Negocio */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-700 flex items-center gap-2">
                <FaStore className="text-primary-500" />
                Tipo de Negocio *
              </label>
              <input
                type="text"
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-lg"
                placeholder="Ej: Cafetería, Restaurante, Tienda de Ropa, etc."
                required
              />
            </div>

            {/* Ubicación */}
            <div className="space-y-2">
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-neutral-700 flex items-center gap-2"
              >
                <FaMapMarkerAlt className="text-primary-500" />
                Ubicación *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-lg"
                placeholder="Ej: Quito - Centro, Guayaquil - Norte, etc."
                required
              />
            </div>

            {/* Tamaño del Negocio */}
            <div className="space-y-2">
              <label
                htmlFor="sizeId"
                className="block text-sm font-semibold text-neutral-700 flex items-center gap-2"
              >
                <FaUsers className="text-primary-500" />
                Tamaño del Negocio *
              </label>
              <select
                id="sizeId"
                name="sizeId"
                value={formData.sizeId || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-lg bg-white"
                required
                disabled={sizesLoading}
              >
                {sizesLoading ? (
                  <option value="">Cargando tamaños...</option>
                ) : (
                  <>
                    <option value="">Selecciona un tamaño de negocio</option>
                    {sizes.map((size) => (
                      <option key={size.sizeId} value={size.sizeId}>
                        {size.sizeName}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* Selector de Icono */}
            <VisualSelector
              label="Icono del Negocio"
              name="businessIcon"
              options={iconOptions}
              selectedValue={formData.icon}
              onChange={(value) => handleVisualSelectorChange("icon", value)}
            />

            {/* Selector de Color */}
            <VisualSelector
              label="Color del Negocio"
              name="businessColor"
              options={colorOptions}
              selectedValue={formData.color}
              onChange={(value) => handleVisualSelectorChange("color", value)}
            />

            {/* Mensaje de Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-neutral-200">
              <button
                type="submit"
                disabled={loading || sizesLoading}
                className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-primary-600 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creando Negocio...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Crear Negocio
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-neutral-100 text-neutral-700 font-semibold py-4 px-6 rounded-xl hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FaTimes />
                Cancelar
              </button>
            </div>
          </form>
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800 mb-3 flex items-center gap-2">
            <FaInfoCircle className="text-primary-500" />
            ¿Por qué crear un negocio?
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-neutral-600">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium text-neutral-800">Gestión de Costos</p>
                <p>Analiza y optimiza los costos de tu negocio de manera inteligente</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-secondary-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-neutral-800">Análisis de IA</p>
                <p>Obtén insights y recomendaciones personalizadas para tu negocio</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-accent-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-neutral-800">Plan de Acción</p>
                <p>Recibe un plan de acción detallado para mejorar tu rentabilidad</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
