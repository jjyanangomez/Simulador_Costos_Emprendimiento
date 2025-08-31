// 🎯 EJEMPLO SIMPLE: Cómo usar el nombre del negocio en cualquier componente
// Copia y pega estos ejemplos en tus componentes

import React from 'react';
import { 
  BusinessNameDisplay,
  BusinessTitle,
  BusinessWelcome,
  BusinessDashboardTitle,
  BusinessNavName,
  EditableBusinessName,
  BusinessNameStatus,
  BusinessInfoCard
} from '../shared/components/BusinessNameDisplay';
import { 
  useBusinessName,
  saveBusinessName,
  getBusinessName,
  getBusinessNameQuick,
  hasBusinessName
} from '../shared/utils/businessNameStorage';

export function SimpleBusinessNameUsage() {
  
  // ===== EJEMPLO 1: USAR EL HOOK =====
  function EjemploConHook() {
    const { businessName, hasName, formattedName, saveName } = useBusinessName();
    
    return (
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-bold mb-2">🎣 Ejemplo con Hook:</h3>
        {hasName ? (
          <div>
            <p>Nombre: {businessName}</p>
            <p>Formateado: {formattedName}</p>
            <button 
              onClick={() => saveName('Nuevo Nombre')}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
            >
              Cambiar Nombre
            </button>
          </div>
        ) : (
          <p className="text-red-600">No hay nombre configurado</p>
        )}
      </div>
    );
  }

  // ===== EJEMPLO 2: FUNCIONES DIRECTAS =====
  function EjemploDirecto() {
    const handleSave = () => {
      const success = saveBusinessName('Mi Nuevo Negocio');
      alert(success ? 'Guardado ✅' : 'Error ❌');
    };

    const handleGet = () => {
      const name = getBusinessName(); // Puede ser null
      const quickName = getBusinessNameQuick(); // Nunca null
      alert(`Nombre: ${name}\nRápido: ${quickName}`);
    };

    return (
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-bold mb-2">🔧 Ejemplo Directo:</h3>
        <div className="space-y-2">
          <button onClick={handleSave} className="block w-full px-3 py-1 bg-green-600 text-white rounded text-sm">
            Guardar Nombre
          </button>
          <button onClick={handleGet} className="block w-full px-3 py-1 bg-blue-600 text-white rounded text-sm">
            Obtener Nombre
          </button>
          <p className="text-sm">¿Hay nombre? {hasBusinessName() ? 'Sí ✅' : 'No ❌'}</p>
        </div>
      </div>
    );
  }

  // ===== EJEMPLO 3: COMPONENTES LISTOS =====
  function EjemploComponentes() {
    return (
      <div className="space-y-4">
        <h3 className="font-bold">🎨 Componentes Listos para Usar:</h3>
        
        {/* Título principal */}
        <BusinessTitle className="text-blue-900" />
        
        {/* Bienvenida */}
        <BusinessWelcome className="text-green-800" />
        
        {/* Dashboard */}
        <BusinessDashboardTitle className="text-purple-900" />
        
        {/* Navegación */}
        <div className="bg-gray-100 p-2 rounded">
          <BusinessNavName />
        </div>
        
        {/* Editable */}
        <EditableBusinessName onNameChange={(name) => console.log('Nuevo:', name)} />
        
        {/* Estado */}
        <BusinessNameStatus />
        
        {/* Tarjeta de información */}
        <BusinessInfoCard />
      </div>
    );
  }

  // ===== EJEMPLO 4: EN HEADERS/TITLES =====
  function Header() {
    return (
      <header className="bg-blue-600 text-white p-4">
        {/* Opción 1: Componente predefinido */}
        <BusinessNavName className="text-white" />
        
        {/* Opción 2: Componente personalizado */}
        <BusinessNameDisplay 
          prefix="Sistema de" 
          suffix="- Panel Principal"
          variant="h2"
          className="text-white"
        />
      </header>
    );
  }

  // ===== EJEMPLO 5: RENDERIZADO CONDICIONAL =====
  function ConditionalRender() {
    const { hasName, formattedName } = useBusinessName();
    
    return (
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-bold mb-2">🔀 Renderizado Condicional:</h3>
        {hasName ? (
          <div className="text-green-800">
            ✅ Bienvenido a {formattedName}
          </div>
        ) : (
          <div className="text-red-800">
            ⚠️ Por favor configura tu negocio primero
            <button 
              onClick={() => saveBusinessName('Mi Negocio')}
              className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs"
            >
              Configurar
            </button>
          </div>
        )}
      </div>
    );
  }

  // ===== EJEMPLO 6: EN FORMULARIOS =====
  function FormExample() {
    const { businessName } = useBusinessName();
    
    return (
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-bold mb-2">📝 Ejemplo en Formulario:</h3>
        <input
          type="text"
          placeholder={`Ej: ${getBusinessNameQuick()}`}
          defaultValue={businessName || ''}
          className="w-full p-2 border rounded"
        />
        <p className="text-xs text-gray-500 mt-1">
          Placeholder basado en el nombre actual
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🏢 Uso Simple del Nombre del Negocio
        </h1>
        <p className="text-gray-600">
          Ejemplos listos para copiar y pegar en tus componentes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EjemploConHook />
        <EjemploDirecto />
      </div>

      <EjemploComponentes />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConditionalRender />
        <FormExample />
      </div>

      <Header />

      {/* ===== CÓDIGO PARA COPIAR ===== */}
      <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
          💻 Código Listo para Copiar
        </summary>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">1. Import básico:</h4>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-auto">
{`import { useBusinessName } from '../shared/utils/businessNameStorage';
import { BusinessTitle, BusinessWelcome } from '../shared/components/BusinessNameDisplay';`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">2. Uso en componente:</h4>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-auto">
{`function MiComponente() {
  const { businessName, hasName, formattedName } = useBusinessName();
  
  if (!hasName) {
    return <div>Configura tu negocio primero</div>;
  }
  
  return (
    <div>
      <h1>{formattedName}</h1>
      <BusinessWelcome />
    </div>
  );
}`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">3. Funciones directas:</h4>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-auto">
{`import { 
  saveBusinessName, 
  getBusinessNameQuick, 
  hasBusinessName 
} from '../shared/utils/businessNameStorage';

// Guardar
saveBusinessName('Mi Cafetería');

// Obtener (nunca null)
const nombre = getBusinessNameQuick();

// Verificar
if (hasBusinessName()) {
  console.log('Hay nombre');
}`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">4. Componentes predefinidos:</h4>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-auto">
{`// Título principal
<BusinessTitle />

// Bienvenida
<BusinessWelcome />

// Dashboard
<BusinessDashboardTitle />

// Navegación
<BusinessNavName />

// Editable
<EditableBusinessName onNameChange={(name) => console.log(name)} />`}
            </pre>
          </div>
        </div>
      </details>
    </div>
  );
}
