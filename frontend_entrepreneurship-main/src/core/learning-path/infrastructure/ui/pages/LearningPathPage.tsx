// Fichero: src/core/learning-path/ui/pages/LearningPathPage.tsx
import React, { useEffect, useState } from 'react';
import type { Module } from '../../../domain/entities/Module';
import { LearningPathRepositoryApi } from '../../adapters/LearningPathRepositoryApi';
import { GetLearningPath } from '../../../application/useCase/GetLearningPath';
import { LearningPathGrid } from '../components/LearningPathGrid';
import { StatusLegend } from '../components/StatusLegend';
import { ModuleHeader } from '../../../../../shared/infrastructure/components/Header';
import { useAuth } from '../../../../auth/infrastructure/hooks/useAuth';
import { Link, useParams } from 'react-router-dom';



/**
 * Componente de Página Principal.
 * Instancia las dependencias y ejecuta el caso de uso para mostrar los datos.
 */
export const LearningPathPage: React.FC = () => {
    // El nombre 'businessId' debe coincidir con el que definiste en routes.ts (':businessId')
    const { businessId } = useParams<{ businessId: string }>();
    const { user } = useAuth();

    const [modules, setModules] = useState<Module[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        // 👇 3. USA EL 'businessId' PARA CARGAR LOS DATOS
        if (!businessId) {
            setError("No se ha especificado un ID de negocio.");
            setIsLoading(false);
            return; // Detiene la ejecución si no hay ID
        }

        const learningPathRepository = new LearningPathRepositoryApi();
        const getLearningPathUseCase = new GetLearningPath(learningPathRepository);

        const fetchModules = async () => {
            try {
                setIsLoading(true);
                // Usar el businessId como el ID del negocio para obtener el progreso
                const negocioId = parseInt(businessId, 10);
                console.log(`🔍 [FRONTEND] Cargando módulos para negocio ID: ${negocioId}`);
                const fetchedModules = await getLearningPathUseCase.execute(negocioId);
                setModules(fetchedModules);
            } catch (err) {
                console.error('Error al obtener el camino de aprendizaje:', err);
                setError("No se pudieron cargar los módulos.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchModules();
        // Añadimos 'businessId' como dependencia del useEffect.
        // Si la URL cambia (ej. de un negocio a otro), los datos se recargarán.
    }, [businessId]);

    // Manejo de errores en la UI
    if (error) {
        return (
            <div className="text-center py-10 text-red-500">
                <h1>Error</h1>
                <p>{error}</p>
            </div>
        );
    }

   return (
    // Usamos flexbox para distribuir el espacio verticalmente
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      
      {/* 1. Header: Ocupa su espacio natural (que ya redujimos) */}
      <ModuleHeader title="Módulo de Educación Financiera" userName={user?.nombreCompleto || "Usuario"} />
      
      {/* 2. Contenedor Principal: Crece para ocupar el espacio restante y centra su contenido */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Título y enlace con margen vertical reducido */}
        <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Camino de Aprendizaje</h2>
            <Link to="/businesses" className="text-blue-600 hover:text-blue-800 text-base">
            &larr; Volver a Negocios
            </Link>
        </div>

        {isLoading ? (
            <p>Cargando módulos...</p>
        ) : (
           // --- CAMBIO AQUÍ ---
            // Nos aseguramos de que businessId exista antes de renderizar la grilla.
            // Esto le garantiza a TypeScript que la prop será de tipo 'string'.
            businessId && (
              <div className="flex flex-col items-center">
                <LearningPathGrid modules={modules}  businessId={businessId} />
                <StatusLegend />
              </div>
            )
            // ------------------
        )}
      </main>
    </div>
  );
};