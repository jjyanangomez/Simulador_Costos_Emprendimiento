// 🎯 EJEMPLOS COMPLETOS: Cómo guardar y recuperar el nombre del negocio
// Este archivo muestra todas las formas de usar las funciones del nombre del negocio

import React, { useState } from 'react';
import { 
  saveBusinessName,
  getBusinessName,
  hasBusinessName,
  clearBusinessName,
  updateBusinessName,
  getFormattedBusinessName,
  validateBusinessName,
  getBusinessNameHistory,
  displayBusinessName,
  getBusinessNameQuick,
  saveBusinessNameFromAnalysis,
  useBusinessName
} from '../shared/utils/businessNameStorage';
import { Building2, Edit3, Save, Trash2, History, CheckCircle, AlertCircle } from 'lucide-react';

export function BusinessNameExamples() {
  const [newName, setNewName] = useState('');
  const [testName, setTestName] = useState('');

  // ===== HOOK PERSONALIZADO =====
  const {
    businessName,
    hasName,
    formattedName,
    saveName,
    updateName,
    clearName,
    validateName,
    getHistory
  } = useBusinessName();

  // ===== EJEMPLOS DE FUNCIONES DIRECTAS =====

  const handleDirectSave = () => {
    if (newName.trim()) {
      const success = saveBusinessName(newName);
      if (success) {
        alert(`✅ Nombre guardado: ${newName}`);
        setNewName('');
        window.location.reload(); // Para actualizar la vista
      } else {
        alert('❌ Error al guardar el nombre');
      }
    }
  };

  const handleDirectGet = () => {
    const name = getBusinessName();
    alert(name ? `📖 Nombre recuperado: ${name}` : '❌ No hay nombre guardado');
  };

  const handleDirectClear = () => {
    const success = clearBusinessName();
    if (success) {
      alert('🗑️ Nombre eliminado');
      window.location.reload();
    }
  };

  const handleValidation = () => {
    if (testName.trim()) {
      const validation = validateBusinessName(testName);
      alert(validation.isValid ? 
        `✅ Nombre válido: ${testName}` : 
        `❌ Nombre inválido: ${validation.message}`
      );
    }
  };

  const showHistory = () => {
    const history = getBusinessNameHistory();
    if (history.length > 0) {
      alert(`📋 Historial de nombres:\n${history.join('\n')}`);
    } else {
      alert('📋 No hay historial de nombres');
    }
  };

  const saveFromAnalysis = () => {
    const success = saveBusinessNameFromAnalysis();
    if (success) {
      alert('✅ Nombre extraído del análisis y guardado');
      window.location.reload();
    } else {
      alert('❌ No se pudo extraer el nombre del análisis');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏢 Manejo del Nombre del Negocio
        </h1>
        <p className="text-xl text-gray-600">
          Ejemplos completos de cómo guardar y recuperar el nombre del negocio
        </p>
      </div>

      {/* ===== ESTADO ACTUAL ===== */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Building2 className="w-6 h-6 mr-2 text-blue-600" />
          Estado Actual del Nombre
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border-2 ${hasName ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center mb-2">
              {hasName ? <CheckCircle className="w-5 h-5 text-green-600 mr-2" /> : <AlertCircle className="w-5 h-5 text-red-600 mr-2" />}
              <span className={`font-bold ${hasName ? 'text-green-800' : 'text-red-800'}`}>
                {hasName ? 'Nombre Guardado' : 'Sin Nombre'}
              </span>
            </div>
            <p className={`text-sm ${hasName ? 'text-green-700' : 'text-red-700'}`}>
              {hasName ? 'Hay un nombre disponible' : 'No hay nombre guardado'}
            </p>
          </div>
          
          <div className="p-4 rounded-lg border-2 bg-blue-50 border-blue-200">
            <h3 className="font-bold text-blue-800 mb-2">Nombre Actual:</h3>
            <p className="text-blue-700 font-medium">
              {businessName || 'Ninguno'}
            </p>
          </div>
          
          <div className="p-4 rounded-lg border-2 bg-purple-50 border-purple-200">
            <h3 className="font-bold text-purple-800 mb-2">Nombre Formateado:</h3>
            <p className="text-purple-700 font-medium">
              {formattedName}
            </p>
          </div>
        </div>
      </div>

      {/* ===== HOOK PERSONALIZADO ===== */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🎣 Usando el Hook (useBusinessName) - RECOMENDADO
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-gray-700 mb-3">Guardar/Actualizar Nombre:</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nombre del negocio..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => saveName(newName) && setNewName('')}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Hook
                </button>
                <button
                  onClick={() => clearName()}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-700 mb-3">Información del Hook:</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <strong>businessName:</strong> {businessName || 'null'}
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <strong>hasName:</strong> {hasName ? 'true' : 'false'}
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <strong>formattedName:</strong> {formattedName}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FUNCIONES DIRECTAS ===== */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🔧 Funciones Directas (sin Hook)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-gray-700 mb-3">Acciones Básicas:</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nombre para guardar..."
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDirectSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  Guardar Directo
                </button>
                <button
                  onClick={handleDirectGet}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                >
                  Obtener
                </button>
                <button
                  onClick={handleDirectClear}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                >
                  Limpiar
                </button>
                <button
                  onClick={() => alert(`🎯 Nombre rápido: ${getBusinessNameQuick()}`)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
                >
                  Quick Get
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-700 mb-3">Utilidades:</h3>
            <div className="space-y-2">
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Nombre para validar..."
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleValidation}
                  className="bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 text-xs"
                >
                  Validar
                </button>
                <button
                  onClick={showHistory}
                  className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 text-xs flex items-center justify-center"
                >
                  <History className="w-3 h-3 mr-1" />
                  Historial
                </button>
                <button
                  onClick={() => alert(`📝 Formateado: ${getFormattedBusinessName()}`)}
                  className="bg-pink-600 text-white px-3 py-2 rounded-lg hover:bg-pink-700 text-xs"
                >
                  Formato
                </button>
                <button
                  onClick={saveFromAnalysis}
                  className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 text-xs"
                >
                  Del Análisis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== EJEMPLOS DE USO EN COMPONENTES ===== */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🎨 Ejemplos de Uso en Componentes
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Ejemplo 1: Título */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-2">En Títulos:</h3>
            <h4 className="text-lg font-semibold text-blue-900">
              {displayBusinessName('Dashboard de', '')}
            </h4>
            <p className="text-xs text-blue-600 mt-1">
              usando: displayBusinessName('Dashboard de', '')
            </p>
          </div>
          
          {/* Ejemplo 2: Bienvenida */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-bold text-green-800 mb-2">En Bienvenidas:</h3>
            <p className="text-green-900">
              {displayBusinessName('¡Bienvenido a', '!')}
            </p>
            <p className="text-xs text-green-600 mt-1">
              usando: displayBusinessName('¡Bienvenido a', '!')
            </p>
          </div>
          
          {/* Ejemplo 3: Navegación */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-bold text-purple-800 mb-2">En Navegación:</h3>
            <nav className="text-purple-900">
              <div className="font-medium">{getBusinessNameQuick()}</div>
              <div className="text-xs">Menú Principal</div>
            </nav>
            <p className="text-xs text-purple-600 mt-1">
              usando: getBusinessNameQuick()
            </p>
          </div>
          
          {/* Ejemplo 4: Condicional */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-bold text-yellow-800 mb-2">Renderizado Condicional:</h3>
            <div className="text-yellow-900">
              {hasBusinessName() ? (
                <span>✅ Negocio: {formattedName}</span>
              ) : (
                <span>⚠️ Configura tu negocio</span>
              )}
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              usando: hasBusinessName()
            </p>
          </div>
          
          {/* Ejemplo 5: Formulario */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-bold text-red-800 mb-2">En Formularios:</h3>
            <input
              type="text"
              placeholder={`Ej: ${getBusinessNameQuick()}`}
              className="w-full p-2 border rounded text-sm"
              defaultValue={businessName || ''}
            />
            <p className="text-xs text-red-600 mt-1">
              placeholder con nombre actual
            </p>
          </div>
          
          {/* Ejemplo 6: Estado */}
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h3 className="font-bold text-indigo-800 mb-2">Verificación de Estado:</h3>
            <div className="text-indigo-900">
              <span className={`px-2 py-1 rounded text-xs ${
                hasBusinessName() ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
              }`}>
                {hasBusinessName() ? 'Configurado' : 'Sin configurar'}
              </span>
            </div>
            <p className="text-xs text-indigo-600 mt-1">
              Estado visual basado en hasBusinessName()
            </p>
          </div>
        </div>
      </div>

      {/* ===== CÓDIGO DE EJEMPLO ===== */}
      <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
          💻 Ver Código de Ejemplo para Copiar/Pegar
        </summary>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">1. Usar el Hook (Recomendado):</h4>
            <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-xs overflow-auto">
{`import { useBusinessName } from '../shared/utils/businessNameStorage';

function MiComponente() {
  const { businessName, hasName, formattedName, saveName } = useBusinessName();
  
  if (!hasName) {
    return <div>Por favor configura tu negocio</div>;
  }
  
  return (
    <div>
      <h1>{formattedName}</h1>
      <button onClick={() => saveName('Nuevo Nombre')}>
        Cambiar Nombre
      </button>
    </div>
  );
}`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">2. Funciones Directas:</h4>
            <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-xs overflow-auto">
{`import { 
  saveBusinessName, 
  getBusinessName, 
  hasBusinessName,
  getBusinessNameQuick
} from '../shared/utils/businessNameStorage';

// Guardar nombre
const guardar = () => {
  const success = saveBusinessName('Mi Cafetería');
  console.log(success ? 'Guardado' : 'Error');
};

// Obtener nombre
const nombre = getBusinessName(); // string | null
const nombreRapido = getBusinessNameQuick(); // string (nunca null)

// Verificar si existe
if (hasBusinessName()) {
  console.log('Hay nombre guardado');
}`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">3. En Componentes de Vista:</h4>
            <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-xs overflow-auto">
{`import { displayBusinessName, getFormattedBusinessName } from '../shared/utils/businessNameStorage';

function Header() {
  return (
    <header>
      <h1>{displayBusinessName('Dashboard de', '')}</h1>
      <nav>{getFormattedBusinessName()}</nav>
    </header>
  );
}

function Welcome() {
  return (
    <div>
      <h2>{displayBusinessName('¡Bienvenido a', '!')}</h2>
    </div>
  );
}`}
            </pre>
          </div>
        </div>
      </details>
    </div>
  );
}
