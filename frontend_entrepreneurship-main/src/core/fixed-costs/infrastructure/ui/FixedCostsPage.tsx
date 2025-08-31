import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../../shared/infrastructure/components/MainLayout';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Save,
  ArrowRight,
  ArrowLeft,
  Building2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BusinessAnalysisService } from '../../../../shared/services/BusinessAnalysisService';

// Esquema de validación para costos fijos
const fixedCostSchema = z.object({
  costs: z.array(z.object({
    name: z.string().min(3, 'El nombre del costo debe tener al menos 3 caracteres'),
    description: z.string().optional(),
    amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
    frequency: z.enum(['mensual', 'semestral', 'anual']),
    category: z.string().min(1, 'Selecciona una categoría'),
  })).min(1, 'Debes agregar al menos un costo fijo'),
});

type FixedCostForm = z.infer<typeof fixedCostSchema>;

const costCategories = [
  { value: 'arriendo', label: 'Arriendo/Renta del Local', icon: '🏠', description: 'Pago mensual del local' },
  { value: 'personal', label: 'Sueldos y Salarios', icon: '👥', description: 'Remuneraciones del personal' },
  { value: 'seguridad-social', label: 'Seguridad Social (IESS)', icon: '🛡️', description: 'Aportes patronales' },
  { value: 'servicios', label: 'Servicios Básicos', icon: '⚡', description: 'Luz, agua, internet, etc.' },
  { value: 'publicidad', label: 'Publicidad y Marketing', icon: '📢', description: 'Campañas publicitarias' },
  { value: 'licencias', label: 'Licencias y Permisos', icon: '📋', description: 'Permisos municipales' },
  { value: 'seguros', label: 'Seguros', icon: '🔒', description: 'Seguros empresariales' },
  { value: 'mantenimiento', label: 'Mantenimiento', icon: '🔧', description: 'Local y equipos' },
  { value: 'transporte', label: 'Transporte y Logística', icon: '🚚', description: 'Gastos de transporte' },
  { value: 'otros', label: 'Otros Costos', icon: '📦', description: 'Costos adicionales' },
];

const frequencyOptions = [
  { value: 'mensual', label: 'Mensual', multiplier: 1 },
  { value: 'semestral', label: 'Semestral', multiplier: 6 },
  { value: 'anual', label: 'Anual', multiplier: 12 },
];

// Rangos base por categoría (valores realistas del mercado ecuatoriano 2024)
const baseCostRanges: Record<string, { min: number; max: number; unit: string; details?: string }> = {
  arriendo: { min: 400, max: 1200, unit: 'USD/mes', details: 'Locales comerciales pequeños a medianos' },
  personal: { min: 425, max: 3200, unit: 'USD/mes total', details: '1-4 empleados: $425-800 c/u + beneficios' },
  'seguridad-social': { min: 50, max: 100, unit: 'USD/mes por empleado', details: 'IESS patronal (~11.15% del salario básico)' },
  servicios: { min: 80, max: 250, unit: 'USD/mes', details: 'Luz, agua, internet, teléfono combinados' },
  publicidad: { min: 50, max: 400, unit: 'USD/mes', details: 'Marketing digital y tradicional' },
  licencias: { min: 100, max: 600, unit: 'USD/año', details: 'Permisos municipales y funcionamiento' },
  seguros: { min: 30, max: 150, unit: 'USD/mes', details: 'Seguros básicos para negocios pequeños' },
  mantenimiento: { min: 50, max: 250, unit: 'USD/mes', details: 'Mantenimiento preventivo y correctivo' },
  transporte: { min: 100, max: 500, unit: 'USD/mes', details: 'Gastos de movilización y logística' },
  otros: { min: 30, max: 150, unit: 'USD/mes', details: 'Gastos varios y imprevistos' },
};

// Rangos específicos para servicios básicos individuales (Ecuador 2024)
const specificServiceRanges: Record<string, { min: number; max: number; unit: string; details: string }> = {
  electricidad: { min: 30, max: 120, unit: 'USD/mes', details: 'Consumo 300-1200 kWh a $0.095/kWh' },
  luz: { min: 30, max: 120, unit: 'USD/mes', details: 'Consumo 300-1200 kWh a $0.095/kWh' },
  agua: { min: 20, max: 60, unit: 'USD/mes', details: 'Consumo comercial básico a moderado' },
  internet: { min: 25, max: 80, unit: 'USD/mes', details: 'Planes comerciales 50-300 Mbps' },
  telefono: { min: 15, max: 45, unit: 'USD/mes', details: 'Línea fija + celular corporativo' },
  gas: { min: 20, max: 100, unit: 'USD/mes', details: 'Gas comercial para cocinas' },
};

// Multiplicadores por tipo de negocio (más conservadores)
const businessTypeMultipliers: Record<string, { rent: number; staff: number; utilities: number; other: number }> = {
  'restaurante': { rent: 1.2, staff: 1.3, utilities: 1.2, other: 1.1 },
  'cafeteria': { rent: 1.0, staff: 1.1, utilities: 1.1, other: 1.0 },
  'bar': { rent: 1.2, staff: 1.0, utilities: 1.3, other: 1.1 },
  'pizzeria': { rent: 1.1, staff: 1.2, utilities: 1.2, other: 1.0 },
  'panaderia': { rent: 1.0, staff: 1.2, utilities: 1.1, other: 1.0 },
  'heladeria': { rent: 0.9, staff: 0.9, utilities: 1.0, other: 0.9 },
  'fast-food': { rent: 1.0, staff: 1.0, utilities: 1.0, other: 1.0 },
  'catering': { rent: 0.8, staff: 1.4, utilities: 1.0, other: 1.1 },
  'default': { rent: 1.0, staff: 1.0, utilities: 1.0, other: 1.0 },
};

// Multiplicadores por ubicación (más conservadores)
const locationMultipliers: Record<string, number> = {
  'Centro Histórico': 1.4, 'La Mariscal': 1.3, 'Cumbayá': 1.3, 'La Floresta': 1.2,
  'Guápulo': 1.1, 'Bellavista': 1.2, 'Tumbaco': 1.1, 'Valle de los Chillos': 1.0,
  'San Rafael': 1.0, 'Calderón': 0.9, 'Carapungo': 0.8, 'Pomasqui': 0.9,
  'San Antonio': 0.8, 'Conocoto': 0.9, 'Sangolquí': 0.9, 'default': 1.0,
};

// Multiplicadores por tamaño (más conservadores)
const sizeMultipliers: Record<string, number> = {
  'micro': 0.8, 'pequena': 1.0, 'mediana': 1.2, 'grande': 1.5, 'default': 1.0,
};

// Función para estimar montos automáticamente basado en el nombre del costo
const estimateAmountByName = (costName: string, businessData: any): number | null => {
  if (!businessData || !costName) return null;
  
  const costNameLower = costName.toLowerCase();
  const businessType = businessData.businessCategory || 'cafeteria';
  const location = businessData.sector || 'default';
  const size = businessData.businessSize || 'pequena';
  const capacity = businessData.capacity || 30;
  
  // Obtener multiplicadores
  const typeMultipliers = businessTypeMultipliers[businessType] || businessTypeMultipliers['default'];
  const locationMultiplier = locationMultipliers[location] || locationMultipliers['default'];
  const sizeMultiplier = sizeMultipliers[size] || sizeMultipliers['default'];
  
  // Estimaciones base por tipo de costo
  if (costNameLower.includes('arriendo') || costNameLower.includes('renta') || costNameLower.includes('alquiler')) {
    const baseRent = 600; // Base para local pequeño
    return Math.round(baseRent * typeMultipliers.rent * locationMultiplier * sizeMultiplier);
  }
  
  if (costNameLower.includes('electricidad') || costNameLower.includes('luz')) {
    const baseElectricity = 50; // Base para consumo moderado
    return Math.round(baseElectricity * typeMultipliers.utilities * Math.min(sizeMultiplier, 1.5));
  }
  
  if (costNameLower.includes('agua')) {
    const baseWater = 25;
    return Math.round(baseWater * typeMultipliers.utilities * Math.min(sizeMultiplier, 1.3));
  }
  
  if (costNameLower.includes('internet')) {
    const baseInternet = 45;
    return Math.round(baseInternet * Math.min(sizeMultiplier, 1.2));
  }
  
  if (costNameLower.includes('telefono') || costNameLower.includes('teléfono')) {
    return Math.round(35 * Math.min(sizeMultiplier, 1.2));
  }
  
  if (costNameLower.includes('gas')) {
    const baseGas = businessType === 'restaurante' ? 80 : businessType === 'cafeteria' ? 40 : 20;
    return Math.round(baseGas * typeMultipliers.utilities);
  }
  
  // Personal específico
  if (costNameLower.includes('cocinero') || costNameLower.includes('chef')) {
    return businessType === 'restaurante' ? 700 : 600;
  }
  
  if (costNameLower.includes('mesero') || costNameLower.includes('mozo')) {
    return 500;
  }
  
  if (costNameLower.includes('cajero') || costNameLower.includes('administrador')) {
    return 550;
  }
  
  if (costNameLower.includes('gerente') || costNameLower.includes('supervisor')) {
    return 800;
  }
  
  if (costNameLower.includes('personal') || costNameLower.includes('empleado')) {
    // Estimar empleados necesarios según tipo y capacidad
    let estimatedEmployees = 1;
    if (businessType === 'restaurante') {
      estimatedEmployees = Math.ceil(capacity / 12);
    } else if (businessType === 'cafeteria') {
      estimatedEmployees = Math.ceil(capacity / 20);
    } else if (businessType === 'bar') {
      estimatedEmployees = Math.ceil(capacity / 15);
    }
    return estimatedEmployees * 500; // $500 promedio por empleado
  }
  
  // Seguridad social
  if (costNameLower.includes('seguridad social') || costNameLower.includes('iess')) {
    let estimatedEmployees = 1;
    if (businessType === 'restaurante') {
      estimatedEmployees = Math.ceil(capacity / 12);
    } else if (businessType === 'cafeteria') {
      estimatedEmployees = Math.ceil(capacity / 20);
    }
    return estimatedEmployees * 55; // ~11% del salario promedio
  }
  
  // Servicios básicos (cuando no es específico)
  if (costNameLower.includes('servicios básicos') || costNameLower.includes('servicios')) {
    const baseServices = 120; // Luz + agua + internet + teléfono
    return Math.round(baseServices * typeMultipliers.utilities * Math.min(sizeMultiplier, 1.4));
  }
  
  // Publicidad y marketing
  if (costNameLower.includes('publicidad') || costNameLower.includes('marketing')) {
    const baseMarketing = 150;
    return Math.round(baseMarketing * typeMultipliers.other);
  }
  
  // Mantenimiento
  if (costNameLower.includes('mantenimiento') || costNameLower.includes('reparación')) {
    const baseMaintenance = 100;
    return Math.round(baseMaintenance * typeMultipliers.other * sizeMultiplier);
  }
  
  // Seguros
  if (costNameLower.includes('seguro')) {
    const baseInsurance = 80;
    return Math.round(baseInsurance * sizeMultiplier);
  }
  
  // Licencias y permisos (siempre anuales en Ecuador)
  if (costNameLower.includes('licencia') || costNameLower.includes('permiso')) {
    // Calcular licencias anuales basadas en el tipo de negocio y ubicación
    let baseLicense = 250; // Base anual
    
    // Ajustar por tipo de negocio
    if (businessType === 'restaurante') baseLicense = 400;
    else if (businessType === 'bar') baseLicense = 450;
    else if (businessType === 'cafeteria') baseLicense = 300;
    
    // Ajustar por ubicación (permisos municipales más caros en centros)
    baseLicense = Math.round(baseLicense * locationMultiplier);
    
    return Math.max(200, Math.min(600, baseLicense)); // Limitar entre $200-$600
  }
  
  // Transporte
  if (costNameLower.includes('transporte') || costNameLower.includes('gasolina') || costNameLower.includes('combustible')) {
    const baseTransport = 200;
    return Math.round(baseTransport * sizeMultiplier);
  }
  
  return null; // No se pudo estimar
};

// Plantillas de costos esenciales por tipo de negocio
const getEssentialCostsTemplate = (businessData: any): FixedCostForm['costs'] => {
  if (!businessData) {
    // Plantilla básica si no hay datos del negocio
    return [
      {
        name: 'Arriendo del Local',
        description: 'Renta mensual del local comercial',
        amount: 800,
        frequency: 'mensual' as const,
        category: 'arriendo',
      },
      {
        name: 'Electricidad',
        description: 'Consumo eléctrico mensual',
        amount: 60,
        frequency: 'mensual' as const,
        category: 'servicios',
      },
      {
        name: 'Personal',
        description: 'Sueldos y salarios del personal',
        amount: 500,
        frequency: 'mensual' as const,
        category: 'personal',
      }
    ];
  }

  const businessType = businessData.businessCategory || 'cafeteria';
  const location = businessData.sector || 'default';
  const size = businessData.businessSize || 'pequena';
  const capacity = businessData.capacity || 30;
  
  // Obtener multiplicadores
  const typeMultipliers = businessTypeMultipliers[businessType] || businessTypeMultipliers['default'];
  const locationMultiplier = locationMultipliers[location] || locationMultipliers['default'];
  const sizeMultiplier = sizeMultipliers[size] || sizeMultipliers['default'];

  const baseCosts: FixedCostForm['costs'] = [];

  // 1. ARRIENDO (esencial para todos)
  const baseRent = 600;
  const estimatedRent = Math.round(baseRent * typeMultipliers.rent * locationMultiplier * sizeMultiplier);
  baseCosts.push({
    name: 'Arriendo del Local',
    description: `Renta mensual del local comercial en ${location}`,
    amount: estimatedRent,
    frequency: 'mensual',
    category: 'arriendo',
  });

  // 2. SERVICIOS BÁSICOS (esenciales)
  const baseElectricity = 50;
  const estimatedElectricity = Math.round(baseElectricity * typeMultipliers.utilities * Math.min(sizeMultiplier, 1.5));
  baseCosts.push({
    name: 'Electricidad',
    description: 'Consumo eléctrico mensual del local',
    amount: estimatedElectricity,
    frequency: 'mensual',
    category: 'servicios',
  });

  const baseWater = 25;
  const estimatedWater = Math.round(baseWater * typeMultipliers.utilities * Math.min(sizeMultiplier, 1.3));
  baseCosts.push({
    name: 'Agua',
    description: 'Consumo de agua potable mensual',
    amount: estimatedWater,
    frequency: 'mensual',
    category: 'servicios',
  });

  baseCosts.push({
    name: 'Internet y Teléfono',
    description: 'Plan comercial de internet y línea telefónica',
    amount: Math.round(50 * Math.min(sizeMultiplier, 1.2)),
    frequency: 'mensual',
    category: 'servicios',
  });

  // 3. PERSONAL (según tipo de negocio)
  if (businessType === 'restaurante') {
    const employeesNeeded = Math.ceil(capacity / 12);
    baseCosts.push({
      name: 'Cocinero Principal',
      description: 'Sueldo del chef o cocinero principal',
      amount: 700,
      frequency: 'mensual',
      category: 'personal',
    });
    
    if (employeesNeeded >= 2) {
      baseCosts.push({
        name: 'Meseros',
        description: `Sueldos de ${employeesNeeded - 1} mesero(s)`,
        amount: (employeesNeeded - 1) * 500,
        frequency: 'mensual' as const,
        category: 'personal',
      });
    }
  } else if (businessType === 'cafeteria') {
    const employeesNeeded = Math.ceil(capacity / 20);
    baseCosts.push({
      name: 'Personal de Atención',
      description: `Sueldos de ${employeesNeeded} empleado(s) para atención al cliente`,
      amount: employeesNeeded * 500,
      frequency: 'mensual',
      category: 'personal',
    });
  } else if (businessType === 'bar') {
    baseCosts.push({
      name: 'Bartender',
      description: 'Sueldo del bartender principal',
      amount: 600,
      frequency: 'mensual',
      category: 'personal',
    });
    
    if (capacity > 40) {
      baseCosts.push({
        name: 'Mesero de Bar',
        description: 'Sueldo del mesero adicional',
        amount: 500,
        frequency: 'mensual' as const,
        category: 'personal',
      });
    }
  } else {
    // Otros tipos de negocio
    baseCosts.push({
      name: 'Personal General',
      description: 'Sueldos del personal principal',
      amount: 500,
      frequency: 'mensual',
      category: 'personal',
    });
  }

  // 4. SEGURIDAD SOCIAL (obligatorio si hay empleados)
  const totalPersonalCosts = baseCosts
    .filter(cost => cost.category === 'personal')
    .reduce((sum, cost) => sum + cost.amount, 0);
  
  if (totalPersonalCosts > 0) {
    const estimatedEmployees = Math.round(totalPersonalCosts / 500);
    baseCosts.push({
      name: 'Seguridad Social (IESS)',
      description: `Aportes patronales para ${estimatedEmployees} empleado(s)`,
      amount: estimatedEmployees * 55,
      frequency: 'mensual',
      category: 'seguridad-social',
    });
  }

  // 5. COSTOS ESPECÍFICOS POR TIPO DE NEGOCIO
  if (businessType === 'restaurante' || businessType === 'cafeteria') {
    baseCosts.push({
      name: 'Gas para Cocina',
      description: 'Gas comercial para equipos de cocina',
      amount: businessType === 'restaurante' ? 80 : 40,
      frequency: 'mensual',
      category: 'servicios',
    });
  }

  // 6. OTROS COSTOS IMPORTANTES
  // Calcular licencias según tipo de negocio y ubicación
  let licenseAmount = 250;
  if (businessType === 'restaurante') licenseAmount = 400;
  else if (businessType === 'bar') licenseAmount = 450;
  else if (businessType === 'cafeteria') licenseAmount = 300;
  
  licenseAmount = Math.round(licenseAmount * locationMultiplier);
  licenseAmount = Math.max(200, Math.min(600, licenseAmount));
  
  baseCosts.push({
    name: 'Licencias y Permisos',
    description: 'Permisos municipales y de funcionamiento (anual)',
    amount: licenseAmount,
    frequency: 'anual' as const,
    category: 'licencias',
  });

  baseCosts.push({
    name: 'Seguro del Local',
    description: 'Seguro básico contra incendios y robo',
    amount: Math.round(80 * sizeMultiplier),
    frequency: 'mensual',
    category: 'seguros',
  });

  baseCosts.push({
    name: 'Mantenimiento y Limpieza',
    description: 'Gastos de mantenimiento y productos de limpieza',
    amount: Math.round(120 * sizeMultiplier),
    frequency: 'mensual',
    category: 'mantenimiento',
  });

  baseCosts.push({
    name: 'Publicidad Básica',
    description: 'Marketing digital y promoción básica',
    amount: Math.round(150 * typeMultipliers.other),
    frequency: 'mensual',
    category: 'publicidad',
  });

  return baseCosts;
};

// Validación inteligente con contexto del negocio
const validateCostWithAI = (cost: any) => {
  const validations = [];
  
  // Obtener datos del negocio
  const businessData = BusinessAnalysisService.getBusinessAnalysisData();
  
  if (!businessData) {
    validations.push({
      type: 'warning',
      message: 'No se encontraron datos del negocio. Los rangos mostrados son estimaciones generales.',
      severity: 'low'
    });
    
    // Usar validación básica
    return validateWithBasicRanges(cost, validations);
  }

  // Extraer datos del negocio
  const businessType = businessData.businessCategory || 'default';
  const location = businessData.sector || 'default';
  const size = businessData.businessSize || 'default';
  const capacity = businessData.capacity || 30;
  const businessName = businessData.businessName || 'tu negocio';

  // Obtener multiplicadores
  const typeMultipliers = businessTypeMultipliers[businessType] || businessTypeMultipliers['default'];
  const locationMultiplier = locationMultipliers[location] || locationMultipliers['default'];
  const sizeMultiplier = sizeMultipliers[size] || sizeMultipliers['default'];

  // Detectar servicios específicos por nombre del costo
  const costNameLower = cost.name.toLowerCase();
  let baseRange = null;
  let isSpecificService = false;
  let isPersonnelCost = false;
  
  // Detectar costos de personal por nombre
  const personnelKeywords = ['cocinero', 'mesero', 'cajero', 'gerente', 'empleado', 'personal', 'chef', 'ayudante', 'supervisor', 'administrador'];
  isPersonnelCost = cost.category === 'personal' || personnelKeywords.some(keyword => costNameLower.includes(keyword));
  
  // Buscar servicios específicos primero
  for (const [serviceName, range] of Object.entries(specificServiceRanges)) {
    if (costNameLower.includes(serviceName) || 
        costNameLower.includes(serviceName.slice(0, 4))) { // También busca "elec", "inter", etc.
      baseRange = range;
      isSpecificService = true;
      break;
    }
  }
  
  // Si no es un servicio específico, usar rango por categoría
  if (!baseRange) {
    baseRange = baseCostRanges[cost.category];
  }
  
  if (!baseRange) {
    validations.push({
      type: 'warning',
      message: 'Categoría no reconocida para validación automática.',
      severity: 'low'
    });
    return validations;
  }

  // Aplicar multiplicadores según la categoría del costo
  let categoryMultiplier = 1.0;
  
  if (isSpecificService) {
    // Para servicios específicos, aplicar multiplicadores más conservadores
    if (costNameLower.includes('electricidad') || costNameLower.includes('luz')) {
      categoryMultiplier = typeMultipliers.utilities * Math.min(sizeMultiplier, 1.5); // Limitar el efecto del tamaño
    } else if (costNameLower.includes('agua')) {
      categoryMultiplier = typeMultipliers.utilities * Math.min(sizeMultiplier, 1.3);
    } else if (costNameLower.includes('internet') || costNameLower.includes('telefono')) {
      categoryMultiplier = Math.min(sizeMultiplier, 1.2); // Internet/teléfono no varían mucho por ubicación
    } else {
      categoryMultiplier = typeMultipliers.utilities * sizeMultiplier;
    }
  } else {
    // Lógica original para categorías generales
    switch (cost.category) {
      case 'arriendo':
        categoryMultiplier = typeMultipliers.rent * locationMultiplier * sizeMultiplier;
        break;
      case 'personal':
      case 'seguridad-social':
        categoryMultiplier = typeMultipliers.staff * sizeMultiplier;
        break;
      case 'servicios':
        categoryMultiplier = typeMultipliers.utilities * sizeMultiplier;
        break;
      default:
        categoryMultiplier = typeMultipliers.other * sizeMultiplier;
        break;
    }
  }

  // Calcular rango ajustado
  const adjustedMin = Math.round(baseRange.min * categoryMultiplier);
  const adjustedMax = Math.round(baseRange.max * categoryMultiplier);

  // Manejar costos anuales de manera especial
  const isAnnualCost = cost.frequency === 'anual';
  const actualAmount = cost.amount;
  
  // Para validación, convertir a la misma unidad que el rango base
  let comparisonAmount;
  let comparisonMin;
  let comparisonMax;
  
  if (isAnnualCost && baseRange.unit.includes('año')) {
    // Comparar anuales con anuales (como licencias)
    comparisonAmount = actualAmount;
    comparisonMin = adjustedMin;
    comparisonMax = adjustedMax;
  } else {
    // Convertir todo a mensual para comparación
    comparisonAmount = cost.frequency === 'mensual' ? cost.amount : 
                      cost.frequency === 'semestral' ? cost.amount / 6 : 
                      cost.amount / 12;
    comparisonMin = baseRange.unit.includes('año') ? adjustedMin / 12 : adjustedMin;
    comparisonMax = baseRange.unit.includes('año') ? adjustedMax / 12 : adjustedMax;
  }
  
  // Mantener monthlyAmount para otros cálculos
  const monthlyAmount = cost.frequency === 'mensual' ? cost.amount : 
                       cost.frequency === 'semestral' ? cost.amount / 6 : 
                       cost.amount / 12;

  // Generar contexto descriptivo del negocio
  const businessContext = `${businessType} "${businessName}" en ${location} (${size}, ${capacity} personas)`;
  
  // Generar mensaje con detalles adicionales
  const detailMessage = baseRange.details ? ` • ${baseRange.details}` : '';
  let serviceType = '';
  
  if (isPersonnelCost) {
    const estimatedEmployees = Math.round(monthlyAmount / 500); // Estimación rápida
    serviceType = `costos de personal (estimado: ${estimatedEmployees} empleado${estimatedEmployees !== 1 ? 's' : ''})`;
  } else if (isSpecificService) {
    serviceType = `servicio específico de ${cost.name.toLowerCase()}`;
  } else if (cost.category === 'licencias') {
    const yearlyAmount = cost.frequency === 'anual' ? cost.amount : monthlyAmount * 12;
    serviceType = `licencias y permisos (${cost.frequency === 'anual' ? `$${yearlyAmount.toFixed(2)} anuales` : `~$${yearlyAmount.toFixed(2)} anuales estimados`})`;
  } else {
    serviceType = `categoría "${cost.category}"`;
  }
  
  // Validar y generar mensajes contextuales más precisos usando la unidad correcta
  const unitText = isAnnualCost && baseRange.unit.includes('año') ? 'anuales' : 'mensuales';
  const displayAmount = isAnnualCost && baseRange.unit.includes('año') ? actualAmount : monthlyAmount;
  
  if (comparisonAmount < comparisonMin * 0.7) {
    validations.push({
      type: 'error',
      message: `💰 El monto de $${displayAmount.toFixed(2)} está muy por debajo del rango esperado para ${serviceType} en una ${businessContext}. Se esperaba entre $${comparisonMin.toFixed(2)} y $${comparisonMax.toFixed(2)} ${unitText}${detailMessage}. Verifica si el monto es correcto.`,
      severity: 'high'
    });
  } else if (comparisonAmount < comparisonMin * 0.9) {
    validations.push({
      type: 'warning',
      message: `📊 El monto de $${displayAmount.toFixed(2)} está por debajo del rango típico para ${serviceType} en una ${businessContext}. El rango esperado oscila entre $${comparisonMin.toFixed(2)} y $${comparisonMax.toFixed(2)} ${unitText}${detailMessage}.`,
      severity: 'medium'
    });
  } else if (comparisonAmount > comparisonMax * 1.3) {
    validations.push({
      type: 'error',
      message: `⚠️ El monto de $${displayAmount.toFixed(2)} está significativamente por encima del rango esperado para ${serviceType} en una ${businessContext}. Se esperaba entre $${comparisonMin.toFixed(2)} y $${comparisonMax.toFixed(2)} ${unitText}${detailMessage}. Verifica si el monto es correcto.`,
      severity: 'high'
    });
  } else if (comparisonAmount > comparisonMax * 1.1) {
    validations.push({
      type: 'warning',
      message: `📈 El monto de $${displayAmount.toFixed(2)} está ligeramente por encima del rango típico para ${serviceType} en una ${businessContext}. El rango esperado oscila entre $${comparisonMin.toFixed(2)} y $${comparisonMax.toFixed(2)} ${unitText}${detailMessage}.`,
      severity: 'medium'
    });
  } else {
    // Determinar si está en el rango bajo, medio o alto
    const rangePosition = (comparisonAmount - comparisonMin) / (comparisonMax - comparisonMin);
    let positionText = '';
    
    if (rangePosition < 0.3) {
      positionText = ' (rango bajo)';
    } else if (rangePosition > 0.7) {
      positionText = ' (rango alto)';
    } else {
      positionText = ' (rango promedio)';
    }
    
    validations.push({
      type: 'success',
      message: `✅ El monto de $${displayAmount.toFixed(2)} está dentro del rango esperado para ${serviceType} en una ${businessContext} ($${comparisonMin.toFixed(2)}-$${comparisonMax.toFixed(2)} ${unitText})${positionText}${detailMessage}.`,
      severity: 'none'
    });
  }

  // Agregar insights adicionales
  addContextualInsights(validations, cost, businessData, monthlyAmount, adjustedMin, adjustedMax);

  return validations;
};

// Validación básica cuando no hay datos del negocio
const validateWithBasicRanges = (cost: any, validations: any[]) => {
  const range = baseCostRanges[cost.category];
  if (!range) return validations;

  const monthlyAmount = cost.frequency === 'mensual' ? cost.amount : 
                       cost.frequency === 'semestral' ? cost.amount / 6 : 
                       cost.amount / 12;
  
  if (monthlyAmount < range.min) {
    validations.push({
      type: 'warning',
      message: `El costo parece estar por debajo del rango típico del mercado (${range.min}-${range.max} ${range.unit})`,
      severity: 'low'
    });
  } else if (monthlyAmount > range.max) {
    validations.push({
      type: 'error',
      message: `El costo está significativamente por encima del rango típico del mercado (${range.min}-${range.max} ${range.unit})`,
      severity: 'high'
    });
  } else {
    validations.push({
      type: 'success',
      message: 'El costo está dentro del rango esperado del mercado',
      severity: 'none'
    });
  }

  return validations;
};

// Insights adicionales específicos por contexto
const addContextualInsights = (validations: any[], cost: any, businessData: any, monthlyAmount: number, adjustedMin: number, adjustedMax: number) => {
  const category = cost.category;
  const businessType = businessData.businessCategory;
  const location = businessData.sector;
  const capacity = businessData.capacity;
  const costNameLower = cost.name.toLowerCase();

  // Insights específicos para servicios por nombre
  if (costNameLower.includes('electricidad') || costNameLower.includes('luz')) {
    const estimatedKwh = Math.round(monthlyAmount / 0.095); // Calcular kWh estimados
    
    validations.push({
      type: 'info',
      message: `💡 Cálculo eléctrico: $${monthlyAmount.toFixed(2)} equivale a ~${estimatedKwh} kWh/mes (tarifa $0.095/kWh). Para un local operando 10h/día, esto sugiere un consumo de ~${Math.round(estimatedKwh/300)} kW de potencia instalada.`,
      severity: 'none'
    });

    if (monthlyAmount > 200 && businessType !== 'restaurante') {
      validations.push({
        type: 'warning',
        message: `⚡ Consumo elevado: Para una ${businessType}, $${monthlyAmount.toFixed(2)} en electricidad sugiere un consumo alto. Revisa si incluyes aires acondicionados, cocinas eléctricas o equipos especiales.`,
        severity: 'medium'
      });
    }
  } else if (costNameLower.includes('agua')) {
    // Solo agregar insight si el monto está significativamente por debajo del ajustado mínimo
    if (businessType === 'restaurante' && monthlyAmount < adjustedMin * 0.8) {
      validations.push({
        type: 'info',
        message: `💧 Los restaurantes suelen consumir más agua por limpieza de vajilla, cocina y baños. Considera si $${monthlyAmount.toFixed(2)} es suficiente para las operaciones diarias.`,
        severity: 'none'
      });
    }
  } else if (costNameLower.includes('internet')) {
    if (monthlyAmount > 80 && capacity < 50) {
      validations.push({
        type: 'info',
        message: `📶 Para un negocio de ${capacity} personas, $${monthlyAmount.toFixed(2)} en internet podría ser excesivo. Planes de 100-200 Mbps cuestan $40-60.`,
        severity: 'none'
      });
    }
  }

  // Insights específicos por categoría (mantener lógica original)
  switch (category) {
    case 'arriendo':
      if (businessType === 'restaurante' && monthlyAmount > adjustedMax) {
        validations.push({
          type: 'info',
          message: `🏠 Los restaurantes en ${location} suelen tener costos altos de arriendo debido a ubicaciones estratégicas. Considera si la ubicación justifica este costo.`,
          severity: 'none'
        });
      } else if (monthlyAmount < adjustedMin && ['Centro Histórico', 'La Mariscal'].includes(location)) {
        validations.push({
          type: 'info',
          message: `🏢 Un arriendo bajo en ${location} puede indicar una excelente oportunidad o posibles limitaciones del local. Verifica las condiciones.`,
          severity: 'none'
        });
      }
      break;

    case 'personal':
      // Para sueldos y salarios, calcular empleados de manera más inteligente
      const minSalaryWithBenefits = 500; // Salario mínimo + beneficios básicos
      const estimatedEmployees = Math.round(monthlyAmount / minSalaryWithBenefits);
      const actualCostPerEmployee = monthlyAmount / Math.max(estimatedEmployees, 1);
      
      if (actualCostPerEmployee < 425) {
        const minEmployeesForAmount = Math.floor(monthlyAmount / 425);
        validations.push({
          type: 'warning',
          message: `👥 Con $${monthlyAmount.toFixed(2)}, el costo por empleado sería $${actualCostPerEmployee.toFixed(2)}. Esto está por debajo del salario mínimo ($425). Este monto alcanza para máximo ${minEmployeesForAmount} empleado(s) a salario mínimo.`,
          severity: 'medium'
        });
      } else if (estimatedEmployees >= 1) {
        validations.push({
          type: 'info',
          message: `👥 Estimación: $${monthlyAmount.toFixed(2)} sugiere ~${estimatedEmployees} empleado(s) con salario promedio de $${actualCostPerEmployee.toFixed(2)} (incluye beneficios sociales).`,
          severity: 'none'
        });
      }
      
      // Validación adicional por tipo de negocio
      let expectedEmployeesRange = '';
      if (businessType === 'restaurante') {
        const restaurantEmployees = Math.ceil(capacity / 12); // Restaurantes necesitan más personal
        expectedEmployeesRange = `Para un restaurante de ${capacity} personas, se esperan ${restaurantEmployees}-${restaurantEmployees + 2} empleados.`;
      } else if (businessType === 'cafeteria') {
        const cafeEmployees = Math.ceil(capacity / 20); // Cafeterías necesitan menos personal
        expectedEmployeesRange = `Para una cafetería de ${capacity} personas, se esperan ${cafeEmployees}-${cafeEmployees + 1} empleados.`;
      } else if (businessType === 'bar') {
        const barEmployees = Math.ceil(capacity / 15); // Bares staff intermedio
        expectedEmployeesRange = `Para un bar de ${capacity} personas, se esperan ${barEmployees}-${barEmployees + 1} empleados.`;
      }
      
      if (expectedEmployeesRange) {
        validations.push({
          type: 'info',
          message: `📊 ${expectedEmployeesRange} Tu presupuesto actual cubre ${estimatedEmployees} empleado(s).`,
          severity: 'none'
        });
      }
      break;

    case 'seguridad-social':
      // Para seguridad social, la validación debe estar relacionada con el personal
      const expectedIESS = Math.round(monthlyAmount / 55); // Estimar empleados basado en $55/empleado
      if (expectedIESS < 1) {
        validations.push({
          type: 'warning',
          message: `🏛️ El monto de $${monthlyAmount.toFixed(2)} para seguridad social parece muy bajo. El IESS patronal mínimo por empleado es ~$55/mes (11.15% del salario básico).`,
          severity: 'medium'
        });
      } else {
        validations.push({
          type: 'info',
          message: `🏛️ Seguridad Social: $${monthlyAmount.toFixed(2)} equivale a aportes patronales para ~${expectedIESS} empleado(s) a tarifa básica del IESS.`,
          severity: 'none'
        });
      }
      break;

    case 'publicidad':
      const marketingPercentage = (monthlyAmount / businessData.totalInvestment) * 100 * 12;
      if (marketingPercentage < 3) {
        validations.push({
          type: 'info',
          message: `📢 Tu inversión en publicidad representa ${marketingPercentage.toFixed(1)}% de tu inversión total. Se recomienda entre 3-8% para negocios nuevos.`,
          severity: 'none'
        });
      }
      break;
  }
};

export function FixedCostsPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiValidations, setAiValidations] = useState<Record<number, any[]>>({});
  const [autoSuggestions, setAutoSuggestions] = useState<Record<number, { amount: number; reason: string }>>({});
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  
  // Obtener datos del negocio
  const businessData = BusinessAnalysisService.getBusinessAnalysisData();

  // Generar costos esenciales basados en el negocio usando useMemo para evitar recreaciones
  const essentialCosts = useMemo(() => {
    const costs = getEssentialCostsTemplate(businessData);
    console.log('🏢 Costos esenciales generados:', costs);
    return costs;
  }, [businessData]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<FixedCostForm>({
    resolver: zodResolver(fixedCostSchema),
    defaultValues: {
      costs: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'costs',
  });

  const watchedCosts = watch('costs');

  // Resetear el formulario solo la primera vez cuando se cargan los datos del negocio
  useEffect(() => {
    if (businessData && !isFormInitialized && essentialCosts.length > 0) {
      reset({
        costs: essentialCosts,
      });
      setIsFormInitialized(true);
      console.log('📝 Formulario inicializado con costos precargados');
    } else if (!businessData && !isFormInitialized) {
      // Si no hay datos del negocio, inicializar con un costo básico
      reset({
        costs: [{
          name: '',
          description: '',
          amount: 0,
          frequency: 'mensual' as const,
          category: '',
        }],
      });
      setIsFormInitialized(true);
      console.log('📝 Formulario inicializado sin datos del negocio');
    }
  }, [businessData, essentialCosts, isFormInitialized, reset]);

  // Calcular totales
  const calculateTotals = () => {
    let totalMonthly = 0;
    let totalYearly = 0;

    watchedCosts.forEach((cost) => {
      // Validar que cost.amount sea un número válido
      const amount = Number(cost.amount);
      if (isNaN(amount) || amount < 0) return;
      
      let monthlyAmount = amount;
      if (cost.frequency === 'semestral') monthlyAmount = amount / 6;
      if (cost.frequency === 'anual') monthlyAmount = amount / 12;
      
      totalMonthly += monthlyAmount;
      totalYearly += monthlyAmount * 12;
    });

    return { totalMonthly, totalYearly };
  };

  const { totalMonthly, totalYearly } = calculateTotals();

  // Validar costo con IA
  const validateCost = (index: number) => {
    const cost = watchedCosts[index];
    if (cost.name && cost.amount && cost.category) {
      const validations = validateCostWithAI(cost);
      setAiValidations(prev => ({ ...prev, [index]: validations }));
    } else {
      // Limpiar validaciones si no hay datos suficientes
      setAiValidations(prev => {
        const newValidations = { ...prev };
        delete newValidations[index];
        return newValidations;
      });
    }
  };

  // Validar todos los costos automáticamente cuando cambien los datos
  React.useEffect(() => {
    watchedCosts.forEach((cost, index) => {
      if (cost.name && cost.amount && cost.category) {
        validateCost(index);
      }
    });
  }, [watchedCosts]);

  // Función para autocompletar monto basado en el nombre
  const handleNameChange = (index: number, name: string) => {
    // Actualizar el nombre
    setValue(`costs.${index}.name`, name);
    
    // Limpiar sugerencia anterior
    setAutoSuggestions(prev => {
      const newSuggestions = { ...prev };
      delete newSuggestions[index];
      return newSuggestions;
    });
    
    // Si hay al menos 3 caracteres, intentar estimar
    if (name.length >= 3 && businessData) {
      const estimatedAmount = estimateAmountByName(name, businessData);
      if (estimatedAmount !== null) {
        // Solo sugerir si el campo está vacío o tiene valor 0
        const currentAmount = watchedCosts[index]?.amount || 0;
        if (currentAmount === 0) {
          setValue(`costs.${index}.amount`, estimatedAmount);
          
          // Mostrar información sobre la sugerencia
          const businessType = businessData.businessCategory;
          const location = businessData.sector;
          const reason = `Estimado para ${businessType} en ${location}`;
          
          setAutoSuggestions(prev => ({
            ...prev,
            [index]: { amount: estimatedAmount, reason }
          }));
          
          // Remover la sugerencia después de unos segundos
          setTimeout(() => {
            setAutoSuggestions(prev => {
              const newSuggestions = { ...prev };
              delete newSuggestions[index];
              return newSuggestions;
            });
          }, 5000);
        }
      }
    }
  };

  const addNewCost = () => {
    append({
      name: '',
      description: '',
      amount: 0,
      frequency: 'mensual',
      category: '',
    });
  };

  // Función para recargar costos esenciales
  const loadEssentialCosts = () => {
    if (businessData && essentialCosts.length > 0) {
      reset({
        costs: essentialCosts,
      });
      console.log('🔄 Costos esenciales recargados');
      toast.success('Costos esenciales recargados correctamente');
    } else {
      toast.error('No hay datos del negocio para generar costos esenciales');
    }
  };

  const onSubmit = async (data: FixedCostForm) => {
    setIsSubmitting(true);
    
    try {
      // Aquí se enviarían los datos al backend
      console.log('Costos fijos:', data);
      
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('¡Costos fijos guardados exitosamente!');
      
      // Navegar al siguiente paso
      navigate('/variable-costs');
    } catch (error) {
      toast.error('Error al guardar los costos fijos');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getValidationIcon = (validations: any[]) => {
    if (validations.length === 0) return null;
    
    const hasError = validations.some(v => v.type === 'error');
    const hasWarning = validations.some(v => v.type === 'warning');
    const hasSuccess = validations.some(v => v.type === 'success');
    
    if (hasError) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (hasWarning) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    if (hasSuccess) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <AlertTriangle className="w-5 h-5 text-blue-500" />;
  };

  const getValidationColor = (validations: any[]) => {
    if (validations.length === 0) return 'border-gray-200';
    
    const hasError = validations.some(v => v.type === 'error');
    const hasWarning = validations.some(v => v.type === 'warning');
    const hasSuccess = validations.some(v => v.type === 'success');
    
    if (hasError) return 'border-red-200 bg-red-50';
    if (hasWarning) return 'border-yellow-200 bg-yellow-50';
    if (hasSuccess) return 'border-green-200 bg-green-50';
    return 'border-blue-200 bg-blue-50';
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Costos Fijos del Negocio
          </h1>
          <p className="text-lg text-gray-600">
            Revisa y ajusta los costos fijos esenciales precargados para tu negocio. 
            Puedes modificar valores, agregar o eliminar costos según tus necesidades.
          </p>
        </div>

        {/* Panel de contexto del negocio */}
        {businessData && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {businessData.businessName}
                </h3>
                <p className="text-sm text-gray-600">
                  {businessData.businessCategory} • {businessData.sector} • {businessData.businessSize}
                </p>
              </div>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                🎯 Costos Precargados Inteligentemente
              </h4>
              <p className="text-sm text-blue-800">
                Hemos precargado automáticamente todos los costos fijos esenciales para una 
                <strong> {businessData.businessCategory}</strong> en <strong>{businessData.sector}</strong> 
                (tamaño <strong>{businessData.businessSize}</strong>, <strong>{businessData.capacity} personas</strong>).
                Los montos están estimados según las características específicas de tu negocio.
              </p>
              <div className="mt-3 p-3 bg-white/80 rounded-lg border border-blue-300">
                <p className="text-sm text-blue-900">
                  <span className="font-medium">✅ Incluye:</span> Arriendo, servicios básicos (electricidad, agua, internet), 
                  personal necesario, seguridad social, seguros, licencias, mantenimiento y publicidad básica.
                  <br />
                  <span className="font-medium">✨ Personalizable:</span> Puedes ajustar cualquier monto, agregar costos adicionales o eliminar los que no apliquen.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Advertencia si no hay datos del negocio */}
        {!businessData && (
          <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900">
                  Validación Básica Activa
                </h3>
                <p className="text-sm text-yellow-800 mt-1">
                  No se encontraron datos específicos de tu negocio. Las validaciones usarán rangos generales del mercado. 
                  Para obtener análisis más precisos, completa primero la <strong>Configuración del Negocio</strong>.
                </p>
                <button
                  onClick={() => navigate('/business-setup')}
                  className="mt-3 text-sm text-yellow-700 underline hover:text-yellow-900"
                >
                  Ir a Configuración del Negocio →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resumen de costos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen de Costos</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">${(totalMonthly || 0).toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Mensual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">${(totalYearly || 0).toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Anual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{fields.length}</div>
              <div className="text-sm text-gray-600">Costos Registrados</div>
            </div>
          </div>
        </div>

        {/* Formulario de costos */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-primary-600" />
                Lista de Costos Fijos
              </h2>
              <div className="flex space-x-3">
                {businessData && (
                  <button
                    type="button"
                    onClick={loadEssentialCosts}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Recargar Costos Esenciales</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={addNewCost}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Costo</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={`border-2 rounded-lg p-6 transition-all duration-200 ${getValidationColor(aiValidations[index] || [])}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Costo #{index + 1}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getValidationIcon(aiValidations[index] || [])}
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Nombre del costo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Costo *
                      </label>
                      <Controller
                        name={`costs.${index}.name`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.costs?.[index]?.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Ej: Arriendo del Local, Electricidad, Cocinero..."
                            onChange={(e) => handleNameChange(index, e.target.value)}
                            onBlur={() => validateCost(index)}
                          />
                        )}
                      />
                      {errors.costs?.[index]?.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.costs[index]?.name?.message}</p>
                      )}
                    </div>

                    {/* Categoría */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría *
                      </label>
                      <Controller
                        name={`costs.${index}.category`}
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.costs?.[index]?.category ? 'border-red-500' : 'border-gray-300'
                            }`}
                            onChange={(e) => {
                              field.onChange(e);
                              validateCost(index);
                            }}
                          >
                            <option value="">Selecciona una categoría</option>
                            {costCategories.map((category) => (
                              <option key={category.value} value={category.value}>
                                {category.icon} {category.label}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                      {errors.costs?.[index]?.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.costs[index]?.category?.message}</p>
                      )}
                      {watchedCosts[index]?.category && (
                        <p className="mt-2 text-sm text-gray-600">
                          {costCategories.find(c => c.value === watchedCosts[index].category)?.description}
                        </p>
                      )}
                    </div>

                    {/* Monto */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monto (USD) *
                      </label>
                      <Controller
                        name={`costs.${index}.amount`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            min="0.01"
                            step="0.01"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.costs?.[index]?.amount ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                            onChange={(e) => {
                              const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                              field.onChange(isNaN(value) ? 0 : value);
                              // Validar después de un pequeño delay para evitar validaciones excesivas
                              setTimeout(() => validateCost(index), 300);
                            }}
                            onBlur={() => validateCost(index)}
                          />
                        )}
                      />
                      {errors.costs?.[index]?.amount && (
                        <p className="mt-1 text-sm text-red-600">{errors.costs[index]?.amount?.message}</p>
                      )}
                      
                      {/* Mostrar sugerencia automática */}
                      {autoSuggestions[index] && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <p className="text-sm text-blue-800">
                              <span className="font-medium">💡 Sugerencia automática:</span> ${autoSuggestions[index].amount} • {autoSuggestions[index].reason}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Frecuencia */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frecuencia de Pago *
                      </label>
                      <Controller
                        name={`costs.${index}.frequency`}
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                              errors.costs?.[index]?.frequency ? 'border-red-500' : 'border-gray-300'
                            }`}
                            onChange={(e) => {
                              field.onChange(e);
                              validateCost(index);
                            }}
                          >
                            {frequencyOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                      {errors.costs?.[index]?.frequency && (
                        <p className="mt-1 text-sm text-red-600">{errors.costs[index]?.frequency?.message}</p>
                      )}
                    </div>

                    {/* Descripción */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción (Opcional)
                      </label>
                      <Controller
                        name={`costs.${index}.description`}
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            rows={2}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Describe brevemente este costo..."
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Botón de análisis manual */}
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => validateCost(index)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      🔍 Analizar Costo
                    </button>
                  </div>

                  {/* Validaciones de IA */}
                  {aiValidations[index] && aiValidations[index].length > 0 && (
                    <div className="mt-4 space-y-2">
                      {aiValidations[index].map((validation, vIndex) => (
                        <div
                          key={vIndex}
                          className={`p-3 rounded-lg text-sm ${
                            validation.type === 'error'
                              ? 'bg-red-50 border border-red-200 text-red-800'
                              : validation.type === 'warning'
                              ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                              : validation.type === 'success'
                              ? 'bg-green-50 border border-green-200 text-green-800'
                              : 'bg-blue-50 border border-blue-200 text-blue-800'
                          }`}
                        >
                          {validation.message}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Resumen del costo */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Costo mensual equivalente:</span>
                      <span className="font-semibold text-gray-900">
                        ${(() => {
                          const cost = watchedCosts[index];
                          const amount = Number(cost.amount) || 0;
                          if (cost.frequency === 'mensual') return amount.toFixed(2);
                          if (cost.frequency === 'semestral') return (amount / 6).toFixed(2);
                          return (amount / 12).toFixed(2);
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between items-center pt-6">
            <button
              type="button"
              onClick={() => navigate('/business-setup')}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Paso Anterior</span>
            </button>
            
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar y Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
