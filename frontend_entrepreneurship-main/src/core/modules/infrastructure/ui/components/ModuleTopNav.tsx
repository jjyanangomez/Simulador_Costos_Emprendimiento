// src/features/progress-map/infrastructure/ui/ModuleTopNav.tsx
import clsx from 'clsx';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: 'active' | 'enabled' | 'disabled';
}

interface ModuleTopNavProps {
  items: NavItem[];
  onItemClick: (itemId: string) => void;
}

export function ModuleTopNav({ items, onItemClick }: ModuleTopNavProps) {
  return (
    <div className="flex flex-wrap justify-between mb-8 border-b border-neutral-200 pb-4">
      {items.map(item => {
        const isDisabled = item.status === 'disabled';
        return (
          <div
            key={item.id}
            onClick={() => !isDisabled && onItemClick(item.id)}
            className={clsx(
              "w-full sm:w-1/4 mb-2 sm:mb-0 text-center p-3 rounded-lg transition-colors duration-200",
              {
                'cursor-pointer hover:bg-primary-50': !isDisabled,
                'bg-primary-100 border border-primary-200': item.status === 'active',
                'opacity-50 cursor-not-allowed': isDisabled
              }
            )}
            title={isDisabled ? 'Función no disponible' : item.label}
          >
            <div className="text-2xl mb-2 flex justify-center">{item.icon}</div>
            <div className={clsx("font-medium", { 'text-neutral-400': isDisabled })}>{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}