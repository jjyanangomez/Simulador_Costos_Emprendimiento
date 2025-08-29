// src/features/progress-map/infrastructure/ui/ModuleContentPage.tsx
import clsx from 'clsx';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaVideo, FaRobot, FaChartLine, FaArrowLeft, FaArrowRight
} from 'react-icons/fa';

import { ModuleTopNav, type NavItem } from '../components/ModuleTopNav';
import { ModuleHeader } from '../../../../../shared/infrastructure/components/Header';
import { useEffect, useState } from 'react';
import type { ModuleContent } from '../../../domain/entities/ModuleContent';
import { ModuleRepositoryApi } from '../../adapters/ModuleRepositoryApi';
import { GetModuleContent } from '../../../application/useCase/GetModuleContent';
import { VideoSection } from '../components/VideoSection';
import { SimulationSection } from '../components/SimulationSection';
import { ResultsSection } from '../components/ResultSection';
import { useAuth } from '../../../../auth/infrastructure/hooks/useAuth';

// Tipos para el progreso del módulo
interface ModuleProgress {
  videoCompleted: boolean;
  simulationCompleted: boolean;
  resultsViewed: boolean;
}

export function ModuleContentPage() {
  const navigate = useNavigate();
  const { businessId, moduleId } = useParams<{ businessId: string; moduleId: string }>();
  const { user } = useAuth();
  const [currentSection, setCurrentSection] = useState<'learn' | 'simulate' | 'results'>('learn');
  const [moduleContent, setModuleContent] = useState<ModuleContent>({
    id: 1,
    title: "Cargando...",
    concept: "Cargando contenido del módulo...",
    resourceUrl: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ModuleProgress>({
    videoCompleted: false,
    simulationCompleted: false,
    resultsViewed: false
  });
  const [hasExistingValidation, setHasExistingValidation] = useState(false);

  // Crear navItems dinámicamente basado en el progreso y estado de carga
  const navItems: NavItem[] = [
    {
      id: 'learn',
      label: 'Aprender',
      icon: <FaVideo className={isLoading ? "text-neutral-400" : "text-blue-600"} />,
      status: currentSection === 'learn' ? 'active' : (isLoading ? 'disabled' : 'enabled')
    },
    {
      id: 'simulate',
      label: 'Simulación',
      icon: <FaRobot className={isLoading || !progress.videoCompleted ? "text-neutral-400" : "text-green-600"} />,
      status: currentSection === 'simulate' ? 'active' : (isLoading || !progress.videoCompleted ? 'disabled' : 'enabled')
    },
    {
      id: 'results',
      label: 'Resultados',
      icon: <FaChartLine className={isLoading || !progress.simulationCompleted ? "text-neutral-400" : "text-blue-600"} />,
      status: currentSection === 'results' ? 'active' : (isLoading || !progress.simulationCompleted ? 'disabled' : 'enabled')
    },
  ];

  useEffect(() => {
    const fetchContent = async () => {
      if (!moduleId) {
        setError("No se ha especificado un ID de módulo.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const moduleRepository = new ModuleRepositoryApi();
        const getModuleContentUseCase = new GetModuleContent(moduleRepository);
        const moduleIdNumber = parseInt(moduleId, 10);
        
        const fetchedContent = await getModuleContentUseCase.execute(moduleIdNumber);
        setModuleContent(fetchedContent);
        
        // Marcar el video como completado automáticamente cuando se carga el contenido
        // Esto permite que el usuario pueda avanzar inmediatamente
        setProgress(prev => ({ ...prev, videoCompleted: true }));
      } catch (err) {
        console.error('Error al cargar el contenido del módulo:', err);
        setError("No se pudo cargar el contenido del módulo. Inténtalo de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [moduleId]);

  const handleTopNavClick = (itemId: string) => {
    const sectionId = itemId as 'learn' | 'simulate' | 'results';

    // Verificar si la sección está habilitada
    const navItem = navItems.find(item => item.id === itemId);
    if (navItem?.status === 'disabled') {
      return; // No hacer nada si está deshabilitada
    }

    setCurrentSection(sectionId);

    if (sectionId === 'results') {
      setProgress(prev => ({ ...prev, resultsViewed: true }));
    }
  };

  const handleVideoComplete = () => {
    setProgress(prev => ({ ...prev, videoCompleted: true }));
  };

  const handleSimulationComplete = () => {
    setProgress(prev => ({ ...prev, simulationCompleted: true }));
  };

  const handleBack = () => {
    if (currentSection === 'learn') {
      navigate(`/businesses/${businessId}/learning-path`);
    } else if (currentSection === 'simulate') {
      setCurrentSection('learn');
    } else if (currentSection === 'results') {
      setCurrentSection('simulate');
    }

  };

  const handleNext = () => {
    if (currentSection === 'learn' && progress.videoCompleted) {
      setCurrentSection('simulate');
    } else if (currentSection === 'simulate' && (progress.simulationCompleted || hasExistingValidation)) {
      setCurrentSection('results');
      setProgress(prev => ({ ...prev, resultsViewed: true }));
    } else if (currentSection === 'results' && progress.resultsViewed) {
      // Navegación al learning path
      navigate(`/businesses/${businessId}/learning-path`);
      console.log('🔄 [MODULE] Navegación al learning path habilitada');
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'learn':
        return (
          <VideoSection
            moduleContent={moduleContent}
            onVideoComplete={handleVideoComplete}
          />
        );
      case 'simulate':
        return (
          <SimulationSection
            moduleContent={moduleContent}
            onSimulationComplete={handleSimulationComplete}
            onExistingValidationFound={setHasExistingValidation}
          />
        );
      case 'results':
        return <ResultsSection moduleContent={moduleContent} />;
      default:
        return (
          <VideoSection
            moduleContent={moduleContent}
            onVideoComplete={handleVideoComplete}
          />
        );
    }
  };

  const getNextButtonText = () => {
    // Si está cargando, mostrar texto de carga
    if (isLoading) {
      return 'Cargando...';
    }
    
    // Si hay error, mostrar texto de error
    if (error) {
      return 'Error';
    }
    
    // Si no hay contenido cargado, mostrar texto de espera
    if (!moduleContent || moduleContent.title === "Cargando...") {
      return 'Esperando...';
    }
    
    // Lógica específica por sección
    if (currentSection === 'learn' && progress.videoCompleted) {
      return 'Ir a Simulación';
    } else if (currentSection === 'simulate' && (progress.simulationCompleted || hasExistingValidation)) {
      return 'Ver Resultados';
    } else if (currentSection === 'results') {
      return 'Continuar';
    }
    return 'Siguiente';
  };

  const isNextButtonEnabled = () => {
    // Si está cargando, el botón debe estar deshabilitado
    if (isLoading) return false;
    
    // Si hay error, el botón debe estar deshabilitado
    if (error) return false;
    
    // Si no hay contenido del módulo cargado, el botón debe estar deshabilitado
    if (!moduleContent || moduleContent.title === "Cargando...") return false;
    
    // Lógica específica por sección
    if (currentSection === 'learn') return progress.videoCompleted;
    if (currentSection === 'simulate') return progress.simulationCompleted || hasExistingValidation;
    return true; // Results section always allows next
  };

  // Manejo de errores en la UI
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate(`/businesses/${businessId}/learning-path`)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Volver al Learning Path
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
              <ModuleHeader title="Educación Financiera" userName={user?.nombreCompleto || "Usuario"} />
      <div className="bg-white p-6 sm:p-8 w-full max-w-4xl mx-auto my-8 rounded-brand shadow-brand-lg">

        {/* Mostrar información del módulo */}
        <div className="mb-6 border-b border-neutral-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isLoading ? "Cargando módulo..." : moduleContent.title}
          </h1>
          <p className="text-gray-600 text-lg">
            {isLoading ? "Cargando contenido..." : moduleContent.concept}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando contenido del módulo...</p>
            </div>
          </div>
        ) : (
          <>
            <ModuleTopNav items={navItems} onItemClick={handleTopNavClick} />

            {/* Current Section Content */}
            {renderCurrentSection()}

            {/* Botones de Navegación */}
            <div className="flex justify-between mt-8 border-t border-neutral-200 pt-6">
              <button
                onClick={handleBack}
                className="bg-neutral-500 hover:bg-neutral-600 text-white font-bold py-3 px-6 rounded-brand transition-colors flex items-center gap-2"
              >
                <FaArrowLeft />
                Volver
              </button>
                          <button
              onClick={handleNext}
              disabled={!isNextButtonEnabled()}
              className={clsx(
                "font-bold py-3 px-6 rounded-brand transition-colors flex items-center gap-2",
                {
                  'bg-primary-500 hover:bg-primary-600 text-white': isNextButtonEnabled(),
                  'bg-neutral-300 text-neutral-500 cursor-not-allowed': !isNextButtonEnabled()
                }
              )}
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              )}
              {getNextButtonText()}
              {!isLoading && <FaArrowRight />}
            </button>
            </div>
          </>
        )}

      </div>
    </>
  );
}