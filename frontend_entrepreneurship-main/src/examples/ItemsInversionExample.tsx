import React from 'react';
import { ItemsInversionManager } from '../core/business-setup/components/ItemsInversionManager';

export function ItemsInversionExample() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🏪 Gestión de Items de Inversión
        </h1>
        <p className="text-gray-600">
          Ejemplo de implementación del sistema de gestión de items de inversión
        </p>
      </div>

      <ItemsInversionManager />
    </div>
  );
}
