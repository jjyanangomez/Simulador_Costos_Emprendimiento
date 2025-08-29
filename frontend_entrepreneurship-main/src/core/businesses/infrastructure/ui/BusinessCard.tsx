import { FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { Business } from "../../domain/entities/Business";


interface BusinessCardProps {
  business: Business;
}
 
export function BusinessCard({ business }: BusinessCardProps) {
  const navigate = useNavigate();

  // Función para manejar el clic en el botón de edición/continuar
  const handleContinue = () => {
    // Aquí puedes navegar a la pantalla específica del progreso de este negocio
    // Por ahora, lo dejamos como un log.
    console.log(`Continuar con el negocio: ${business.name}`);

      navigate(`/businesses/${business.id}/learning-path`);
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        {/* Header del negocio */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-neutral-800 text-lg mb-1">
              {/* Nota: El icono y color se manejan mejor con componentes o mapeos */}
              <i className={`${business.icon} text-${business.color} mr-2`}></i>
              <span>{business.businessType}</span> "<span>{business.name}</span>              "
            </h4>
            <p className="text-sm text-neutral-500 flex items-center gap-1">
              <FaMapMarkerAlt />
              Ubicación: <span>{business.location}</span>
            </p>
          </div>
          <div className="flex gap-2">
            {/* Botón de editar */}
            <button
              type="button"
              className="edit-business text-neutral-400 hover:text-blue-500 transition-colors rounded-full hover:bg-blue-50 p-2 flex items-center justify-center h-10 w-10"
              title="Continuar"
              onClick={handleContinue}
            >
              <FaArrowRight size="1.25em" />
            </button>
          </div>
        </div>
      </div>

      {/* Status footer */}
      <div className="bg-neutral-50 px-4 py-3 rounded-b-lg border-t border-neutral-100">
        {/* Indicador de progreso */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700">
            Progreso de aprendizaje
          </span>
          <span className="text-sm text-neutral-500">
            {business.completedModules}/{business.totalModules} módulos
          </span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${business.progress}%` }} // El estilo dinámico se aplica así
          ></div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-neutral-500">
            {business.progress}% completado
          </span>
        </div>
      </div>
    </div>
  );
}
