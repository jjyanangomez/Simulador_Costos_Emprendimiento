export interface Ingredient {
  name: string;
  unitOfMeasure: string;
  portion: number;
  portionsObtained?: number;
  unitPrice: number;
  preparationTime: number;
  staffRequired: number;
}

export interface Product {
  id: string;
  type: 'recipe' | 'resale';
  name: string;
  ingredients?: Ingredient[];
  sellingPrice?: number; // Made optional
  preparationTime?: number;
  staffRequired?: number;
  resaleCost?: number; // Costo del producto de reventa
}

export interface AdditionalCost {
  id: string;
  category: string;
  name: string;
  value: number;
}

export interface AIAnalysis {
  totalProductCosts: number;
  totalAdditionalCosts: number;
  totalRevenue: number;
  totalProfit: number;
  averageMargin: number;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  profitabilityScore: number;
}
