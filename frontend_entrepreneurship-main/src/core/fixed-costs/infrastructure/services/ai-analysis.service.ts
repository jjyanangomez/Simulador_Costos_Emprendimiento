import { FixedCost, BusinessData, AIAnalysisResult, CostValidation, MissingCost } from '../../domain/types';

export class AIAnalysisService {
  
  // Rangos de mercado para diferentes tipos de costos en Ecuador
  private static readonly MARKET_RANGES = {
    arriendo: { min: 800, max: 5000, unit: 'USD/mes' },
    personal: { min: 425, max: 2000, unit: 'USD/mes por empleado' },
    'seguridad-social': { min: 50, max: 200, unit: 'USD/mes por empleado' },
    servicios: { min: 150, max: 800, unit: 'USD/mes' },
    publicidad: { min: 200, max: 2000, unit: 'USD/mes' },
    licencias: { min: 50, max: 500, unit: 'USD/año' },
    seguros: { min: 100, max: 800, unit: 'USD/mes' },
    mantenimiento: { min: 100, max: 1000, unit: 'USD/mes' },
    transporte: { min: 200, max: 1500, unit: 'USD/mes' },
    otros: { min: 50, max: 500, unit: 'USD/mes' },
  };

  // Costos esenciales por tipo de negocio
  private static readonly ESSENTIAL_COSTS = {
    restaurante: ['arriendo', 'servicios', 'personal', 'licencias', 'seguros'],
    cafetería: ['arriendo', 'servicios', 'personal', 'licencias'],
    tienda: ['arriendo', 'servicios', 'personal', 'licencias', 'publicidad'],
    oficina: ['arriendo', 'servicios', 'personal', 'licencias'],
    taller: ['arriendo', 'servicios', 'personal', 'licencias', 'mantenimiento'],
    consultorio: ['arriendo', 'servicios', 'personal', 'licencias', 'seguros'],
  };

  // Factores de ubicación para ajustar rangos
  private static readonly LOCATION_FACTORS = {
    'Centro Histórico': 1.3,
    'La Mariscal': 1.2,
    'La Floresta': 1.1,
    'Cumbayá': 0.9,
    'Tumbaco': 0.8,
    'Valle de los Chillos': 0.7,
    'default': 1.0,
  };

  static async analyzeFixedCosts(costs: FixedCost[], businessData: BusinessData): Promise<AIAnalysisResult> {
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1500));

    const validations: CostValidation[] = [];
    const missingCosts: MissingCost[] = [];
    const recommendations: string[] = [];

    // 1. Validar costos existentes
    costs.forEach(cost => {
      const costValidations = this.validateCost(cost, businessData);
      validations.push(...costValidations);
    });

    // 2. Detectar costos faltantes
    const essentialCosts = this.getEssentialCosts(businessData.businessType);
    const existingCategories = costs.map(c => c.category);
    const missingCategories = essentialCosts.filter(cat => !existingCategories.includes(cat));

    missingCategories.forEach(category => {
      const missingCost = this.generateMissingCost(category, businessData);
      missingCosts.push(missingCost);
    });

    // 3. Generar recomendaciones
    recommendations.push(...this.generateRecommendations(costs, businessData, validations, missingCosts));

    // 4. Calcular puntuación general
    const score = this.calculateOverallScore(validations, missingCosts, costs.length);

    // 5. Generar resumen
    const summary = this.generateSummary(costs, validations, missingCosts);

    return {
      summary,
      validations,
      missingCosts,
      recommendations,
      overallAssessment: this.generateOverallAssessment(score, missingCosts.length, validations),
      score,
    };
  }

  private static validateCost(cost: FixedCost, businessData: BusinessData): CostValidation[] {
    const validations: CostValidation[] = [];
    const monthlyAmount = this.convertToMonthly(cost.amount, cost.frequency);
    
    // Obtener rango de mercado ajustado por ubicación
    const baseRange = this.MARKET_RANGES[cost.category as keyof typeof this.MARKET_RANGES];
    if (!baseRange) return validations;

    const locationFactor = this.LOCATION_FACTORS[businessData.location as keyof typeof this.LOCATION_FACTORS] || this.LOCATION_FACTORS.default;
    const adjustedRange = {
      min: baseRange.min * locationFactor,
      max: baseRange.max * locationFactor,
      unit: baseRange.unit,
    };

    // Validar rango
    if (monthlyAmount < adjustedRange.min) {
      validations.push({
        type: 'warning',
        message: `El costo de ${cost.name} ($${monthlyAmount.toFixed(2)}/mes) está por debajo del rango típico del mercado para ${businessData.location} ($${adjustedRange.min.toFixed(2)}-$${adjustedRange.max.toFixed(2)} ${adjustedRange.unit})`,
        severity: 'medium',
        category: cost.category,
        suggestedAmount: adjustedRange.min,
        marketRange: adjustedRange,
      });
    } else if (monthlyAmount > adjustedRange.max * 1.5) {
      validations.push({
        type: 'error',
        message: `El costo de ${cost.name} ($${monthlyAmount.toFixed(2)}/mes) está significativamente por encima del rango típico del mercado para ${businessData.location} ($${adjustedRange.min.toFixed(2)}-$${adjustedRange.max.toFixed(2)} ${adjustedRange.unit})`,
        severity: 'high',
        category: cost.category,
        suggestedAmount: adjustedRange.max,
        marketRange: adjustedRange,
      });
    } else {
      validations.push({
        type: 'success',
        message: `El costo de ${cost.name} está dentro del rango esperado del mercado`,
        severity: 'none',
        category: cost.category,
      });
    }

    // Validaciones específicas por categoría
    if (cost.category === 'personal' && businessData.employeeCount > 0) {
      const costPerEmployee = monthlyAmount / businessData.employeeCount;
      if (costPerEmployee < 425) {
        validations.push({
          type: 'warning',
          message: `El costo por empleado ($${costPerEmployee.toFixed(2)}/mes) está por debajo del salario básico unificado vigente`,
          severity: 'high',
          category: cost.category,
        });
      }
    }

    return validations;
  }

  private static getEssentialCosts(businessType: string): string[] {
    const normalizedType = businessType.toLowerCase();
    
    for (const [key, costs] of Object.entries(this.ESSENTIAL_COSTS)) {
      if (normalizedType.includes(key)) {
        return costs;
      }
    }
    
    // Costos básicos para cualquier negocio
    return ['arriendo', 'servicios', 'licencias'];
  }

  private static generateMissingCost(category: string, businessData: BusinessData): MissingCost {
    const missingCostsData = {
      arriendo: {
        name: 'Arriendo del Local',
        description: 'Pago mensual del local comercial',
        estimatedAmount: this.estimateRentAmount(businessData),
        importance: 'high' as const,
        reason: 'Esencial para operar el negocio físicamente',
      },
      servicios: {
        name: 'Servicios Básicos',
        description: 'Luz, agua, internet, gas',
        estimatedAmount: 300,
        importance: 'high' as const,
        reason: 'Necesario para el funcionamiento básico',
      },
      personal: {
        name: 'Sueldos y Salarios',
        description: 'Remuneraciones del personal',
        estimatedAmount: 425 * businessData.employeeCount,
        importance: 'high' as const,
        reason: 'Personal necesario para operar el negocio',
      },
      licencias: {
        name: 'Licencias y Permisos',
        description: 'Permisos municipales y licencias de funcionamiento',
        estimatedAmount: 200,
        importance: 'medium' as const,
        reason: 'Requerido legalmente para operar',
      },
      seguros: {
        name: 'Seguros Empresariales',
        description: 'Seguro de responsabilidad civil y local',
        estimatedAmount: 150,
        importance: 'medium' as const,
        reason: 'Protección contra riesgos y responsabilidades',
      },
    };

    const costData = missingCostsData[category as keyof typeof missingCostsData] || {
      name: 'Costo Adicional',
      description: 'Costo adicional recomendado',
      estimatedAmount: 100,
      importance: 'low' as const,
      reason: 'Para mejorar la operación del negocio',
    };

    return {
      category,
      ...costData,
    };
  }

  private static estimateRentAmount(businessData: BusinessData): number {
    const baseRent = 1200;
    const locationFactor = this.LOCATION_FACTORS[businessData.location as keyof typeof this.LOCATION_FACTORS] || this.LOCATION_FACTORS.default;
    const sizeFactor = businessData.size === 'Microempresa' ? 0.8 : businessData.size === 'Pequeña empresa' ? 1.0 : 1.3;
    
    return baseRent * locationFactor * sizeFactor;
  }

  private static generateRecommendations(
    costs: FixedCost[], 
    businessData: BusinessData, 
    validations: CostValidation[], 
    missingCosts: MissingCost[]
  ): string[] {
    const recommendations: string[] = [];

    // Recomendaciones basadas en costos faltantes
    if (missingCosts.some(c => c.importance === 'high')) {
      recommendations.push('Considera agregar los costos faltantes de alta importancia para completar tu planificación financiera.');
    }

    // Recomendaciones basadas en validaciones
    const highSeverityValidations = validations.filter(v => v.severity === 'high');
    if (highSeverityValidations.length > 0) {
      recommendations.push('Revisa los costos marcados con alta severidad, podrían estar sobrevalorados para tu ubicación.');
    }

    // Recomendaciones específicas por tipo de negocio
    if (businessData.businessType.toLowerCase().includes('restaurante')) {
      recommendations.push('Para restaurantes, asegúrate de incluir costos de licencias sanitarias y seguros de responsabilidad civil.');
    }

    if (businessData.employeeCount > 5) {
      recommendations.push('Con más de 5 empleados, considera implementar un sistema de gestión de recursos humanos.');
    }

    // Recomendaciones de ubicación
    if (businessData.location.includes('Centro') || businessData.location.includes('Mariscal')) {
      recommendations.push('Las zonas céntricas tienen costos más altos, asegúrate de que tu modelo de negocio pueda cubrirlos.');
    }

    return recommendations;
  }

  private static calculateOverallScore(validations: CostValidation[], missingCosts: MissingCost[], costCount: number): number {
    let score = 100;

    // Penalizar por validaciones de error
    const errors = validations.filter(v => v.type === 'error');
    score -= errors.length * 15;

    // Penalizar por validaciones de warning
    const warnings = validations.filter(v => v.type === 'warning');
    score -= warnings.length * 8;

    // Penalizar por costos faltantes de alta importancia
    const highImportanceMissing = missingCosts.filter(c => c.importance === 'high');
    score -= highImportanceMissing.length * 20;

    // Penalizar por costos faltantes de media importancia
    const mediumImportanceMissing = missingCosts.filter(c => c.importance === 'medium');
    score -= mediumImportanceMissing.length * 10;

    // Bonus por tener muchos costos bien definidos
    if (costCount >= 5) score += 10;

    return Math.max(0, Math.min(100, score));
  }

  private static generateSummary(
    costs: FixedCost[], 
    validations: CostValidation[], 
    missingCosts: MissingCost[]
  ) {
    const totalMonthly = costs.reduce((sum, cost) => sum + this.convertToMonthly(cost.amount, cost.frequency), 0);
    const totalYearly = totalMonthly * 12;
    
    const errorCount = validations.filter(v => v.type === 'error').length;
    const warningCount = validations.filter(v => v.type === 'warning').length;
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (errorCount > 2 || missingCosts.some(c => c.importance === 'high')) {
      riskLevel = 'high';
    } else if (errorCount > 0 || warningCount > 3) {
      riskLevel = 'medium';
    }

    const completeness = Math.max(0, 100 - (missingCosts.length * 15));

    return {
      totalCosts: costs.reduce((sum, cost) => sum + cost.amount, 0),
      totalMonthly,
      totalYearly,
      costCount: costs.length,
      completeness,
      riskLevel,
    };
  }

  private static generateOverallAssessment(score: number, missingCount: number, validations: CostValidation[]): string {
    if (score >= 90) {
      return 'Excelente planificación de costos fijos. Tu negocio tiene una base financiera sólida.';
    } else if (score >= 70) {
      return 'Buena planificación con algunas áreas de mejora. Considera revisar las recomendaciones.';
    } else if (score >= 50) {
      return 'Planificación básica que necesita mejoras. Revisa los costos faltantes y las validaciones.';
    } else {
      return 'Planificación incompleta que requiere atención inmediata. Revisa todas las recomendaciones.';
    }
  }

  private static convertToMonthly(amount: number, frequency: string): number {
    switch (frequency) {
      case 'mensual': return amount;
      case 'semestral': return amount / 6;
      case 'anual': return amount / 12;
      default: return amount;
    }
  }
}
