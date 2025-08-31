import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../../shared/infrastructure/components/MainLayout';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Building2, 
  Users, 
  DollarSign, 
  ArrowRight,
  Save,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BusinessAnalysisModal } from './components/BusinessAnalysisModal';
import { BusinessAnalysisService } from '../../../../shared/services/BusinessAnalysisService';
import { saveBusinessName } from '../../../../shared/utils/businessNameStorage';
import '../../../../shared/utils/consoleLogger'; // Importar para exponer funciones globalmente

// Esquema de validación
const businessSetupSchema = z.object({
  businessName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  businessCategory: z.string().min(1, 'Selecciona una categoría'),
  sector: z.string().min(1, 'Selecciona un sector'),
  exactLocation: z.string().optional(),
  businessSize: z.string().min(1, 'Selecciona un tamaño'),
  capacity: z.number().min(1, 'El aforo debe ser mayor a 0'),
  financingType: z.enum(['personal', 'prestamo', 'mixto'], { required_error: 'Selecciona el tipo de financiamiento' }),
  investmentItems: z.array(z.object({
    description: z.string().min(1, 'La descripción es requerida'),
    amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  })).min(1, 'Debes agregar al menos un item de inversión'),
  ownCapital: z.number().min(0, 'El capital propio no puede ser negativo'),
  loanCapital: z.number().min(0, 'El capital prestado no puede ser negativo'),
  interestRate: z.number().min(0, 'La tasa de interés no puede ser negativa'),
});

type BusinessSetupForm = z.infer<typeof businessSetupSchema>;

const businessCategories = [
  { value: 'restaurante', label: 'Restaurante', icon: '🍽️' },
  { value: 'cafeteria', label: 'Cafetería', icon: '☕' },
  { value: 'bar', label: 'Bar', icon: '🍺' },
  { value: 'pizzeria', label: 'Pizzería', icon: '🍕' },
  { value: 'heladeria', label: 'Heladería', icon: '🍦' },
  { value: 'panaderia', label: 'Panadería', icon: '🥖' },
  { value: 'fast-food', label: 'Comida Rápida', icon: '🍔' },
  { value: 'catering', label: 'Catering', icon: '🎉' },
];

const sectors = [
  'Centro Histórico',
  'La Mariscal',
  'La Floresta',
  'Guápulo',
  'Bellavista',
  'Cumbayá',
  'Tumbaco',
  'Valle de los Chillos',
  'San Rafael',
  'Calderón',
  'Carapungo',
  'Pomasqui',
  'San Antonio',
  'Conocoto',
  'Sangolquí',
];

const businessSizes = [
  { value: 'micro', label: 'Microempresa (1-10 empleados)', description: 'Ideal para negocios familiares' },
  { value: 'pequena', label: 'Pequeña empresa (11-50 empleados)', description: 'Negocios en crecimiento' },
  { value: 'mediana', label: 'Mediana empresa (51-200 empleados)', description: 'Negocios establecidos' },
  { value: 'grande', label: 'Gran empresa (200+ empleados)', description: 'Cadenas y franquicias' },
];

// Interfaz para el análisis de IA
interface AIAnalysis {
  isViable: boolean;
  score: number;
  recommendations: string[];
  warnings: string[];
  businessInsights: string[];
  financialHealth: 'good' | 'fair' | 'poor';
  riskLevel: 'low' | 'medium' | 'high';
}

export function BusinessSetupPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [hasLocalData, setHasLocalData] = useState(false);
  
  // Función helper para formatear números de manera segura
  const formatCurrency = (value: any): string => {
    const numValue = Number(value || 0);
    return isNaN(numValue) ? '0.00' : numValue.toFixed(2);
  };
  
  // Función para generar análisis de IA (SIN BACKEND)
  const generateAnalysisWithLocalStorage = async (data: BusinessSetupForm) => {
    setIsSubmitting(true);
    
    try {
      console.log('🤖 Iniciando análisis de IA con localStorage...');
      
      // Simular análisis de IA con delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generar el análisis de IA
      await generateAIAnalysis(data);
      
      // Mostrar el modal después de completar el análisis
      setShowAnalysisModal(true);
      
      toast.success('Análisis de IA completado exitosamente');
      
    } catch (error) {
      console.error('❌ Error en análisis de IA:', error);
      toast.error('Error al generar el análisis de IA');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para generar análisis de IA
  const generateAIAnalysis = async (data: BusinessSetupForm) => {
    setIsAnalyzing(true);
    
    try {
      console.log('🤖 Iniciando análisis de IA...');
      
      // Simular análisis de IA con delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // ===== ANÁLISIS SIMPLIFICADO Y FUNCIONAL =====
      let score = 50; // Puntuación base
      const analysis: AIAnalysis = {
        isViable: false,
        score: 0,
        recommendations: [] as string[],
        warnings: [] as string[],
        businessInsights: [] as string[],
        financialHealth: 'poor',
        riskLevel: 'high'
      };

      // ===== 1. ANÁLISIS DEL NOMBRE DEL NEGOCIO (10 puntos) =====
      if (data.businessName.length >= 5 && data.businessName.length <= 25) {
        score += 10;
        analysis.businessInsights.push('✅ Nombre del negocio tiene una longitud apropiada.');
      } else {
        analysis.warnings.push('⚠️ Considera un nombre más descriptivo y memorable.');
      }

      // ===== 2. ANÁLISIS DE UBICACIÓN (20 puntos) =====
      const primeLocations = ['Centro Histórico', 'La Mariscal', 'Cumbayá', 'La Floresta'];
      const goodLocations = ['Guápulo', 'Bellavista', 'Tumbaco', 'Valle de los Chillos'];
      
      if (primeLocations.includes(data.sector)) {
        score += 20;
        analysis.businessInsights.push(`✅ Excelente ubicación en ${data.sector}. Zona de alto tráfico.`);
      } else if (goodLocations.includes(data.sector)) {
        score += 15;
        analysis.businessInsights.push(`✅ Buena ubicación en ${data.sector}. Zona con potencial.`);
      } else {
        score += 10;
        analysis.businessInsights.push(`✅ Ubicación en ${data.sector}. Considera estrategias de marketing local.`);
      }

      // ===== 3. ANÁLISIS DE CATEGORÍA DE NEGOCIO (15 puntos) =====
      const highDemandCategories = ['cafeteria', 'panaderia', 'fast-food'];
      const mediumDemandCategories = ['restaurante', 'pizzeria', 'heladeria'];
      
      if (highDemandCategories.includes(data.businessCategory)) {
        score += 15;
        analysis.businessInsights.push(`✅ ${data.businessCategory} tiene alta demanda y frecuencia de consumo.`);
      } else if (mediumDemandCategories.includes(data.businessCategory)) {
        score += 12;
        analysis.businessInsights.push(`✅ ${data.businessCategory} tiene demanda estable en el mercado.`);
      } else {
        score += 10;
        analysis.businessInsights.push(`✅ ${data.businessCategory} puede requerir estrategias específicas de marketing.`);
      }

      // ===== 4. ANÁLISIS DE CAPACIDAD (15 puntos) =====
      if (data.capacity >= 10 && data.capacity <= 200) {
        score += 15;
        analysis.businessInsights.push(`✅ Capacidad de ${data.capacity} personas es adecuada para el negocio.`);
      } else {
        score += 10;
        analysis.warnings.push(`⚠️ Considera ajustar la capacidad de ${data.capacity} personas.`);
      }

      // ===== 5. ANÁLISIS FINANCIERO (20 puntos) =====
      const totalInvestment = data.investmentItems.reduce((sum, item) => sum + item.amount, 0);
      
      // Análisis de financiamiento
      if (data.financingType === 'personal') {
        score += 20;
        analysis.businessInsights.push('✅ Financiamiento personal elimina riesgos de deuda.');
      } else if (data.financingType === 'mixto') {
        score += 15;
        analysis.businessInsights.push('✅ Financiamiento mixto distribuye riesgos eficientemente.');
      } else {
        score += 10;
        analysis.warnings.push('⚠️ Financiamiento externo aumenta el riesgo financiero.');
      }

      // Análisis de inversión
      if (totalInvestment >= 5000 && totalInvestment <= 100000) {
        score += 10;
        analysis.businessInsights.push(`✅ Inversión de $${totalInvestment.toLocaleString()} es realista.`);
      } else {
        score += 5;
        analysis.warnings.push(`⚠️ Considera ajustar la inversión de $${totalInvestment.toLocaleString()}.`);
      }

      // ===== 6. ANÁLISIS DETALLADO DE ITEMS DE INVERSIÓN (20 puntos) =====
      const investmentAnalysis = analyzeInvestmentItems(data.investmentItems, data.businessCategory, data.businessSize, totalInvestment);
      
      // Agregar insights del análisis de inversión
      analysis.businessInsights.push(...investmentAnalysis.insights);
      analysis.warnings.push(...investmentAnalysis.warnings);
      analysis.recommendations.push(...investmentAnalysis.recommendations);
      
      // Puntuación basada en la completitud de la inversión
      score += investmentAnalysis.score;

      // ===== ASIGNAR PUNTUACIÓN FINAL =====
      analysis.score = Math.min(Math.max(score, 0), 100);

      // ===== DETERMINAR SALUD FINANCIERA =====
      if (analysis.score >= 80) {
        analysis.financialHealth = 'good';
      } else if (analysis.score >= 60) {
        analysis.financialHealth = 'fair';
      } else {
        analysis.financialHealth = 'poor';
      }

      // ===== DETERMINAR NIVEL DE RIESGO =====
      if (analysis.score >= 80) {
        analysis.riskLevel = 'low';
      } else if (analysis.score >= 60) {
        analysis.riskLevel = 'medium';
      } else {
        analysis.riskLevel = 'high';
      }

      // ===== DETERMINAR VIABILIDAD (UMBRAL: 70 PUNTOS) =====
      if (analysis.score >= 70) {
        analysis.isViable = true;
        analysis.businessInsights.push(`🎉 ¡Excelente! Tu negocio alcanzó ${analysis.score} puntos y es viable.`);
      } else {
        analysis.isViable = false;
        analysis.warnings.push(`⚠️ Tu negocio obtuvo ${analysis.score} puntos. Necesitas ${70 - analysis.score} puntos más para ser viable.`);
      }

      // ===== GENERAR RECOMENDACIONES ESPECÍFICAS =====
      if (!analysis.isViable) {
        analysis.recommendations.push('💡 Revisa los aspectos señalados en las advertencias para mejorar la viabilidad.');
        
        if (data.financingType === 'prestamo') {
          analysis.recommendations.push('💡 Cambia a financiamiento mixto o personal para reducir riesgo financiero.');
        }
        
        if (totalInvestment < 5000) {
          analysis.recommendations.push('💡 Incrementa la inversión en equipamiento esencial.');
        }
      }

      // Recomendaciones generales
      analysis.recommendations.push('💡 Desarrolla una estrategia de marketing sólida.');
      analysis.recommendations.push('💡 Implementa un sistema de control de costos.');
      analysis.recommendations.push('💡 Considera opciones de delivery para aumentar ingresos.');
      
      setAiAnalysis(analysis);
      
      // Mostrar el modal
      setShowAnalysisModal(true);
      
      console.log('🤖 Análisis de IA completado:', {
        score: analysis.score,
        isViable: analysis.isViable,
        riskLevel: analysis.riskLevel
      });
      
      // Guardar datos en localStorage directamente
      try {
        const businessData = {
          businessName: data.businessName,
          businessCategory: data.businessCategory,
          sector: data.sector,
          exactLocation: data.exactLocation,
          businessSize: data.businessSize,
          capacity: data.capacity,
          financingType: data.financingType,
          ownCapital: data.ownCapital,
          loanCapital: data.loanCapital,
          interestRate: data.interestRate,
          investmentItems: data.investmentItems,
          totalInvestment: data.investmentItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
          aiAnalysis: analysis,
          analysisDate: new Date().toISOString()
        };
        
        localStorage.setItem('businessSetupData', JSON.stringify(businessData));
        setHasLocalData(true);
        console.log('✅ Datos guardados en localStorage exitosamente');
        
      } catch (error) {
        console.error('❌ Error al guardar en localStorage:', error);
      }
      
    } catch (error) {
      console.error('Error en análisis de IA:', error);
      toast.error('Error al generar el análisis de IA');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<BusinessSetupForm>({
    resolver: zodResolver(businessSetupSchema),
    defaultValues: {
      businessName: '',
      businessCategory: '',
      sector: '',
      exactLocation: '',
      businessSize: '',
      capacity: 50,
      financingType: 'personal',
      investmentItems: [{ description: '', amount: 0 }],
      ownCapital: 0,
      loanCapital: 0,
      interestRate: 8.5,
    },
  });

  const watchedValues = watch();
  const totalInvestment = watchedValues.investmentItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  
  // Calcular el total del préstamo incluyendo intereses
  const loanWithInterest = Number(watchedValues.loanCapital || 0) * (1 + (Number(watchedValues.interestRate || 0) / 100));
  
  // El total de financiamiento es capital propio + préstamo con intereses
  const totalFinancing = Number(watchedValues.ownCapital || 0) + loanWithInterest;
  
  // Para validación: solo capital propio + capital prestado (sin intereses)
  const totalCapitalForValidation = Number(watchedValues.ownCapital || 0) + Number(watchedValues.loanCapital || 0);

  // Función para analizar detalladamente los items de inversión
  const analyzeInvestmentItems = (items: any[], businessCategory: string, businessSize: string, totalInvestment: number) => {
    const result = {
      score: 0,
      insights: [] as string[],
      warnings: [] as string[],
      recommendations: [] as string[]
    };

    console.log('🔍 Analizando items de inversión:', items);

    // Definir items esenciales por tipo de negocio
    const essentialItems = {
      'restaurante': [
        { name: 'Equipamiento de cocina', minAmount: 5000, priority: 'high' },
        { name: 'Mobiliario y decoración', minAmount: 3000, priority: 'high' },
        { name: 'Licencias y permisos', minAmount: 1000, priority: 'high' },
        { name: 'Garantía de arriendo', minAmount: 2000, priority: 'high' },
        { name: 'Capital de trabajo', minAmount: 3000, priority: 'medium' },
        { name: 'Sistema POS', minAmount: 500, priority: 'medium' },
        { name: 'Marketing inicial', minAmount: 1000, priority: 'medium' },
        { name: 'Seguros', minAmount: 500, priority: 'low' }
      ],
      'cafeteria': [
        { name: 'Equipamiento de café', minAmount: 3000, priority: 'high' },
        { name: 'Mobiliario', minAmount: 2000, priority: 'high' },
        { name: 'Licencias', minAmount: 800, priority: 'high' },
        { name: 'Garantía de arriendo', minAmount: 1500, priority: 'high' },
        { name: 'Capital de trabajo', minAmount: 2000, priority: 'medium' },
        { name: 'Sistema POS', minAmount: 400, priority: 'medium' },
        { name: 'Marketing inicial', minAmount: 800, priority: 'medium' }
      ],
      'fast-food': [
        { name: 'Equipamiento de cocina rápida', minAmount: 4000, priority: 'high' },
        { name: 'Mobiliario', minAmount: 1500, priority: 'high' },
        { name: 'Licencias', minAmount: 1200, priority: 'high' },
        { name: 'Garantía de arriendo', minAmount: 1800, priority: 'high' },
        { name: 'Capital de trabajo', minAmount: 2500, priority: 'medium' },
        { name: 'Sistema de pedidos', minAmount: 600, priority: 'medium' },
        { name: 'Marketing inicial', minAmount: 1000, priority: 'medium' }
      ],
      'panaderia': [
        { name: 'Equipamiento de panadería', minAmount: 6000, priority: 'high' },
        { name: 'Mobiliario', minAmount: 2000, priority: 'high' },
        { name: 'Licencias', minAmount: 1000, priority: 'high' },
        { name: 'Garantía de arriendo', minAmount: 2000, priority: 'high' },
        { name: 'Capital de trabajo', minAmount: 3000, priority: 'medium' },
        { name: 'Sistema POS', minAmount: 500, priority: 'medium' },
        { name: 'Marketing inicial', minAmount: 800, priority: 'medium' }
      ],
      'pizzeria': [
        { name: 'Horno de pizza', minAmount: 3000, priority: 'high' },
        { name: 'Equipamiento de cocina', minAmount: 2000, priority: 'high' },
        { name: 'Mobiliario', minAmount: 1500, priority: 'high' },
        { name: 'Licencias', minAmount: 1000, priority: 'high' },
        { name: 'Garantía de arriendo', minAmount: 1800, priority: 'high' },
        { name: 'Capital de trabajo', minAmount: 2500, priority: 'medium' },
        { name: 'Sistema de delivery', minAmount: 800, priority: 'medium' },
        { name: 'Marketing inicial', minAmount: 1000, priority: 'medium' }
      ],
      'heladeria': [
        { name: 'Máquinas de helado', minAmount: 4000, priority: 'high' },
        { name: 'Equipamiento de cocina', minAmount: 1500, priority: 'high' },
        { name: 'Mobiliario', minAmount: 1000, priority: 'high' },
        { name: 'Licencias', minAmount: 800, priority: 'high' },
        { name: 'Garantía de arriendo', minAmount: 1500, priority: 'high' },
        { name: 'Capital de trabajo', minAmount: 2000, priority: 'medium' },
        { name: 'Sistema POS', minAmount: 400, priority: 'medium' },
        { name: 'Marketing inicial', minAmount: 800, priority: 'medium' }
      ]
    };

    // Obtener items esenciales para el tipo de negocio
    const requiredItems = essentialItems[businessCategory as keyof typeof essentialItems] || essentialItems.restaurante;
    
    // Analizar items existentes
    const existingItems = items.map(item => item.description?.toLowerCase() || '');
    const existingAmounts = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    
    // Verificar items faltantes
    const missingItems = requiredItems.filter(required => {
      const itemName = required.name.toLowerCase();
      return !existingItems.some(existing => 
        existing.includes(itemName.split(' ')[0]) || 
        existing.includes(itemName.split(' ')[1]) ||
        itemName.includes(existing.split(' ')[0])
      );
    });

    // Calcular puntuación base
    let baseScore = 10;
    
    // Bonificación por items completos
    const coveragePercentage = ((requiredItems.length - missingItems.length) / requiredItems.length) * 100;
    if (coveragePercentage >= 80) {
      baseScore += 10;
      result.insights.push(`✅ Excelente cobertura de items esenciales (${coveragePercentage.toFixed(0)}%)`);
    } else if (coveragePercentage >= 60) {
      baseScore += 5;
      result.insights.push(`✅ Buena cobertura de items esenciales (${coveragePercentage.toFixed(0)}%)`);
    } else {
      result.warnings.push(`⚠️ Cobertura baja de items esenciales (${coveragePercentage.toFixed(0)}%)`);
    }

    // Analizar items faltantes por prioridad
    const missingHighPriority = missingItems.filter(item => item.priority === 'high');
    const missingMediumPriority = missingItems.filter(item => item.priority === 'medium');
    const missingLowPriority = missingItems.filter(item => item.priority === 'low');

    if (missingHighPriority.length > 0) {
      result.warnings.push(`⚠️ Faltan ${missingHighPriority.length} items de alta prioridad`);
      missingHighPriority.forEach(item => {
        result.recommendations.push(`🔴 ${item.name}: $${item.minAmount.toLocaleString()} - Esencial para operar`);
      });
    }

    if (missingMediumPriority.length > 0) {
      result.warnings.push(`⚠️ Faltan ${missingMediumPriority.length} items de prioridad media`);
      missingMediumPriority.forEach(item => {
        result.recommendations.push(`🟡 ${item.name}: $${item.minAmount.toLocaleString()} - Importante para el éxito`);
      });
    }

    if (missingLowPriority.length > 0) {
      missingLowPriority.forEach(item => {
        result.recommendations.push(`🟢 ${item.name}: $${item.minAmount.toLocaleString()} - Recomendado para optimizar`);
      });
    }

    // Analizar distribución de la inversión
    const avgItemAmount = existingAmounts / items.length;
    const totalRequired = requiredItems.reduce((sum, item) => sum + item.minAmount, 0);
    
    if (existingAmounts >= totalRequired * 0.8) {
      baseScore += 5;
      result.insights.push(`✅ Inversión total adecuada para los items requeridos`);
    } else {
      result.warnings.push(`⚠️ Inversión total puede ser insuficiente para items requeridos`);
      result.recommendations.push(`💰 Considera aumentar la inversión total a $${totalRequired.toLocaleString()}`);
    }

    // Analizar diversificación
    if (items.length >= 5) {
      baseScore += 3;
      result.insights.push(`✅ Buena diversificación con ${items.length} categorías de inversión`);
    } else if (items.length >= 3) {
      baseScore += 1;
      result.insights.push(`✅ Diversificación moderada con ${items.length} categorías`);
    } else {
      result.warnings.push(`⚠️ Poca diversificación (solo ${items.length} categorías)`);
    }

    // Verificar items específicos importantes
    const hasRentGuarantee = existingItems.some(item => 
      item.includes('garantía') || item.includes('arriendo') || item.includes('renta')
    );
    const hasLicenses = existingItems.some(item => 
      item.includes('licencia') || item.includes('permiso') || item.includes('autorización')
    );
    const hasWorkingCapital = existingItems.some(item => 
      item.includes('capital') || item.includes('trabajo') || item.includes('operativo')
    );

    // Ajustar recomendaciones según el tamaño del negocio
    const sizeMultiplier = businessSize === 'micro' ? 0.5 : 
                          businessSize === 'pequena' ? 1 : 
                          businessSize === 'mediana' ? 1.5 : 2;

    if (!hasRentGuarantee) {
      result.warnings.push(`⚠️ No se incluye garantía de arriendo`);
      const rentAmount = Math.round(2000 * sizeMultiplier);
      result.recommendations.push(`🏠 Garantía de arriendo: $${rentAmount.toLocaleString()} - Necesaria para alquilar local`);
    }

    if (!hasLicenses) {
      result.warnings.push(`⚠️ No se incluyen licencias y permisos`);
      const licenseAmount = Math.round(1000 * sizeMultiplier);
      result.recommendations.push(`📋 Licencias y permisos: $${licenseAmount.toLocaleString()} - Obligatorios para operar`);
    }

    if (!hasWorkingCapital) {
      result.warnings.push(`⚠️ No se incluye capital de trabajo`);
      const workingCapitalAmount = Math.round(3000 * sizeMultiplier);
      result.recommendations.push(`💼 Capital de trabajo: $${workingCapitalAmount.toLocaleString()} - Necesario para operar los primeros meses`);
    }

    // Recomendaciones específicas por tamaño
    if (businessSize === 'micro' && totalInvestment > 15000) {
      result.warnings.push(`⚠️ Inversión muy alta para un negocio micro`);
      result.recommendations.push(`💰 Considera reducir la inversión o cambiar a tamaño pequeño`);
    } else if (businessSize === 'grande' && totalInvestment < 50000) {
      result.warnings.push(`⚠️ Inversión muy baja para un negocio grande`);
      result.recommendations.push(`💰 Considera aumentar la inversión o cambiar a tamaño mediano`);
    }

    result.score = Math.min(baseScore, 20); // Máximo 20 puntos
    
    // Generar resumen ejecutivo
    const summary = generateInvestmentSummary(items, missingItems, totalInvestment, businessCategory, businessSize);
    result.insights.push(summary);
    
    return result;
  };

  // Función para generar resumen ejecutivo del análisis de inversión
  const generateInvestmentSummary = (items: any[], missingItems: any[], totalInvestment: number, businessCategory: string, businessSize: string) => {
    const totalRequired = missingItems.reduce((sum, item) => sum + item.minAmount, 0);
    const coveragePercentage = ((items.length - missingItems.length) / items.length) * 100;
    
    let summary = `📊 Resumen: ${items.length} items configurados, ${missingItems.length} faltantes. `;
    
    if (coveragePercentage >= 80) {
      summary += `Excelente cobertura (${coveragePercentage.toFixed(0)}%). `;
    } else if (coveragePercentage >= 60) {
      summary += `Buena cobertura (${coveragePercentage.toFixed(0)}%). `;
    } else {
      summary += `Cobertura baja (${coveragePercentage.toFixed(0)}%). `;
    }
    
    if (missingItems.length > 0) {
      summary += `Faltan $${totalRequired.toLocaleString()} en items esenciales.`;
    } else {
      summary += `Todos los items esenciales están cubiertos.`;
    }
    
    return summary;
  };

  // Función para validar si el formulario está completo y correcto (SIMPLIFICADA)
  const isFormCompleteAndValid = () => {
    // Solo validar campos mínimos para permitir el análisis
    const hasBasicInfo = watchedValues.businessName && 
                        watchedValues.businessName.length >= 2 &&
                        watchedValues.businessCategory &&
                        watchedValues.sector &&
                        watchedValues.businessSize &&
                        watchedValues.capacity > 0;

    const hasInvestment = watchedValues.investmentItems && 
                         watchedValues.investmentItems.length > 0 &&
                         watchedValues.investmentItems.some(item => 
                           item.description && item.description.trim().length > 0 && 
                           item.amount && item.amount > 0
                         );

    const isValid = hasBasicInfo && hasInvestment;
    
    console.log('🔍 Validación simplificada:', {
      hasBasicInfo,
      hasInvestment,
      isValid,
      businessName: watchedValues.businessName,
      businessCategory: watchedValues.businessCategory,
      sector: watchedValues.sector,
      businessSize: watchedValues.businessSize,
      capacity: watchedValues.capacity,
      investmentItems: watchedValues.investmentItems?.length || 0
    });

    return isValid;
  };

  // Sincronizar automáticamente los valores de financiamiento cuando cambie la inversión total
  useEffect(() => {
    if (totalInvestment > 0) {
      if (watchedValues.financingType === 'personal') {
        setValue('ownCapital', totalInvestment);
        setValue('loanCapital', 0);
      } else if (watchedValues.financingType === 'prestamo') {
        setValue('ownCapital', 0);
        // El capital prestado debe ser igual a la inversión requerida (sin intereses)
        setValue('loanCapital', totalInvestment);
      } else if (watchedValues.financingType === 'mixto') {
        // Mantener la proporción actual si ya hay valores, o distribuir equitativamente
        const currentTotal = (watchedValues.ownCapital || 0) + (watchedValues.loanCapital || 0);
        if (currentTotal === 0) {
          const mitad = totalInvestment / 2;
          setValue('ownCapital', mitad);
          setValue('loanCapital', mitad);
        }
      }
    }
  }, [totalInvestment, watchedValues.financingType, setValue]);

  // Función para agregar un nuevo item de inversión
  const addInvestmentItem = () => {
    const newItems = [...watchedValues.investmentItems, { description: '', amount: 0 }];
    setValue('investmentItems', newItems);
  };

  // Función para eliminar un item de inversión
  const removeInvestmentItem = (index: number) => {
    if (watchedValues.investmentItems.length > 1) {
      const newItems = watchedValues.investmentItems.filter((_, i) => i !== index);
      setValue('investmentItems', newItems);
    }
  };

  // Función para actualizar un item de inversión
  const updateInvestmentItem = (index: number, field: 'description' | 'amount', value: string | number) => {
    const newItems = [...watchedValues.investmentItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setValue('investmentItems', newItems);
    
    // Si es préstamo bancario, actualizar automáticamente el capital prestado
    if (field === 'amount' && watchedValues.financingType === 'prestamo') {
      const newTotal = newItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      setValue('loanCapital', newTotal);
    }
  };

  // Función para manejar el cambio de tipo de financiamiento
  const handleFinancingTypeChange = (type: 'personal' | 'prestamo' | 'mixto') => {
    setValue('financingType', type);
    
    // Resetear valores según el tipo
    if (type === 'personal') {
      setValue('loanCapital', 0);
      setValue('interestRate', 0);
      // Si es personal, el capital propio debe igualar la inversión total
      if (totalInvestment > 0) {
        setValue('ownCapital', totalInvestment);
      }
    } else if (type === 'prestamo') {
      setValue('ownCapital', 0);
      // Si es préstamo, el capital prestado debe igualar la inversión total (sin intereses)
      if (totalInvestment > 0) {
        setValue('loanCapital', totalInvestment);
      }
    } else if (type === 'mixto') {
      // Si es mixto, distribuir equitativamente o dejar que el usuario ajuste
      if (totalInvestment > 0) {
        const mitad = totalInvestment / 2;
        setValue('ownCapital', mitad);
        setValue('loanCapital', mitad);
      }
    }
  };

  const onSubmit = async (data: BusinessSetupForm) => {
    // Si no hay análisis de IA, generar análisis con localStorage
    if (!aiAnalysis) {
      await generateAnalysisWithLocalStorage(data);
      return;
    }
    
    // Si el análisis no es viable, no permitir continuar
    if (!aiAnalysis.isViable) {
      toast.error('El análisis de IA indica que el negocio no es viable. Revisa las recomendaciones.');
      return;
    }
    
    // Si ya hay análisis y es viable, proceder directamente
    await handleContinueAfterAnalysis();
  };

  const handleContinueAfterAnalysis = async () => {
    if (!aiAnalysis?.isViable) {
      toast.error('No se puede continuar con un negocio no viable. Ajusta tu propuesta primero.');
      return;
    }

    try {
      console.log('🚀 Continuando a la siguiente página...');
      
      toast.success('¡Continuando a costos fijos...');
      
      // Cerrar modal y navegar al siguiente paso
      setShowAnalysisModal(false);
      navigate('/fixed-costs');
      
    } catch (error) {
      console.error('❌ Error al navegar:', error);
      toast.error('Error al continuar a la siguiente página');
    }
  };

  const handleCloseModal = () => {
    setShowAnalysisModal(false);
    // Resetear análisis para permitir nuevo análisis si es necesario
    setAiAnalysis(null);
  };

  // Función para limpiar datos de localStorage
  const clearLocalStorageData = () => {
    try {
      localStorage.removeItem('businessSetupData');
      setHasLocalData(false);
      setAiAnalysis(null);
      console.log('🗑️ Datos de localStorage limpiados');
      toast.success('Datos limpiados exitosamente');
    } catch (error) {
      console.error('❌ Error al limpiar localStorage:', error);
    }
  };

  // Verificar si hay datos guardados en localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('businessSetupData');
    setHasLocalData(!!savedData);
  }, []);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Configuración del Negocio
          </h1>
          <p className="text-lg text-gray-600">
            Define los datos básicos de tu negocio de alimentos y bebidas
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Información básica */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-primary-600" />
              Información Básica
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Nombre del negocio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Negocio *
                </label>
                <Controller
                  name="businessName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.businessName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ej: La Buena Mesa"
                    />
                  )}
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
                )}
              </div>

              {/* Categoría del negocio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría del Negocio *
                </label>
                <Controller
                  name="businessCategory"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.businessCategory ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecciona una categoría</option>
                      {businessCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.businessCategory && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessCategory.message}</p>
                )}
              </div>

              {/* Sector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sector en Quito *
                </label>
                <Controller
                  name="sector"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.sector ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecciona un sector</option>
                      {sectors.map((sector) => (
                        <option key={sector} value={sector}>
                          {sector}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.sector && (
                  <p className="mt-1 text-sm text-red-600">{errors.sector.message}</p>
                )}
              </div>

              {/* Ubicación exacta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación Exacta (Opcional)
                </label>
                <Controller
                  name="exactLocation"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ej: Av. Amazonas y Naciones Unidas"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Características del negocio */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary-600" />
              Características del Negocio
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Tamaño del negocio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño del Negocio *
                </label>
                <Controller
                  name="businessSize"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.businessSize ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecciona el tamaño</option>
                      {businessSizes.map((size) => (
                        <option key={size.value} value={size.value}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.businessSize && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessSize.message}</p>
                )}
              </div>

              {/* Capacidad/Aforo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacidad/Aforo (personas) *
                </label>
                <Controller
                  name="capacity"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      min="1"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.capacity ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="50"
                    />
                  )}
                />
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información financiera */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
              Información Financiera
            </h2>
            
            <div className="space-y-6">
              {/* Tipo de financiamiento */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-4">
                  Tipo de Financiamiento *
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="financingType"
                      value="personal"
                      checked={watchedValues.financingType === 'personal'}
                      onChange={() => handleFinancingTypeChange('personal')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Capital Personal/Propio</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="financingType"
                      value="prestamo"
                      checked={watchedValues.financingType === 'prestamo'}
                      onChange={() => handleFinancingTypeChange('prestamo')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Préstamo Bancario</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="financingType"
                      value="mixto"
                      checked={watchedValues.financingType === 'mixto'}
                      onChange={() => handleFinancingTypeChange('mixto')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Mixto (Personal + Préstamo)</span>
                  </label>
                </div>
                {errors.financingType && (
                  <p className="mt-1 text-sm text-red-600">{errors.financingType.message}</p>
                )}
              </div>

              {/* Items de inversión */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-base font-semibold text-gray-700">
                    Items de Inversión *
                  </label>
                  <button
                    type="button"
                    onClick={addInvestmentItem}
                    className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    + Agregar Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {watchedValues.investmentItems.map((item, index) => (
                    <div key={index} className="flex space-x-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Sillas, mesas, equipos..."
                          value={item.description}
                          onChange={(e) => updateInvestmentItem(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Precio
                        </label>
                        <input
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          value={item.amount}
                          onChange={(e) => updateInvestmentItem(index, 'amount', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      {watchedValues.investmentItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInvestmentItem(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {errors.investmentItems && (
                  <p className="mt-1 text-sm text-red-600">{errors.investmentItems.message}</p>
                )}
              </div>

              {/* Resumen de la inversión total */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Resumen de la Inversión</h3>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    ${totalInvestment.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Inversión Total Requerida</p>
                </div>
              </div>

              {/* Desglose del financiamiento */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capital Propio (USD)
                  </label>
                  <Controller
                    name="ownCapital"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="0"
                        step="0.01"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                        disabled={watchedValues.financingType === 'prestamo'}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          watchedValues.financingType === 'prestamo' ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                        placeholder="0"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capital por Préstamo (USD)
                  </label>
                  <Controller
                    name="loanCapital"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="0"
                        step="0.01"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                        disabled={watchedValues.financingType === 'personal'}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          watchedValues.financingType === 'personal' ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                        placeholder="0"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Tasa de interés */}
              {watchedValues.financingType !== 'personal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tasa de Interés Anual (%) *
                  </label>
                  <Controller
                    name="interestRate"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="0"
                        step="0.1"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.interestRate ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="8.5"
                      />
                    )}
                  />
                  {errors.interestRate && (
                    <p className="mt-1 text-sm text-red-600">{errors.interestRate.message}</p>
                  )}
                </div>
              )}

              {/* Validación del financiamiento */}
              {totalInvestment > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Validación del Financiamiento</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Capital Propio:</span>
                      <p className="font-semibold text-green-600">${(watchedValues.ownCapital || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Préstamo:</span>
                      <p className="font-semibold text-blue-600">${(watchedValues.loanCapital || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total:</span>
                       <p className="font-semibold text-gray-900">${formatCurrency(totalFinancing)}</p>
                    </div>
                  </div>
                  
                                     {/* Mostrar información adicional para préstamos */}
                   {watchedValues.financingType === 'prestamo' && watchedValues.loanCapital > 0 && (
                     <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <span className="text-blue-700 font-medium">Capital Prestado:</span>
                           <p className="font-semibold text-blue-600">${(watchedValues.loanCapital || 0).toLocaleString()}</p>
                         </div>
                         <div>
                           <span className="text-blue-700 font-medium">Intereses ({watchedValues.interestRate || 0}%):</span>
                           <p className="font-semibold text-blue-600">${((watchedValues.loanCapital || 0) * ((watchedValues.interestRate || 0) / 100)).toLocaleString()}</p>
                         </div>
                       </div>
                                                                                                 <div className="mt-2 pt-2 border-t border-blue-200">
                            <span className="text-blue-700 font-medium">Total a Pagar:</span>
                            <p className="font-semibold text-blue-800">${formatCurrency(loanWithInterest)}</p>
                          </div>
                     </div>
                   )}
                   
                   {/* Mostrar información adicional para financiamiento mixto */}
                   {watchedValues.financingType === 'mixto' && watchedValues.loanCapital > 0 && (
                     <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded text-sm">
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <span className="text-purple-700 font-medium">Capital Propio:</span>
                           <p className="font-semibold text-green-600">${(watchedValues.ownCapital || 0).toLocaleString()}</p>
                         </div>
                         <div>
                           <span className="text-purple-700 font-medium">Capital Prestado:</span>
                           <p className="font-semibold text-blue-600">${(watchedValues.loanCapital || 0).toLocaleString()}</p>
                         </div>
                       </div>
                       <div className="mt-2 grid grid-cols-2 gap-4">
                         <div>
                           <span className="text-purple-700 font-medium">Intereses ({watchedValues.interestRate || 0}%):</span>
                           <p className="font-semibold text-blue-600">${((watchedValues.loanCapital || 0) * ((watchedValues.interestRate || 0) / 100)).toLocaleString()}</p>
                         </div>
                         <div>
                           <span className="text-purple-700 font-medium">Total a Pagar:</span>
                           <p className="font-semibold text-purple-800">${formatCurrency(totalFinancing)}</p>
                         </div>
                       </div>
                       <div className="mt-2 pt-2 border-t border-purple-200 text-center">
                         <span className="text-purple-700 font-medium">Resumen:</span>
                         <p className="text-sm text-purple-600">
                           Capital inicial: ${formatCurrency(totalCapitalForValidation)} | 
                           Total con intereses: ${formatCurrency(totalFinancing)}
                         </p>
                       </div>
                     </div>
                   )}
                  
                  {/* Validación principal */}
                  {watchedValues.financingType === 'personal' && totalFinancing !== totalInvestment && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                      ⚠️ El capital propio debe igualar la inversión total requerida
                    </div>
                  )}
                  
                  {watchedValues.financingType === 'prestamo' && (watchedValues.loanCapital || 0) !== totalInvestment && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                      ⚠️ El capital prestado debe igualar la inversión total requerida (${totalInvestment.toLocaleString()})
                </div>
              )}
                  
                  {watchedValues.financingType === 'mixto' && totalCapitalForValidation !== totalInvestment && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                      ⚠️ La suma del capital propio (${(watchedValues.ownCapital || 0).toLocaleString()}) y capital prestado (${(watchedValues.loanCapital || 0).toLocaleString()}) = ${totalCapitalForValidation.toLocaleString()}, debe igualar la inversión total requerida (${totalInvestment.toLocaleString()})
                    </div>
                  )}
                  
                  {/* Mensaje de éxito */}
                  {((watchedValues.financingType === 'personal' && (watchedValues.ownCapital || 0) === totalInvestment) ||
                    (watchedValues.financingType === 'prestamo' && (watchedValues.loanCapital || 0) === totalInvestment) ||
                    (watchedValues.financingType === 'mixto' && totalCapitalForValidation === totalInvestment)) && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                      ✅ Financiamiento válido: La suma coincide con la inversión total requerida
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>


           
           {/* Indicador de estado del formulario */}
           {!isFormCompleteAndValid() && totalInvestment > 0 && (
             <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
               <h4 className="text-sm font-medium text-amber-800 mb-2">
                 📋 Completa la información para continuar:
               </h4>
               <div className="text-sm text-amber-700 space-y-1">
                 {(!watchedValues.businessName || watchedValues.businessName.length < 3) && (
                   <div className="flex items-center">
                     <span className="text-amber-600 mr-2">•</span>
                     Ingresa un nombre de negocio válido (mínimo 3 caracteres)
                   </div>
                 )}
                 {!watchedValues.businessCategory && (
                   <div className="flex items-center">
                     <span className="text-amber-600 mr-2">•</span>
                     Selecciona una categoría de negocio
                   </div>
                 )}
                 {!watchedValues.sector && (
                   <div className="flex items-center">
                     <span className="text-amber-600 mr-2">•</span>
                     Selecciona un sector en Quito
                   </div>
                 )}
                 {!watchedValues.businessSize && (
                   <div className="flex items-center">
                     <span className="text-amber-600 mr-2">•</span>
                     Selecciona el tamaño del negocio
                   </div>
                 )}
                 {(!watchedValues.capacity || watchedValues.capacity <= 0) && (
                   <div className="flex items-center">
                     <span className="text-amber-600 mr-2">•</span>
                     Ingresa una capacidad válida (mayor a 0)
                   </div>
                 )}
                 {(!watchedValues.investmentItems || watchedValues.investmentItems.length === 0 || 
                   !watchedValues.investmentItems.every(item => item.description && item.description.trim().length > 0 && item.amount && item.amount > 0)) && (
                   <div className="flex items-center">
                     <span className="text-amber-600 mr-2">•</span>
                     Completa todos los items de inversión (nombre y precio)
                   </div>
                 )}
                 {totalInvestment > 0 && (
                   <>
                     {watchedValues.financingType === 'personal' && (watchedValues.ownCapital !== totalInvestment || watchedValues.loanCapital !== 0) && (
                       <div className="flex items-center">
                         <span className="text-amber-600 mr-2">•</span>
                         Para financiamiento personal: Capital propio debe igualar inversión total (${totalInvestment.toLocaleString()})
                       </div>
                     )}
                     {watchedValues.financingType === 'prestamo' && (watchedValues.loanCapital !== totalInvestment || watchedValues.ownCapital !== 0 || watchedValues.interestRate <= 0) && (
                       <div className="flex items-center">
                         <span className="text-amber-600 mr-2">•</span>
                         Para préstamo bancario: Capital prestado debe igualar inversión total (${totalInvestment.toLocaleString()}) y tasa de interés {'>'} 0%
                       </div>
                     )}
                     {watchedValues.financingType === 'mixto' && (watchedValues.ownCapital <= 0 || watchedValues.loanCapital <= 0 || totalCapitalForValidation !== totalInvestment || watchedValues.interestRate <= 0) && (
                       <div className="flex items-center">
                         <span className="text-amber-600 mr-2">•</span>
                         Para financiamiento mixto: Ambos capitales {'>'} 0, suma = ${totalInvestment.toLocaleString()} y tasa de interés {'>'} 0%
                       </div>
                     )}
                   </>
                 )}
               </div>
             </div>
           )}

          {/* Botones de acción */}
          <div className="flex justify-between items-center pt-6">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Volver al Dashboard
              </button>
              
              <button
                type="button"
                onClick={clearLocalStorageData}
                className="px-4 py-3 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm"
              >
                Limpiar Datos
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Indicador de progreso */}
              {isFormCompleteAndValid() && (
                <div className="flex items-center text-green-600 text-sm">
                  <span className="mr-2">✅</span>
                  Listo para analizar con IA
                </div>
              )}
              
              {/* Indicador de datos guardados */}
              {hasLocalData && (
                <div className="flex items-center text-blue-600 text-sm">
                  <span className="mr-2">💾</span>
                  Datos guardados
                </div>
              )}
            
            <button
              type="submit"
               disabled={!isFormCompleteAndValid() || isSubmitting || isAnalyzing}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Guardando...</span>
                </>
               ) : isAnalyzing ? (
                 <>
                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                   <span>Analizando con IA...</span>
                 </>
               ) : !aiAnalysis ? (
                 <>
                   <div className="w-4 h-4 mr-2">🤖</div>
                   <span>Analizar con IA</span>
                   <ArrowRight className="w-4 h-4" />
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
          </div>
        </form>
      </div>

      {/* Modal de Análisis de IA */}
      <BusinessAnalysisModal
        isOpen={showAnalysisModal}
        onClose={handleCloseModal}
        businessData={watchedValues}
        aiAnalysis={aiAnalysis}
        isAnalyzing={isAnalyzing}
        onContinue={handleContinueAfterAnalysis}
      />
    </MainLayout>
  );
}
