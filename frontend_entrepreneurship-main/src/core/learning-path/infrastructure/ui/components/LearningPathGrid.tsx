// Fichero: src/core/learning-path/ui/components/LearningPathGrid.tsx
import React from 'react';

import { ModuleCard } from './ModuleCard';
import type { Module } from '../../../domain/entities/Module';

interface Props {
  modules: Module[];
  businessId: string;
}

/**
 * Componente que renderiza la grilla de módulos.
 * Se encarga del layout y de mapear los datos a los componentes ModuleCard.
 */
export const LearningPathGrid: React.FC<Props> = ({  modules,
  businessId
   }) => {
  return (
    <div className="grid-container max-w-4xl mx-auto">
      {/* Ajustamos el gap para dar un poco más de espacio a las tarjetas más anchas */}
      <div className="grid grid-cols-3 gap-6 relative">
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} businessId={businessId}
          /**businessId={businessId} */
           />
        ))}
      </div>
      
    </div>
  );
};