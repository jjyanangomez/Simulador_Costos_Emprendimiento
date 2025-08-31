// 🔍 SERVICIO DE ANÁLISIS DE IA PARA COSTOS FIJOS
// Este servicio analiza los costos fijos ingresados usando IA para detectar inconsistencias,
// costos faltantes y validar rangos según el tipo de negocio

import { BusinessAnalysisService } from './BusinessAnalysisService';

// Interfaces para el análisis
export interface CostAnalysisResult {
  costId: string;
  costName: string;
  category: string;
  amount: number;
  frequency: string;
  monthlyEquivalent: number;
  analysis: {
    isReasonable: boolean;
    isMissing: boolean;
    observations: string[];
    recommendations: string[];
    riskLevel: 'low' | 'medium' | 'high';
    expectedRange: {
      min: number;
      max: number;
      unit: string;
    };
  };
}

export interface OverallAnalysisResult {
  summary: {
    totalCosts: number;
    totalMonthly: number;
    totalYearly: number;
    completeness: number; // Porcentaje de completitud
    riskLevel: 'low' | 'medium' | 'high';
  };
  costAnalysis: CostAnalysisResult[];
  missingCosts: {
    category: string;
    name: string;
    estimatedAmount: number;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  businessInsights: string[];
  recommendations: string[];
  warnings: string[];
  aiScore: number; // Puntuación general del análisis (0-100)
}

export class FixedCostsAnalysisService {
  
  // Rangos base por categoría (valores realistas del mercado ecuatoriano 2024)
  private static readonly baseCostRanges: Record<string, { min: number; max: number; unit: string; details?: string }> = {
    arriendo: { min: 400, max: 1200, unit: 'USD/mes', details: 'Locales comerciales pequeños a medianos' },
    personal: { min: 425, max: 3200, unit: 'USD/mes total', details: '1-4 empleados: $425-800 c/u + beneficios' },
    'seguridad-social': { min: 50, max: 100, unit: 'USD/mes por empleado', details: 'IESS patronal (~11.15% del salario básico)' },
    servicios: { min: 80, max: 250, unit: 'USD/mes', details: 'Luz, agua, internet, teléfono combinados' },
    publicidad: { min: 50, max: 400, unit: 'USD/mes', details: 'Marketing digital y tradicional' },
    licencias: { min: 100, max: 600, unit: 'USD/año', details: 'Permisos municipales y funcionamiento' },
    seguros: { min: 30, max: 150, unit: 'USD/mes', details: 'Seguros básicos para negocios pequeños' },
    mantenimiento: { min: 50, max: 250, unit: 'USD/mes', details: 'Mantenimiento preventivo y correctivo' },
    transporte: { min: 100, max: 500, unit: 'USD/mes', details: 'Gastos de movilización y logística' },
    otros: { min: 30, max: 150, unit: 'USD/mes', details: 'Gastos varios e imprevistos' },
  };

  // Multiplicadores por tipo de negocio
  private static readonly businessTypeMultipliers: Record<string, { rent: number; staff: number; utilities: number; other: number }> = {
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

  // Multiplicadores por ubicación
  private static readonly locationMultipliers: Record<string, number> = {
    'Centro Histórico': 1.4, 'La Mariscal': 1.3, 'Cumbayá': 1.3, 'La Floresta': 1.2,
    'Guápulo': 1.1, 'Bellavista': 1.2, 'Tumbaco': 1.1, 'Valle de los Chillos': 1.0,
    'San Rafael': 1.0, 'Calderón': 0.9, 'Carapungo': 0.8, 'Pomasqui': 0.9,
    'San Antonio': 0.8, 'Conocoto': 0.9, 'Sangolquí': 0.9, 'default': 1.0,
  };

  // Multiplicadores por tamaño
  private static readonly sizeMultipliers: Record<string, number> = {
    'micro': 0.8, 'pequena': 1.0, 'mediana': 1.2, 'grande': 1.5, 'default': 1.0,
  };

  // Costos esenciales por tipo de negocio
  private static readonly essentialCostsByBusiness: Record<string, string[]> = {
    'restaurante': ['arriendo', 'personal', 'seguridad-social', 'servicios', 'licencias', 'seguros', 'mantenimiento'],
    'cafeteria': ['arriendo', 'personal', 'seguridad-social', 'servicios', 'licencias', 'seguros'],
    'bar': ['arriendo', 'personal', 'seguridad-social', 'servicios', 'licencias', 'seguros', 'mantenimiento'],
    'pizzeria': ['arriendo', 'personal', 'seguridad-social', 'servicios', 'licencias', 'seguros', 'mantenimiento'],
    'panaderia': ['arriendo', 'personal', 'seguridad-social', 'servicios', 'licencias', 'seguros', 'mantenimiento'],
    'heladeria': ['arriendo', 'personal', 'seguridad-social', 'servicios', 'licencias', 'seguros'],
    'fast-food': ['arriendo', 'personal', 'seguridad-social', 'servicios', 'licencias', 'seguros', 'mantenimiento'],
    'catering': ['personal', 'seguridad-social', 'servicios', 'licencias', 'seguros', 'transporte'],
    'default': ['arriendo', 'personal', 'seguridad-social', 'servicios', 'licencias', 'seguros'],
  };

  /**
   * 🔍 Analiza los costos fijos ingresados usando IA
   * @param fixedCosts - Array de costos fijos ingresados
   * @returns OverallAnalysisResult - Resultado completo del análisis
   */
  static analyzeFixedCosts(fixedCosts: any[]): OverallAnalysisResult {
    try {
      const businessData = BusinessAnalysisService.getBusinessAnalysisData();
      if (!businessData) {
        throw new Error('No hay datos del negocio disponibles para el análisis');
      }

      console.log('🔍 Iniciando análisis de costos fijos para:', businessData.businessName);

      // Analizar cada costo individualmente
      const costAnalysis = fixedCosts.map((cost, index) => 
        this.analyzeIndividualCost(cost, businessData, index)
      );

      // Detectar costos faltantes
      const missingCosts = this.detectMissingCosts(fixedCosts, businessData);

      // Generar insights del negocio
      const businessInsights = this.generateBusinessInsights(fixedCosts, businessData);

      // Generar recomendaciones
      const recommendations = this.generateRecommendations(costAnalysis, missingCosts, businessData);

      // Generar advertencias
      const warnings = this.generateWarnings(costAnalysis, businessData);

      // Calcular puntuación general
      const aiScore = this.calculateOverallScore(costAnalysis, missingCosts, businessData);

      // Calcular totales
      const totalMonthly = costAnalysis.reduce((sum, cost) => sum + cost.monthlyEquivalent, 0);
      const totalYearly = totalMonthly * 12;

      // Calcular completitud
      const essentialCosts = this.essentialCostsByBusiness[businessData.businessCategory] || 
                           this.essentialCostsByBusiness.default;
      const coveredCosts = essentialCosts.filter(category => 
        fixedCosts.some(cost => cost.category === category)
      );
      const completeness = (coveredCosts.length / essentialCosts.length) * 100;

      // Determinar nivel de riesgo general
      const riskLevel = this.determineOverallRiskLevel(costAnalysis, missingCosts, businessData);

      const result: OverallAnalysisResult = {
        summary: {
          totalCosts: fixedCosts.length,
          totalMonthly,
          totalYearly,
          completeness: Math.round(completeness),
          riskLevel,
        },
        costAnalysis,
        missingCosts,
        businessInsights,
        recommendations,
        warnings,
        aiScore: Math.round(aiScore),
      };

      console.log('✅ Análisis de costos fijos completado:', result);
      return result;

    } catch (error) {
      console.error('❌ Error en el análisis de costos fijos:', error);
      throw error;
    }
  }

  /**
   * 🔍 Analiza un costo individual
   */
  private static analyzeIndividualCost(cost: any, businessData: any, index: number): CostAnalysisResult {
    const monthlyEquivalent = this.calculateMonthlyEquivalent(cost.amount, cost.frequency);
    const expectedRange = this.calculateExpectedRange(cost.category, businessData);
    
    // Validar si el monto está dentro del rango esperado
    const isReasonable = monthlyEquivalent >= expectedRange.min && monthlyEquivalent <= expectedRange.max;
    
    // Determinar nivel de riesgo
    const riskLevel = this.determineCostRiskLevel(monthlyEquivalent, expectedRange, businessData);
    
    // Generar observaciones
    const observations = this.generateCostObservations(cost, monthlyEquivalent, expectedRange, businessData);
    
    // Generar recomendaciones
    const recommendations = this.generateCostRecommendations(cost, monthlyEquivalent, expectedRange, businessData);

    return {
      costId: `cost_${index}`,
      costName: cost.name,
      category: cost.category,
      amount: cost.amount,
      frequency: cost.frequency,
      monthlyEquivalent,
      analysis: {
        isReasonable,
        isMissing: false,
        observations,
        recommendations,
        riskLevel,
        expectedRange,
      },
    };
  }

  /**
   * 🧮 Calcula el equivalente mensual de un costo
   */
  private static calculateMonthlyEquivalent(amount: number, frequency: string): number {
    switch (frequency) {
      case 'mensual': return amount;
      case 'semestral': return amount / 6;
      case 'anual': return amount / 12;
      default: return amount;
    }
  }

  /**
   * 📊 Calcula el rango esperado para una categoría según el negocio
   */
  private static calculateExpectedRange(category: string, businessData: any): { min: number; max: number; unit: string } {
    const baseRange = this.baseCostRanges[category] || this.baseCostRanges.otros;
    const businessMultiplier = this.businessTypeMultipliers[businessData.businessCategory] || 
                              this.businessTypeMultipliers.default;
    const locationMultiplier = this.locationMultipliers[businessData.sector] || 
                              this.locationMultipliers.default;
    const sizeMultiplier = this.sizeMultipliers[businessData.businessSize] || 
                          this.sizeMultipliers.default;

    // Aplicar multiplicadores según la categoría
    let categoryMultiplier = 1.0;
    if (category === 'arriendo') categoryMultiplier = businessMultiplier.rent;
    else if (category === 'personal' || category === 'seguridad-social') categoryMultiplier = businessMultiplier.staff;
    else if (category === 'servicios') categoryMultiplier = businessMultiplier.utilities;
    else categoryMultiplier = businessMultiplier.other;

    const totalMultiplier = categoryMultiplier * locationMultiplier * sizeMultiplier;

    return {
      min: Math.round(baseRange.min * totalMultiplier),
      max: Math.round(baseRange.max * totalMultiplier),
      unit: baseRange.unit,
    };
  }

  /**
   * ⚠️ Determina el nivel de riesgo de un costo
   */
  private static determineCostRiskLevel(monthlyAmount: number, expectedRange: any, businessData: any): 'low' | 'medium' | 'high' {
    if (monthlyAmount >= expectedRange.min && monthlyAmount <= expectedRange.max) {
      return 'low';
    }
    
    const deviation = monthlyAmount < expectedRange.min 
      ? (expectedRange.min - monthlyAmount) / expectedRange.min
      : (monthlyAmount - expectedRange.max) / expectedRange.max;
    
    if (deviation <= 0.3) return 'medium';
    return 'high';
  }

  /**
   * 📝 Genera observaciones para un costo
   */
  private static generateCostObservations(cost: any, monthlyAmount: number, expectedRange: any, businessData: any): string[] {
    const observations: string[] = [];
    
    if (monthlyAmount < expectedRange.min) {
      observations.push(`El monto de $${monthlyAmount.toFixed(2)} está por debajo del rango esperado ($${expectedRange.min}-$${expectedRange.max}) para ${businessData.sector}`);
    } else if (monthlyAmount > expectedRange.max) {
      observations.push(`El monto de $${monthlyAmount.toFixed(2)} está por encima del rango esperado ($${expectedRange.min}-$${expectedRange.max}) para ${businessData.sector}`);
    } else {
      observations.push(`El monto está dentro del rango esperado para ${businessData.sector}`);
    }

    // Observaciones específicas por categoría
    switch (cost.category) {
      case 'arriendo':
        if (monthlyAmount > expectedRange.max * 1.2) {
          observations.push('El arriendo representa un porcentaje alto de los costos fijos totales');
        }
        break;
      case 'personal':
        const expectedStaff = Math.round(monthlyAmount / 500); // Estimación aproximada
        observations.push(`El costo de personal sugiere aproximadamente ${expectedStaff} empleado(s)`);
        break;
      case 'servicios':
        if (monthlyAmount < 50) {
          observations.push('El costo de servicios básicos parece muy bajo, verifica que incluya todos los servicios necesarios');
        }
        break;
    }

    return observations;
  }

  /**
   * 💡 Genera recomendaciones para un costo
   */
  private static generateCostRecommendations(cost: any, monthlyAmount: number, expectedRange: any, businessData: any): string[] {
    const recommendations: string[] = [];
    
    if (monthlyAmount < expectedRange.min) {
      recommendations.push(`Considera aumentar el presupuesto para ${cost.name} a al menos $${expectedRange.min} para cubrir costos reales`);
    } else if (monthlyAmount > expectedRange.max) {
      recommendations.push(`Evalúa si el costo de $${monthlyAmount.toFixed(2)} para ${cost.name} es justificable o si puedes optimizar`);
    }

    // Recomendaciones específicas por categoría
    switch (cost.category) {
      case 'arriendo':
        if (monthlyAmount > expectedRange.max * 1.2) {
          recommendations.push('Considera negociar el arriendo o buscar alternativas en zonas más económicas');
        }
        break;
      case 'personal':
        recommendations.push('Asegúrate de incluir todos los beneficios sociales y cargas patronales');
        break;
      case 'servicios':
        recommendations.push('Verifica que incluyas electricidad, agua, internet y teléfono en el presupuesto');
        break;
    }

    return recommendations;
  }

  /**
   * 🔍 Detecta costos faltantes esenciales
   */
  private static detectMissingCosts(fixedCosts: any[], businessData: any): any[] {
    const essentialCosts = this.essentialCostsByBusiness[businessData.businessCategory] || 
                         this.essentialCostsByBusiness.default;
    
    const coveredCategories = fixedCosts.map(cost => cost.category);
    const missingCategories = essentialCosts.filter(category => !coveredCategories.includes(category));
    
    return missingCategories.map(category => {
      const estimatedAmount = this.estimateMissingCostAmount(category, businessData);
      return {
        category,
        name: this.getCategoryDisplayName(category),
        estimatedAmount,
        reason: this.getMissingCostReason(category, businessData),
        priority: this.getMissingCostPriority(category),
      };
    });
  }

  /**
   * 💰 Estima el monto para un costo faltante
   */
  private static estimateMissingCostAmount(category: string, businessData: any): number {
    const baseRange = this.baseCostRanges[category];
    if (!baseRange) return 100;

    const businessMultiplier = this.businessTypeMultipliers[businessData.businessCategory] || 
                              this.businessTypeMultipliers.default;
    const locationMultiplier = this.locationMultipliers[businessData.sector] || 
                              this.locationMultipliers.default;
    const sizeMultiplier = this.sizeMultipliers[businessData.businessSize] || 
                          this.sizeMultipliers.default;

    let categoryMultiplier = 1.0;
    if (category === 'arriendo') categoryMultiplier = businessMultiplier.rent;
    else if (category === 'personal' || category === 'seguridad-social') categoryMultiplier = businessMultiplier.staff;
    else if (category === 'servicios') categoryMultiplier = businessMultiplier.utilities;
    else categoryMultiplier = businessMultiplier.other;

    const totalMultiplier = categoryMultiplier * locationMultiplier * sizeMultiplier;
    return Math.round((baseRange.min + baseRange.max) / 2 * totalMultiplier);
  }

  /**
   * 📝 Obtiene el nombre de visualización de una categoría
   */
  private static getCategoryDisplayName(category: string): string {
    const categoryNames: Record<string, string> = {
      'arriendo': 'Arriendo/Renta del Local',
      'personal': 'Sueldos y Salarios',
      'seguridad-social': 'Seguridad Social (IESS)',
      'servicios': 'Servicios Básicos',
      'publicidad': 'Publicidad y Marketing',
      'licencias': 'Licencias y Permisos',
      'seguros': 'Seguros',
      'mantenimiento': 'Mantenimiento',
      'transporte': 'Transporte y Logística',
      'otros': 'Otros Costos',
    };
    return categoryNames[category] || category;
  }

  /**
   * 🎯 Obtiene la razón por la que falta un costo
   */
  private static getMissingCostReason(category: string, businessData: any): string {
    const reasons: Record<string, string> = {
      'arriendo': `Esencial para ${businessData.businessCategory} con local físico`,
      'personal': `Necesario para operar ${businessData.businessCategory} con ${businessData.capacity} personas`,
      'seguridad-social': `Obligatorio por ley para empleados`,
      'servicios': `Indispensable para el funcionamiento del negocio`,
      'licencias': `Requerido por el municipio para operar`,
      'seguros': `Protección básica para el negocio`,
      'mantenimiento': `Mantenimiento preventivo del local y equipos`,
      'transporte': `Para entrega y logística del negocio`,
    };
    return reasons[category] || 'Costo importante para el tipo de negocio';
  }

  /**
   * ⚡ Obtiene la prioridad de un costo faltante
   */
  private static getMissingCostPriority(category: string): 'high' | 'medium' | 'low' {
    const highPriority = ['arriendo', 'personal', 'seguridad-social', 'servicios', 'licencias'];
    const mediumPriority = ['seguros', 'mantenimiento'];
    
    if (highPriority.includes(category)) return 'high';
    if (mediumPriority.includes(category)) return 'medium';
    return 'low';
  }

  /**
   * 💡 Genera insights del negocio
   */
  private static generateBusinessInsights(fixedCosts: any[], businessData: any): string[] {
    const insights: string[] = [];
    const totalMonthly = fixedCosts.reduce((sum, cost) => 
      sum + this.calculateMonthlyEquivalent(cost.amount, cost.frequency), 0
    );

    // Insight sobre la estructura de costos
    const rentCost = fixedCosts.find(cost => cost.category === 'arriendo');
    if (rentCost) {
      const rentMonthly = this.calculateMonthlyEquivalent(rentCost.amount, rentCost.frequency);
      const rentPercentage = (rentMonthly / totalMonthly) * 100;
      if (rentPercentage > 40) {
        insights.push(`El arriendo representa el ${rentPercentage.toFixed(1)}% de los costos fijos, lo cual es alto`);
      }
    }

    // Insight sobre personal
    const staffCost = fixedCosts.find(cost => cost.category === 'personal');
    if (staffCost) {
      const staffMonthly = this.calculateMonthlyEquivalent(staffCost.amount, staffCost.frequency);
      insights.push(`El costo de personal es de $${staffMonthly.toFixed(2)} mensuales`);
    }

    // Insight sobre servicios
    const servicesCost = fixedCosts.find(cost => cost.category === 'servicios');
    if (servicesCost) {
      const servicesMonthly = this.calculateMonthlyEquivalent(servicesCost.amount, servicesCost.frequency);
      if (servicesMonthly < 100) {
        insights.push('El presupuesto de servicios básicos es conservador, considera incluir todos los servicios necesarios');
      }
    }

    return insights;
  }

  /**
   * 📋 Genera recomendaciones generales
   */
  private static generateRecommendations(costAnalysis: CostAnalysisResult[], missingCosts: any[], businessData: any): string[] {
    const recommendations: string[] = [];

    // Recomendaciones basadas en costos faltantes
    if (missingCosts.length > 0) {
      const highPriorityMissing = missingCosts.filter(cost => cost.priority === 'high');
      if (highPriorityMissing.length > 0) {
        recommendations.push(`Agrega los costos faltantes de alta prioridad: ${highPriorityMissing.map(c => c.name).join(', ')}`);
      }
    }

    // Recomendaciones basadas en análisis de costos
    const highRiskCosts = costAnalysis.filter(cost => cost.analysis.riskLevel === 'high');
    if (highRiskCosts.length > 0) {
      recommendations.push('Revisa los costos marcados como de alto riesgo para optimizar el presupuesto');
    }

    // Recomendaciones específicas del negocio
    if (businessData.businessCategory === 'restaurante') {
      recommendations.push('Para restaurantes, asegúrate de incluir costos de mantenimiento de equipos de cocina');
    }

    return recommendations;
  }

  /**
   * ⚠️ Genera advertencias
   */
  private static generateWarnings(costAnalysis: CostAnalysisResult[], businessData: any): string[] {
    const warnings: string[] = [];

    // Advertencias sobre costos altos
    const highCosts = costAnalysis.filter(cost => cost.analysis.riskLevel === 'high');
    if (highCosts.length > 0) {
      warnings.push(`${highCosts.length} costo(s) están fuera de los rangos esperados para ${businessData.sector}`);
    }

    // Advertencias sobre costos faltantes críticos
    const criticalCategories = ['arriendo', 'personal', 'servicios'];
    const hasCriticalCosts = criticalCategories.every(category => 
      costAnalysis.some(cost => cost.category === category)
    );
    
    if (!hasCriticalCosts) {
      warnings.push('Faltan costos críticos para el funcionamiento del negocio');
    }

    return warnings;
  }

  /**
   * 🎯 Calcula la puntuación general del análisis
   */
  private static calculateOverallScore(costAnalysis: CostAnalysisResult[], missingCosts: any[], businessData: any): number {
    let score = 100;

    // Penalizar por costos faltantes
    const essentialCosts = this.essentialCostsByBusiness[businessData.businessCategory] || 
                         this.essentialCostsByBusiness.default;
    const coveredCosts = essentialCosts.filter(category => 
      costAnalysis.some(cost => cost.category === category)
    );
    const missingCostsPenalty = ((essentialCosts.length - coveredCosts.length) / essentialCosts.length) * 30;
    score -= missingCostsPenalty;

    // Penalizar por costos de alto riesgo
    const highRiskCosts = costAnalysis.filter(cost => cost.analysis.riskLevel === 'high');
    const riskPenalty = (highRiskCosts.length / costAnalysis.length) * 20;
    score -= riskPenalty;

    // Penalizar por costos de riesgo medio
    const mediumRiskCosts = costAnalysis.filter(cost => cost.analysis.riskLevel === 'medium');
    const mediumRiskPenalty = (mediumRiskCosts.length / costAnalysis.length) * 10;
    score -= mediumRiskPenalty;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * ⚠️ Determina el nivel de riesgo general
   */
  private static determineOverallRiskLevel(costAnalysis: CostAnalysisResult[], missingCosts: any[], businessData: any): 'low' | 'medium' | 'high' {
    const score = this.calculateOverallScore(costAnalysis, missingCosts, businessData);
    
    if (score >= 80) return 'low';
    if (score >= 60) return 'medium';
    return 'high';
  }

  /**
   * 💾 Guarda el resultado del análisis en localStorage
   */
  static saveAnalysisResult(analysisResult: OverallAnalysisResult): boolean {
    try {
      localStorage.setItem('fixedCostsAnalysisResult', JSON.stringify({
        ...analysisResult,
        analysisDate: new Date().toISOString(),
      }));
      return true;
    } catch (error) {
      console.error('❌ Error al guardar resultado del análisis:', error);
      return false;
    }
  }

  /**
   * 📖 Recupera el resultado del análisis desde localStorage
   */
  static getAnalysisResult(): OverallAnalysisResult | null {
    try {
      const data = localStorage.getItem('fixedCostsAnalysisResult');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Error al recuperar resultado del análisis:', error);
      return null;
    }
  }
}
