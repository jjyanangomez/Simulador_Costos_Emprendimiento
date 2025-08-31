import { localStorageService } from '../../../../shared/infrastructure/services/localStorage.service';
import type { Product, AdditionalCost } from '../../domain/types';

export interface VariableCostsData {
  products: Product[];
  additionalCosts: AdditionalCost[];
  businessType: string;
  lastUpdated: string;
}

export class VariableCostsLocalStorageService {
  private static readonly STORAGE_KEY = 'variable_costs_data';

  static saveData(data: Omit<VariableCostsData, 'lastUpdated'>): void {
    const dataWithTimestamp: VariableCostsData = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    localStorageService.set(this.STORAGE_KEY, dataWithTimestamp);
  }

  static loadData(): VariableCostsData | null {
    return localStorageService.get<VariableCostsData>(this.STORAGE_KEY);
  }

  static saveProducts(products: Product[]): void {
    const currentData = this.loadData() || {
      products: [],
      additionalCosts: [],
      businessType: 'restaurante',
      lastUpdated: new Date().toISOString()
    };
    
    this.saveData({
      ...currentData,
      products
    });
  }

  static saveAdditionalCosts(additionalCosts: AdditionalCost[]): void {
    const currentData = this.loadData() || {
      products: [],
      additionalCosts: [],
      businessType: 'restaurante',
      lastUpdated: new Date().toISOString()
    };
    
    this.saveData({
      ...currentData,
      additionalCosts
    });
  }

  static saveBusinessType(businessType: string): void {
    const currentData = this.loadData() || {
      products: [],
      additionalCosts: [],
      businessType: 'restaurante',
      lastUpdated: new Date().toISOString()
    };
    
    this.saveData({
      ...currentData,
      businessType
    });
  }

  static getProducts(): Product[] {
    const data = this.loadData();
    return data?.products || [];
  }

  static getAdditionalCosts(): AdditionalCost[] {
    const data = this.loadData();
    return data?.additionalCosts || [];
  }

  static getBusinessType(): string {
    const data = this.loadData();
    return data?.businessType || 'restaurante';
  }

  static clearData(): void {
    localStorageService.remove(this.STORAGE_KEY);
  }

  static hasData(): boolean {
    const data = this.loadData();
    return data !== null && (data.products.length > 0 || data.additionalCosts.length > 0);
  }

  static getLastUpdated(): string | null {
    const data = this.loadData();
    return data?.lastUpdated || null;
  }
}
