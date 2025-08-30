// 🏢 COMPONENTE PARA MOSTRAR EL NOMBRE DEL NEGOCIO
// Componente reutilizable que puedes usar en cualquier vista

import React from 'react';
import { useBusinessName } from '../utils/businessNameStorage';
import { Building2, AlertTriangle } from 'lucide-react';

interface BusinessNameDisplayProps {
  /** Prefijo para el nombre (ej: "Dashboard de") */
  prefix?: string;
  /** Sufijo para el nombre (ej: "- Panel Principal") */
  suffix?: string;
  /** Mostrar un mensaje si no hay nombre */
  showNoNameMessage?: boolean;
  /** Mensaje personalizado cuando no hay nombre */
  noNameMessage?: string;
  /** Estilo del texto */
  variant?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  /** Clases CSS adicionales */
  className?: string;
  /** Mostrar icono de negocio */
  showIcon?: boolean;
  /** Hacer el nombre editable */
  editable?: boolean;
  /** Callback cuando se edita el nombre */
  onNameChange?: (newName: string) => void;
}

/**
 * 🏢 Componente para mostrar el nombre del negocio
 * 
 * @example
 * ```tsx
 * // Uso básico
 * <BusinessNameDisplay />
 * 
 * // Con prefijo/sufijo
 * <BusinessNameDisplay prefix="Dashboard de" suffix="- Panel Principal" />
 * 
 * // Como título principal
 * <BusinessNameDisplay variant="h1" showIcon={true} />
 * 
 * // Editable
 * <BusinessNameDisplay editable={true} onNameChange={(name) => console.log(name)} />
 * ```
 */
export function BusinessNameDisplay({
  prefix = '',
  suffix = '',
  showNoNameMessage = false,
  noNameMessage = 'Configura tu negocio',
  variant = 'span',
  className = '',
  showIcon = false,
  editable = false,
  onNameChange
}: BusinessNameDisplayProps) {
  const { businessName, hasName, formattedName, saveName } = useBusinessName();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(businessName || '');

  // Si no hay nombre y se debe mostrar mensaje
  if (!hasName && showNoNameMessage) {
    return (
      <div className={`flex items-center text-gray-500 ${className}`}>
        <AlertTriangle className="w-4 h-4 mr-2" />
        <span>{noNameMessage}</span>
      </div>
    );
  }

  // Si no hay nombre, no mostrar nada
  if (!hasName) {
    return null;
  }

  // Construir el texto completo
  const fullText = `${prefix}${prefix ? ' ' : ''}${formattedName}${suffix ? ' ' : ''}${suffix}`.trim();

  // Manejar edición
  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(businessName || '');
  };

  const handleSave = () => {
    if (editValue.trim()) {
      const success = saveName(editValue.trim());
      if (success) {
        setIsEditing(false);
        onNameChange?.(editValue.trim());
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(businessName || '');
    }
  };

  // Estilos base según variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return 'text-3xl font-bold text-gray-900';
      case 'h2':
        return 'text-2xl font-semibold text-gray-800';
      case 'h3':
        return 'text-xl font-medium text-gray-700';
      case 'p':
        return 'text-base text-gray-600';
      default:
        return 'text-inherit';
    }
  };

  const Tag = variant === 'span' ? 'span' : variant;

  // Contenido del componente
  const content = (
    <div className={`flex items-center ${className}`}>
      {showIcon && <Building2 className="w-5 h-5 mr-2 text-blue-600" />}
      
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
            className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
          >
            ✓
          </button>
        </div>
      ) : (
        <Tag 
          className={`${getVariantStyles()} ${editable ? 'cursor-pointer hover:text-blue-600' : ''}`}
          onClick={editable ? handleEdit : undefined}
          title={editable ? 'Clic para editar' : undefined}
        >
          {fullText}
        </Tag>
      )}
    </div>
  );

  return content;
}

// ===== COMPONENTES PREDEFINIDOS PARA CASOS COMUNES =====

/**
 * 🎯 Título principal con el nombre del negocio
 */
export function BusinessTitle({ className = '', ...props }: Omit<BusinessNameDisplayProps, 'variant'>) {
  return (
    <BusinessNameDisplay 
      variant="h1" 
      showIcon={true} 
      className={className}
      {...props} 
    />
  );
}

/**
 * 📄 Nombre del negocio para el header/navegación
 */
export function BusinessNavName({ className = '', ...props }: Omit<BusinessNameDisplayProps, 'variant'>) {
  return (
    <BusinessNameDisplay 
      variant="h3" 
      className={`font-semibold ${className}`}
      {...props} 
    />
  );
}

/**
 * 🏠 Mensaje de bienvenida con el nombre del negocio
 */
export function BusinessWelcome({ className = '', ...props }: Omit<BusinessNameDisplayProps, 'prefix' | 'suffix'>) {
  return (
    <BusinessNameDisplay 
      variant="h2" 
      prefix="¡Bienvenido a" 
      suffix="!" 
      className={`text-blue-800 ${className}`}
      showIcon={true}
      {...props} 
    />
  );
}

/**
 * 📊 Nombre del negocio para dashboard
 */
export function BusinessDashboardTitle({ className = '', ...props }: Omit<BusinessNameDisplayProps, 'prefix'>) {
  return (
    <BusinessNameDisplay 
      variant="h1" 
      prefix="Dashboard de" 
      className={`text-gray-900 ${className}`}
      showIcon={true}
      {...props} 
    />
  );
}

/**
 * ✏️ Nombre del negocio editable
 */
export function EditableBusinessName({ 
  className = '', 
  onNameChange, 
  ...props 
}: Omit<BusinessNameDisplayProps, 'editable'> & { onNameChange?: (name: string) => void }) {
  return (
    <BusinessNameDisplay 
      variant="h3" 
      editable={true} 
      onNameChange={onNameChange}
      className={`inline-block ${className}`}
      {...props} 
    />
  );
}

/**
 * 🔍 Indicador de estado del nombre del negocio
 */
export function BusinessNameStatus({ className = '' }: { className?: string }) {
  const { hasName, businessName } = useBusinessName();
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${hasName ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className={`text-sm ${hasName ? 'text-green-700' : 'text-red-700'}`}>
        {hasName ? `Negocio: ${businessName}` : 'Sin nombre configurado'}
      </span>
    </div>
  );
}

/**
 * 📋 Información completa del negocio en una tarjeta
 */
export function BusinessInfoCard({ className = '' }: { className?: string }) {
  const { businessName, hasName, formattedName, getHistory } = useBusinessName();
  const history = getHistory();
  
  if (!hasName) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
          <span className="text-yellow-800 font-medium">Nombre del negocio no configurado</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center mb-3">
        <Building2 className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="font-semibold text-gray-900">Información del Negocio</h3>
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-gray-600">Nombre actual:</span>
          <span className="ml-2 font-medium text-gray-900">{businessName}</span>
        </div>
        <div>
          <span className="text-gray-600">Nombre formateado:</span>
          <span className="ml-2 font-medium text-gray-900">{formattedName}</span>
        </div>
        {history.length > 0 && (
          <div>
            <span className="text-gray-600">Historial:</span>
            <div className="ml-2 text-xs text-gray-500">
              {history.slice(0, 3).join(', ')}
              {history.length > 3 && '...'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
