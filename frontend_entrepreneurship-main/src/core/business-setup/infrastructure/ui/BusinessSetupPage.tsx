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
import { BusinessSetupApiService, type BusinessSetupData } from '../services/BusinessSetupApiService';
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
  
  // Función helper para formatear números de manera segura
  const formatCurrency = (value: any): string => {
    const numValue = Number(value || 0);
    return isNaN(numValue) ? '0.00' : numValue.toFixed(2);
  };
  
  // Función para generar análisis de IA usando el backend con Google Gemini
  const generateAIAnalysis = async (data: BusinessSetupForm) => {
    setIsAnalyzing(true);
    
    try {
      console.log('🤖 Iniciando análisis de IA con Google Gemini (Backend)...');

      // Convertir datos del formulario al formato esperado por la API
      const apiData: BusinessSetupData = {
        businessName: data.businessName,
        businessCategory: data.businessCategory,
        sector: data.sector,
        exactLocation: data.exactLocation,
        businessSize: data.businessSize,
        capacity: data.capacity,
        financingType: data.financingType,
        investmentItems: data.investmentItems.map(item => ({
          description: item.description,
          amount: item.amount,
          quantity: 1 // Valor por defecto
        })),
        ownCapital: data.ownCapital,
        loanCapital: data.loanCapital,
        interestRate: data.interestRate
      };

      console.log('📤 Enviando datos al backend con Google Gemini:', apiData);

      try {
        // 🚀 LLAMADA REAL AL BACKEND CON GOOGLE GEMINI
        const backendResult = await BusinessSetupApiService.analyzeWithBackendAI(apiData);
        
        console.log('✅ 🤖 RESPUESTA DE GOOGLE GEMINI RECIBIDA:', backendResult);

        // Convertir respuesta del backend al formato local
        const analysis: AIAnalysis = {
          isViable: backendResult.isViable,
          score: backendResult.score,
          riskLevel: backendResult.riskLevel,
          financialHealth: backendResult.financialHealth,
          recommendations: backendResult.recommendations,
          warnings: backendResult.warnings,
          businessInsights: backendResult.businessInsights
        };

        // Imprimir análisis completo en consola
        console.log('\n🤖 ================== ANÁLISIS DE GOOGLE GEMINI (BACKEND) ==================');
        console.log('📊 DATOS DEL NEGOCIO:', apiData);
        console.log('🎯 RESULTADO DEL ANÁLISIS DE GOOGLE GEMINI:', analysis);
        console.log('🧠 ANÁLISIS GENERADO POR: Google Gemini 1.5 Flash');
        console.log('================== FIN DEL ANÁLISIS DE GOOGLE GEMINI ==================\n');

        setAiAnalysis(analysis);
        setShowAnalysisModal(true);
        
        // Guardar datos usando el servicio centralizado
        const success = BusinessAnalysisService.saveBusinessAnalysis(data, analysis);
        if (success) {
          console.log('✅ Datos de Google Gemini guardados exitosamente');
          
          // Guardar también el nombre del negocio por separado para acceso rápido
          const nameSuccess = saveBusinessName(data.businessName);
          if (nameSuccess) {
            console.log('✅ Nombre del negocio guardado para acceso rápido');
          }
        }

        toast.success('🤖 Análisis completado con Google Gemini');
        return; // Salir aquí si el backend funciona

      } catch (backendError) {
        console.error('❌ Error al conectar con Google Gemini (Backend):', backendError);
        toast.error('⚠️ Backend no disponible, usando análisis local...');
        
        // 🔄 FALLBACK: Análisis local cuando el backend falla
        console.log('🔄 Usando análisis local como fallback...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Continuar con análisis local
      
      // ===== ANÁLISIS INTELIGENTE REAL BASADO EN DATOS =====
      let score = 40; // Puntuación base más estricta
      const analysis: AIAnalysis = {
        isViable: false,
        score: 0,
        recommendations: [] as string[],
        warnings: [] as string[],
        businessInsights: [] as string[],
        financialHealth: 'poor',
        riskLevel: 'high'
      };

      // ===== 1. ANÁLISIS DEL NOMBRE DEL NEGOCIO (5 puntos) =====
      if (data.businessName.length >= 5 && data.businessName.length <= 20) {
        score += 5;
        analysis.businessInsights.push('Nombre del negocio tiene una longitud apropiada.');
      } else if (data.businessName.length < 5) {
        analysis.warnings.push('El nombre del negocio es muy corto. Considera un nombre más descriptivo y memorable.');
      } else {
        analysis.warnings.push('El nombre del negocio es muy largo. Considera uno más corto y fácil de recordar.');
      }

      // ===== 2. ANÁLISIS DE UBICACIÓN (15 puntos) =====
      const primeLocations = ['Centro Histórico', 'La Mariscal', 'Cumbayá', 'La Floresta'];
      const goodLocations = ['Guápulo', 'Bellavista', 'Tumbaco', 'Valle de los Chillos'];
      
      if (primeLocations.includes(data.sector)) {
        score += 15;
        analysis.businessInsights.push(`Excelente ubicación en ${data.sector}. Zona de alto tráfico y poder adquisitivo.`);
      } else if (goodLocations.includes(data.sector)) {
        score += 10;
        analysis.businessInsights.push(`Buena ubicación en ${data.sector}. Zona en crecimiento con potencial.`);
      } else {
        score += 5;
        analysis.warnings.push(`La ubicación en ${data.sector} puede tener menor tráfico. Considera estrategias de marketing local.`);
      }

      // ===== 3. ANÁLISIS DE CATEGORÍA DE NEGOCIO (10 puntos) =====
      const highDemandCategories = ['cafeteria', 'panaderia', 'fast-food'];
      const mediumDemandCategories = ['restaurante', 'pizzeria', 'heladeria'];
      
      if (highDemandCategories.includes(data.businessCategory)) {
        score += 10;
        analysis.businessInsights.push(`${data.businessCategory} tiene alta demanda y frecuencia de consumo.`);
      } else if (mediumDemandCategories.includes(data.businessCategory)) {
        score += 7;
        analysis.businessInsights.push(`${data.businessCategory} tiene demanda estable en el mercado.`);
      } else {
        score += 5;
        analysis.warnings.push(`${data.businessCategory} puede requerir estrategias específicas de marketing.`);
      }

      // ===== 4. ANÁLISIS DE CAPACIDAD VS TAMAÑO (10 puntos) =====
      const sizeCapacityMapping = {
        'micro': { min: 5, max: 25, optimal: 15 },
        'pequena': { min: 20, max: 80, optimal: 50 },
        'mediana': { min: 60, max: 150, optimal: 100 },
        'grande': { min: 120, max: 300, optimal: 200 }
      };
      
      const sizeConfig = sizeCapacityMapping[data.businessSize as keyof typeof sizeCapacityMapping];
      if (data.capacity >= sizeConfig.min && data.capacity <= sizeConfig.max) {
        if (Math.abs(data.capacity - sizeConfig.optimal) <= 10) {
          score += 10;
          analysis.businessInsights.push(`Capacidad óptima de ${data.capacity} personas para una ${data.businessSize}.`);
        } else {
          score += 7;
          analysis.businessInsights.push(`Capacidad de ${data.capacity} personas es adecuada para una ${data.businessSize}.`);
        }
      } else {
        analysis.warnings.push(`Capacidad de ${data.capacity} no es óptima para una ${data.businessSize}. Considera ajustar.`);
      }

      // ===== 5. ANÁLISIS FINANCIERO (25 puntos) =====
      const totalInvestment = data.investmentItems.reduce((sum, item) => sum + item.amount, 0);
      const investmentPerPerson = totalInvestment / data.capacity;
      
      // Análisis de inversión por persona
      if (investmentPerPerson >= 800 && investmentPerPerson <= 2000) {
        score += 10;
        analysis.businessInsights.push(`Inversión por persona de $${investmentPerPerson.toFixed(0)} es equilibrada y realista.`);
      } else if (investmentPerPerson < 500) {
        analysis.warnings.push(`Inversión por persona de $${investmentPerPerson.toFixed(0)} parece baja. Verifica que cubra equipamiento necesario.`);
      } else if (investmentPerPerson > 3000) {
        score += 5;
        analysis.warnings.push(`Inversión por persona de $${investmentPerPerson.toFixed(0)} es muy alta. Considera optimizar costos.`);
      } else {
        score += 7;
      }

      // Análisis de financiamiento
      if (data.financingType === 'mixto') {
        score += 8;
        analysis.businessInsights.push('Financiamiento mixto distribuye riesgos eficientemente.');
        
        const ownPercentage = (data.ownCapital / totalInvestment) * 100;
        if (ownPercentage >= 30 && ownPercentage <= 70) {
          score += 5;
          analysis.businessInsights.push(`Proporción de capital propio (${ownPercentage.toFixed(0)}%) es equilibrada.`);
        } else if (ownPercentage < 30) {
          analysis.warnings.push('Considera aumentar tu capital propio para reducir dependencia de préstamos.');
        }
      } else if (data.financingType === 'personal') {
        score += 12;
        analysis.businessInsights.push('Financiamiento personal elimina riesgos de deuda y intereses.');
      } else {
        score += 3;
        analysis.warnings.push('Financiamiento completamente externo aumenta el riesgo financiero.');
      }

      // Análisis de tasa de interés
      if (data.financingType !== 'personal' && data.interestRate > 0) {
        if (data.interestRate <= 10) {
          score += 2;
          analysis.businessInsights.push(`Tasa de interés del ${data.interestRate}% es competitiva.`);
        } else if (data.interestRate <= 15) {
          analysis.warnings.push(`Tasa de interés del ${data.interestRate}% es moderada. Considera negociar mejores términos.`);
        } else {
          analysis.warnings.push(`Tasa de interés del ${data.interestRate}% es alta. Busca alternativas de financiamiento.`);
          score -= 5;
        }
      }

      // ===== 6. ANÁLISIS DE DIVERSIFICACIÓN DE INVERSIÓN (10 puntos) =====
      const investmentCategories = data.investmentItems.length;
      
      if (investmentCategories >= 5) {
        score += 10;
        analysis.businessInsights.push(`Excelente diversificación con ${investmentCategories} categorías de inversión.`);
      } else if (investmentCategories >= 3) {
        score += 7;
        analysis.businessInsights.push(`Buena diversificación con ${investmentCategories} categorías de inversión.`);
      } else {
        analysis.warnings.push(`Solo ${investmentCategories} categorías de inversión. Considera diversificar más.`);
      }

      // ===== 7. ANÁLISIS DE COHERENCIA DE NEGOCIO (10 puntos) =====
      let coherenceScore = 0;
      
      // Coherencia categoría-ubicación
      if ((data.businessCategory === 'restaurante' || data.businessCategory === 'cafeteria') && 
          primeLocations.includes(data.sector)) {
        coherenceScore += 5;
      }
      
      // Coherencia capacidad-categoría
      if ((data.businessCategory === 'fast-food' && data.capacity <= 40) ||
          (data.businessCategory === 'restaurante' && data.capacity >= 30) ||
          (data.businessCategory === 'cafeteria' && data.capacity <= 50)) {
        coherenceScore += 5;
      }
      
      score += coherenceScore;
      if (coherenceScore >= 8) {
        analysis.businessInsights.push('Excelente coherencia entre categoría, ubicación y capacidad del negocio.');
      }

      // ===== 8. BONIFICACIONES (5 puntos) =====
      // Bonificación por nombre creativo
      if (data.businessName.toLowerCase().includes(data.businessCategory) || 
          data.businessName.toLowerCase().includes('café') ||
          data.businessName.toLowerCase().includes('resto')) {
        score += 3;
        analysis.businessInsights.push('Nombre del negocio refleja claramente la actividad.');
      }

      // Bonificación por tamaño realista
      if ((data.businessSize === 'micro' && totalInvestment <= 30000) ||
          (data.businessSize === 'pequena' && totalInvestment <= 100000)) {
        score += 2;
        analysis.businessInsights.push('Inversión realista para el tamaño de empresa seleccionado.');
      }

      // ===== ASIGNAR PUNTUACIÓN FINAL =====
      analysis.score = Math.min(Math.max(score, 0), 100);

      // ===== DETERMINAR SALUD FINANCIERA =====
      const debtToInvestmentRatio = data.financingType === 'personal' ? 0 : 
                                   (data.loanCapital || 0) / totalInvestment;
      
      if (debtToInvestmentRatio <= 0.4 && analysis.score >= 80) {
        analysis.financialHealth = 'good';
      } else if (debtToInvestmentRatio <= 0.7 && analysis.score >= 60) {
        analysis.financialHealth = 'fair';
      } else {
        analysis.financialHealth = 'poor';
      }

      // ===== DETERMINAR NIVEL DE RIESGO =====
      if (analysis.score >= 85 && analysis.financialHealth === 'good') {
        analysis.riskLevel = 'low';
      } else if (analysis.score >= 70 && analysis.financialHealth !== 'poor') {
        analysis.riskLevel = 'medium';
      } else {
        analysis.riskLevel = 'high';
      }

      // ===== DETERMINAR VIABILIDAD (UMBRAL: 75 PUNTOS + RIESGO BAJO) =====
      // Solo negocios con puntuación ≥75 Y riesgo BAJO son viables
      if (analysis.score >= 75 && analysis.riskLevel === 'low') {
        analysis.isViable = true;
        analysis.businessInsights.push(`¡Excelente! Tu negocio alcanzó ${analysis.score} puntos con riesgo bajo, cumpliendo todos los criterios de viabilidad.`);
      } else {
        analysis.isViable = false;
        
        // Mensajes específicos según la razón de no viabilidad
        if (analysis.score < 75) {
          analysis.warnings.push(`Tu negocio obtuvo ${analysis.score} puntos. Necesitas ${75 - analysis.score} puntos más para ser viable.`);
        }
        
        if (analysis.riskLevel === 'medium') {
          analysis.warnings.push('Nivel de riesgo MEDIO: Se requiere reducir el riesgo a BAJO para que el negocio sea viable.');
        } else if (analysis.riskLevel === 'high') {
          analysis.warnings.push('Nivel de riesgo ALTO: Es fundamental reducir significativamente el riesgo para la viabilidad.');
        }
        
        // Mensajes adicionales por rango de puntuación
        if (analysis.score >= 70 && analysis.riskLevel !== 'low') {
          analysis.warnings.push('Tu puntuación es buena, pero el nivel de riesgo debe reducirse a BAJO.');
        } else if (analysis.score >= 60) {
          analysis.warnings.push('Tu negocio tiene potencial, pero necesita mejoras en puntuación y reducción de riesgo.');
        } else {
          analysis.warnings.push('Se requieren cambios importantes en tu propuesta de negocio.');
        }
      }

      // ===== GENERAR RECOMENDACIONES ESPECÍFICAS =====
      if (!analysis.isViable) {
        analysis.recommendations.push('Revisa los aspectos señalados en las advertencias para mejorar la viabilidad.');
        
        // Recomendaciones específicas para reducir riesgo
        if (analysis.riskLevel === 'medium') {
          analysis.recommendations.push('Para reducir el riesgo a BAJO: mejora la salud financiera aumentando capital propio.');
          analysis.recommendations.push('Optimiza la inversión por persona y considera ubicaciones de mayor potencial.');
        } else if (analysis.riskLevel === 'high') {
          analysis.recommendations.push('Para reducir el riesgo ALTO: restructura completamente el financiamiento.');
          analysis.recommendations.push('Aumenta significativamente tu capital propio y reduce la dependencia de préstamos.');
        }
        
        // Recomendaciones específicas por problemas detectados
        if (data.financingType === 'prestamo') {
          analysis.recommendations.push('Cambia a financiamiento mixto o personal para reducir riesgo financiero.');
        }
        
        if (investmentPerPerson < 500) {
          analysis.recommendations.push('Incrementa la inversión en equipamiento esencial para asegurar la calidad del servicio.');
        }
        
        if (!primeLocations.includes(data.sector)) {
          analysis.recommendations.push('Considera reubicarte en una zona de mayor tráfico o desarrolla una estrategia de marketing sólida.');
        }
        
        if (analysis.financialHealth === 'poor') {
          analysis.recommendations.push('Mejora la salud financiera reduciendo la proporción de deuda respecto a la inversión total.');
        }
      }

      // Recomendaciones por categoría
      const categoryRecommendations: Record<string, string[]> = {
        'restaurante': [
          'Implementa un sistema de reservas online para optimizar la gestión de mesas.',
          'Considera opciones de delivery y takeaway para aumentar ingresos.'
        ],
        'cafeteria': [
          'Crea un ambiente acogedor que invite a quedarse y trabajar.',
          'Implementa un programa de fidelización para clientes regulares.'
        ],
        'fast-food': [
          'Optimiza los tiempos de servicio para maximizar la rotación de clientes.',
          'Implementa tecnología para pedidos rápidos (apps, kioscos).'
        ]
      };

      if (categoryRecommendations[data.businessCategory]) {
        analysis.recommendations.push(...categoryRecommendations[data.businessCategory]);
      }
      
      setAiAnalysis(analysis);
      setShowAnalysisModal(true);
      
      // ===== IMPRIMIR TODOS LOS DATOS GENERADOS POR LA IA EN CONSOLA =====
      console.log('\n🤖 ================== ANÁLISIS DE IA GENERADO ==================');
      console.log('📊 DATOS DEL NEGOCIO:');
      console.log({
        'Nombre del Negocio': data.businessName,
        'Categoría': data.businessCategory,
        'Sector/Ubicación': data.sector,
        'Ubicación Exacta': data.exactLocation || 'No especificada',
        'Tamaño del Negocio': data.businessSize,
        'Capacidad': `${data.capacity} personas`,
        'Tipo de Financiamiento': data.financingType,
        'Capital Propio': `$${data.ownCapital.toLocaleString()}`,
        'Capital Préstamo': `$${(data.loanCapital || 0).toLocaleString()}`,
        'Tasa de Interés': `${data.interestRate || 0}%`,
        'Inversión Total': `$${data.investmentItems.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}`
      });
      
      console.log('\n💰 ITEMS DE INVERSIÓN:');
      data.investmentItems.forEach((item, index) => {
        console.log(`${index + 1}. ${item.description}: $${item.amount.toLocaleString()}`);
      });
      
      console.log('\n🎯 RESULTADO DEL ANÁLISIS DE IA:');
      console.log({
        '✅ Es Viable': analysis.isViable ? 'SÍ' : 'NO',
        '📊 Puntuación': `${analysis.score}/100 puntos`,
        '⚠️ Nivel de Riesgo': analysis.riskLevel.toUpperCase(),
        '💚 Salud Financiera': analysis.financialHealth.toUpperCase()
      });
      
      console.log('\n🔍 DETALLES DEL ANÁLISIS:');
      console.log('📈 ASPECTOS POSITIVOS:');
      if (analysis.businessInsights.length > 0) {
        analysis.businessInsights.forEach((insight, index) => {
          console.log(`   ${index + 1}. ✅ ${insight}`);
        });
      } else {
        console.log('   (Ninguno identificado)');
      }
      
      console.log('\n⚠️ ADVERTENCIAS:');
      if (analysis.warnings.length > 0) {
        analysis.warnings.forEach((warning, index) => {
          console.log(`   ${index + 1}. ⚠️ ${warning}`);
        });
      } else {
        console.log('   (Ninguna identificada)');
      }
      
      console.log('\n💡 RECOMENDACIONES:');
      if (analysis.recommendations.length > 0) {
        analysis.recommendations.forEach((rec, index) => {
          console.log(`   ${index + 1}. 💡 ${rec}`);
        });
      } else {
        console.log('   (Ninguna generada)');
      }
      
      console.log('\n🏆 CRITERIOS DE VIABILIDAD:');
      console.log({
        'Puntuación Mínima': '75 puntos',
        'Riesgo Máximo': 'BAJO (MEDIO y ALTO = NO VIABLE)',
        'Puntuación Actual': `${analysis.score} puntos`,
        'Riesgo Actual': analysis.riskLevel.toUpperCase(),
        'Cumple Criterios': analysis.isViable ? 'SÍ ✅' : 'NO ❌'
      });
      
      console.log('\n📋 RESUMEN EJECUTIVO:');
      const totalInvestmentAmount = data.investmentItems.reduce((sum, item) => sum + item.amount, 0);
      const debtRatio = ((data.loanCapital || 0) / totalInvestmentAmount * 100).toFixed(1);
      const investmentPerPersonAmount = (totalInvestmentAmount / data.capacity).toFixed(0);
      
      console.log({
        'Negocio': `${data.businessName} (${data.businessCategory})`,
        'Ubicación': data.sector,
        'Inversión Total': `$${totalInvestmentAmount.toLocaleString()}`,
        'Ratio de Deuda': `${debtRatio}%`,
        'Inversión por Persona': `$${investmentPerPersonAmount}`,
        'Estado Final': analysis.isViable ? '🟢 NEGOCIO VIABLE' : '🔴 NEGOCIO NO VIABLE',
        'Fecha de Análisis': new Date().toLocaleString('es-ES')
      });
      
      console.log('================== FIN DEL ANÁLISIS DE IA (FALLBACK) ==================\n');
      
      setAiAnalysis(analysis);
      setShowAnalysisModal(true);
      
      // Guardar datos usando el servicio centralizado
      const success = BusinessAnalysisService.saveBusinessAnalysis(data, analysis);
      if (success) {
        console.log('✅ Datos guardados exitosamente en el servicio centralizado');
        
        // Guardar también el nombre del negocio por separado para acceso rápido
        const nameSuccess = saveBusinessName(data.businessName);
        if (nameSuccess) {
          console.log('✅ Nombre del negocio guardado para acceso rápido');
        }
      }
      
      } // Cierre del catch del backend
      
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

  // Función para validar si el formulario está completo y correcto
  const isFormCompleteAndValid = () => {
    // Validar campos básicos
    if (!watchedValues.businessName || watchedValues.businessName.length < 3) return false;
    if (!watchedValues.businessCategory) return false;
    if (!watchedValues.sector) return false;
    if (!watchedValues.businessSize) return false;
    if (!watchedValues.capacity || watchedValues.capacity <= 0) return false;
    
    // Validar items de inversión
    if (!watchedValues.investmentItems || watchedValues.investmentItems.length === 0) return false;
    
    const hasValidInvestmentItems = watchedValues.investmentItems.every(item => 
      item.description && item.description.trim().length > 0 && 
      item.amount && item.amount > 0
    );
    if (!hasValidInvestmentItems) return false;
    
    // Validar que la inversión total sea mayor a 0
    if (totalInvestment <= 0) return false;
    
    // Validar financiamiento según el tipo
    if (watchedValues.financingType === 'personal') {
      return watchedValues.ownCapital === totalInvestment && watchedValues.loanCapital === 0;
    } else if (watchedValues.financingType === 'prestamo') {
      return watchedValues.loanCapital === totalInvestment && 
             watchedValues.ownCapital === 0 && 
             watchedValues.interestRate > 0;
    } else if (watchedValues.financingType === 'mixto') {
      return watchedValues.ownCapital > 0 && 
             watchedValues.loanCapital > 0 && 
             totalCapitalForValidation === totalInvestment && 
             watchedValues.interestRate > 0;
    }
    
    return false;
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
    // Si no hay análisis de IA, generarlo primero
    if (!aiAnalysis) {
      await generateAIAnalysis(data);
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

    setIsSubmitting(true);
    
    try {
      // Aquí se enviarían los datos al backend
      console.log('Datos del negocio:', watchedValues);
      console.log('Análisis de IA:', aiAnalysis);
      
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('¡Configuración del negocio guardada exitosamente! Continuando a costos fijos...');
      
      // Cerrar modal y navegar al siguiente paso
      setShowAnalysisModal(false);
      navigate('/fixed-costs');
    } catch (error) {
      toast.error('Error al guardar la configuración');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowAnalysisModal(false);
    // Resetear análisis para permitir nuevo análisis si es necesario
    setAiAnalysis(null);
  };

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
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Volver al Dashboard
            </button>
            
            <div className="flex items-center space-x-3">
              {/* Indicador de progreso */}
              {isFormCompleteAndValid() && (
                <div className="flex items-center text-green-600 text-sm">
                  <span className="mr-2">✅</span>
                  Listo para analizar con IA
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
