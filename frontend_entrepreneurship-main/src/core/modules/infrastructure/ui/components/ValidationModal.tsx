import React from 'react';

interface ValidationModalProps {
  isOpen: boolean;
  variant: 'warning' | 'confirmation' | 'results';
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  // --- NUEVA PROP ---
  // Controla si se muestra el pie de página con los botones.
  showFooter: boolean;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({
  isOpen,
  variant,
  title,
  icon,
  children,
  onClose,
  onConfirm,
  // Recibimos la nueva prop
  showFooter,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-brand shadow-brand-lg w-full max-w-4xl transform transition-all">
        
        <header className="p-6 border-b border-neutral-200">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-bold text-neutral-800 flex items-center gap-3">
              {icon}
              <span>{title}</span>
            </h4>
            <button
              onClick={onClose}
              aria-label="Cerrar modal"
              className="text-neutral-500 hover:text-red-700 hover:bg-red-100 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              <span className="text-2xl font-sans">×</span>
            </button>
          </div>
        </header>

        <main className="p-6 max-h-[60vh] overflow-y-auto">
          {children}
        </main>

        {/* 
          =======================================================
          CAMBIO CLAVE: El pie de página completo ahora es condicional.
          Solo se renderizará si `showFooter` es `true`.
          =======================================================
        */}
        {showFooter && (
          <footer className="flex justify-end gap-3 bg-neutral-50 p-4 rounded-b-brand">
            {variant === 'warning' && (
              <button
                onClick={onClose}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-brand"
              >
                Regresar y corregir
              </button>
            )}
            
            {variant === 'confirmation' && (
              <>
                <button
                  onClick={onClose}
                  className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold py-2 px-4 rounded-brand"
                >
                  Regresar y corregir
                </button>
                <button
                  onClick={onConfirm}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-brand"
                >
                  Continuar al Análisis
                </button>
              </>
            )}
          </footer>
        )}
      </div>
    </div>
  );
};