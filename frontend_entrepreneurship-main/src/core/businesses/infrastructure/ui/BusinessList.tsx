import type { Business } from "../../domain/entities/Business";
import { BusinessCard } from "./BusinessCard";

interface BusinessListProps {
  businesses: Business[];
}

export function BusinessList({ businesses }: BusinessListProps) {
  // Caso 1: No hay negocios. Mostramos un mensaje.
  if (businesses.length === 0) {
    return (
      <div className="flex items-center justify-center text-md text-neutral-500 h-full">
        <span>No hay negocios registrados</span>
      </div>
    );
  }

  // Caso 2: Hay negocios. Los mapeamos y renderizamos una BusinessCard por cada uno.
  return (
    <div className="space-y-4">
      {businesses.map((business) => (
        <BusinessCard
          key={business.id} // La 'key' es crucial para que React optimice la lista
          business={business}
        />
      ))}
    </div>
  );
}
