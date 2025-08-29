import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaPlus } from "react-icons/fa";
import type { Business } from "../../domain/entities/Business";
import { GetBusinessesByUser } from "../../application/useCase/GetBusinessesByUser";
import { BusinessRepositoryApi } from "../adapters/BusinessRepositoryApi";
import { BusinessList } from "./BusinessList";
import { ModuleHeader } from "../../../../shared/infrastructure/components/Header";
import { useApiState } from "../../../../shared/infrastructure/hooks/useApiState";
import { useAuth } from "../../../auth/infrastructure/hooks/useAuth";

export function BusinessesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: businesses, loading: isLoading, error, execute } = useApiState<Business[]>([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!user) {
        console.log('❌ [FRONTEND-PAGE] Usuario no autenticado');
        return;
      }

      console.log('🔄 [FRONTEND-PAGE] Iniciando carga de negocios para usuario:', user.usuarioId);
      
      const businessRepository = new BusinessRepositoryApi();
      const getBusinessesByUserUseCase = new GetBusinessesByUser(businessRepository);
      
      console.log('📋 [FRONTEND-PAGE] Caso de uso creado, ejecutando...');
      
      const result = await execute(() => getBusinessesByUserUseCase.execute(user.usuarioId));
      
      console.log('✅ [FRONTEND-PAGE] Carga de negocios completada:', result);
    };

    fetchBusinesses();
  }, [execute, user]);

  const handleAddBusiness = () => {
    navigate("/businesses/new");
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center text-neutral-500 h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p>Cargando negocios...</p>
          </div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary-500 hover:text-primary-600 underline"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      );
    }
    return <BusinessList businesses={businesses || []} />;
  };

  return (
    <>
      <ModuleHeader title="Mis Negocios" userName={user?.nombreCompleto || "Usuario"} />
      <div className="flex flex-col flex-grow h-full items-center justify-center p-4 bg-neutral-50">
        <div className="bg-white rounded-brand shadow-brand-lg p-6 sm:p-8 w-full max-w-4xl">
          <header className="pb-4 border-b border-neutral-200">
            <h2 className="text-3xl font-bold text-neutral-800 flex items-center gap-3">
              <FaBriefcase className="text-primary-500" />
              <span>Negocios Registrados</span>
            </h2>
          </header>

          <div className="mt-8">
            <div className="overflow-y-auto h-[45vh] border bg-neutral-50 p-4 rounded-brand mb-8">
              {renderContent()}
            </div>
            <div className="flex justify-end w-full">
              <button
                onClick={handleAddBusiness}
                className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded-brand transition-transform hover:scale-105 shadow-sm flex items-center gap-2"
              >
                <FaPlus />
                Añadir Negocio
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
