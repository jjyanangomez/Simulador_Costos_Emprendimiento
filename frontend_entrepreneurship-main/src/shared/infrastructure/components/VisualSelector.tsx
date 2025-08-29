// src/components/forms/VisualSelector.tsx

import React from "react";

// Definimos la estructura de una opción visual
interface VisualSelectorOption {
  value: string;
  display: React.ReactNode; // Esto nos permite pasar cualquier cosa como display: un color, un icono, etc.
}

// Definimos las props que nuestro componente aceptará
interface VisualSelectorProps {
  label: string;
  name: string; // El 'name' del grupo de radio buttons, crucial para la accesibilidad
  options: VisualSelectorOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export function VisualSelector({
  label,
  name,
  options,
  selectedValue,
  onChange,
}: VisualSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        {label}
      </label>
      <div role="radiogroup" className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {options.map((option) => {
          const isSelected = option.value === selectedValue;

          return (
            // La magia de la accesibilidad: usamos un <label> que envuelve todo.
            // Al hacer clic en el label, se selecciona el input de radio oculto.
            <label key={option.value} className="cursor-pointer">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="sr-only" // Ocultamos el radio button real visualmente
              />

              {/* Este es el recuadro visual que el usuario ve y con el que interactúa */}
              <div
                className={`
                  flex items-center justify-center p-3 rounded-lg border-2
                  transition-all duration-200
                  ${
                    isSelected
                      ? "border-transparent ring-2 ring-primary-500 scale-105 shadow-lg"
                      : "border-neutral-200 bg-neutral-50 hover:border-primary-300"
                  }
                `}
              >
                {option.display}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
