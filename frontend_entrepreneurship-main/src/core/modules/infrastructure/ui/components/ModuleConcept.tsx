import { FaLightbulb } from 'react-icons/fa';

interface ModuleConceptProps {
  children: React.ReactNode;
}

export function ModuleConcept({ children }: ModuleConceptProps) {
  return (
    <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg">
      <h5 className="font-bold text-lg text-primary-700 mb-2 flex items-center gap-2">
        <FaLightbulb />
        <span>Concepto Clave</span>
      </h5>
      <p className="text-neutral-700">{children}</p>
    </div>
  );
}