import { FaCheckCircle, FaGraduationCap } from "react-icons/fa";
import { ModuleConcept } from "./ModuleConcept";
import clsx from "clsx";
import type { ModuleContent } from "../../../domain/entities/ModuleContent";
import { useState } from "react";

interface VideoSectionProps {
    moduleContent: ModuleContent;
    onVideoComplete: () => void;
}

export function VideoSection({ moduleContent, onVideoComplete }: VideoSectionProps) {
    const [videoState, setVideoState] = useState('loading');

    const handleVideoEnd = () => {
        console.log("play")
        setVideoState('completed');
        onVideoComplete();
    };

    return (
        <div className="mb-8">
            <h3 className="text-3xl font-bold text-neutral-800 mb-2 flex items-center gap-3">
                <FaGraduationCap className="text-primary-500" />
                <span>{moduleContent.title}</span>
            </h3>

            {/* Contenedor con placeholder */}
            <div className="aspect-w-16 aspect-h-9 rounded-brand overflow-hidden shadow-md mb-6 bg-black relative">
                {/* Loading/Error placeholder */}
                <div className={clsx(
                    "absolute inset-0 flex items-center justify-center transition-all duration-300",
                    {
                        'bg-gradient-to-br from-primary-400 to-primary-600 opacity-100': videoState === 'loading',
                        'bg-gradient-to-br from-red-400 to-red-600 opacity-100': videoState === 'error',
                        'opacity-0 pointer-events-none': videoState === 'loaded' || videoState === 'completed'
                    }
                )}>
                    <div className="text-white text-center">
                        {videoState === 'loading' && (
                            <>
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                                <p className="text-sm font-medium">Cargando video...</p>
                            </>
                        )}

                        {videoState === 'error' && (
                            <>
                                <div className="text-2xl mb-2">⚠️</div>
                                <p className="text-sm font-medium">Error al cargar el video</p>
                                <p className="text-xs opacity-75 mb-2">El video no se puede mostrar en este formato</p>
                                <button
                                    onClick={() => setVideoState('loading')}
                                    className="mt-2 px-3 py-1 bg-white/20 rounded text-xs hover:bg-white/30 transition-colors"
                                >
                                    Reintentar
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Iframe */}
                <iframe
                    className={clsx(
                        "w-full h-full transition-opacity duration-500 ease-in-out",
                        {
                            'opacity-0': videoState !== 'loaded' && videoState !== 'completed',
                            'opacity-100': videoState === 'loaded' || videoState === 'completed'
                        }
                    )}
                    src={moduleContent.resourceUrl}
                    title="Video Educativo"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={() => {
                        console.log('✅ [VIDEO] Iframe cargado exitosamente');
                        setVideoState('loaded');
                    }}
                    onError={() => {
                        console.error('❌ [VIDEO] Error al cargar el iframe');
                        setVideoState('error');
                    }}
                    onPlay={() => {
                        console.log('▶️ [VIDEO] Video iniciado');
                        handleVideoEnd();
                    }}
                />
            </div>

            {/* Indicador de video completado */}
            {videoState === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-green-700">
                        <FaCheckCircle />
                        <span className="font-medium">¡Video completado!</span>
                    </div>
                    <p className="text-green-600 text-sm mt-1">
                        Ahora puedes continuar con la simulación práctica.
                    </p>
                </div>
            )}

            <ModuleConcept>{moduleContent.concept}</ModuleConcept>
        </div>
    );
};