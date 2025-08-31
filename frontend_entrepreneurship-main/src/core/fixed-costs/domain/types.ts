export interface FixedCost {
  name: string;
  description?: string;
  amount: number;
  frequency: 'mensual' | 'semestral' | 'anual';
  category: string;
}

export interface BusinessData {
  businessName: string;
  businessType: string;
  location: string;
  size: string;
  employeeCount: number;
  description: string;
}

export interface CostValidation {
  type: 'error' | 'warning' | 'success' | 'info';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'none';
  category?: string;
  suggestedAmount?: number;
  marketRange?: {
    min: number;
    max: number;
    unit: string;
  };
}

export interface MissingCost {
  category: string;
  name: string;
  description: string;
  estimatedAmount: number;
  importance: 'high' | 'medium' | 'low';
  reason: string;
}

export interface AIAnalysisResult {
  summary: {
    totalCosts: number;
    totalMonthly: number;
    totalYearly: number;
    costCount: number;
    completeness: number; // 0-100
    riskLevel: 'low' | 'medium' | 'high';
  };
  validations: CostValidation[];
  missingCosts: MissingCost[];
  recommendations: string[];
  overallAssessment: string;
  score: number; // 0-100
}

export interface FixedCostsSummary {
  costs: FixedCost[];
  businessData: BusinessData;
  analysis: AIAnalysisResult;
}
