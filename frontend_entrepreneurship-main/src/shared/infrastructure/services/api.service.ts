import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export interface ApiResponse<T = any> {
  message: string;
  data: T;
  total?: number;
}

export interface ApiError {
  message: string;
  status: number;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(error instanceof Error ? error.message : 'Error de conexión');
    }
  }

  // Métodos para usuarios
  async login(email: string, password: string): Promise<ApiResponse> {
    return this.request('/usuarios/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any): Promise<ApiResponse> {
    return this.request('/usuarios/registro', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Métodos para negocios
  async createBusiness(businessData: any): Promise<ApiResponse> {
    return this.request('/negocios', {
      method: 'POST',
      body: JSON.stringify(businessData),
    });
  }

  async getBusinesses(): Promise<ApiResponse> {
    return this.request('/negocios');
  }

  async getBusiness(id: number): Promise<ApiResponse> {
    return this.request(`/negocios/${id}`);
  }

  async updateBusiness(id: number, businessData: any): Promise<ApiResponse> {
    return this.request(`/negocios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(businessData),
    });
  }

  // Métodos para costos fijos
  async createFixedCost(costData: any): Promise<ApiResponse> {
    return this.request('/costos-fijos', {
      method: 'POST',
      body: JSON.stringify(costData),
    });
  }

  async getFixedCosts(negocioId: number): Promise<ApiResponse> {
    return this.request(`/costos-fijos/${negocioId}`);
  }

  async getCostTypes(): Promise<ApiResponse> {
    return this.request('/costos-fijos/tipos/lista');
  }

  async updateFixedCost(id: number, costData: any): Promise<ApiResponse> {
    return this.request(`/costos-fijos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(costData),
    });
  }

  async deleteFixedCost(id: number): Promise<ApiResponse> {
    return this.request(`/costos-fijos/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos para productos
  async createProduct(productData: any): Promise<ApiResponse> {
    return this.request('/productos', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async getProducts(negocioId: number): Promise<ApiResponse> {
    return this.request(`/productos?negocioId=${negocioId}`);
  }

  async updateProduct(id: number, productData: any): Promise<ApiResponse> {
    return this.request(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: number): Promise<ApiResponse> {
    return this.request(`/productos/${id}`, {
      method: 'DELETE',
    });
  }

  async getProductCategories(): Promise<ApiResponse> {
    return this.request('/productos/categorias/lista');
  }

  async getUnitMeasures(): Promise<ApiResponse> {
    return this.request('/productos/unidades-medida/lista');
  }

  // Métodos para recetas
  async createRecipe(recipeData: any): Promise<ApiResponse> {
    return this.request('/recetas', {
      method: 'POST',
      body: JSON.stringify(recipeData),
    });
  }

  async getRecipes(productId: number): Promise<ApiResponse> {
    return this.request(`/recetas?productoId=${productId}`);
  }

  async updateRecipe(id: number, recipeData: any): Promise<ApiResponse> {
    return this.request(`/recetas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recipeData),
    });
  }

  async deleteRecipe(id: number): Promise<ApiResponse> {
    return this.request(`/recetas/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos para análisis
  async analyzeProfitability(analysisData: any): Promise<ApiResponse> {
    return this.request('/analisis/rentabilidad', {
      method: 'POST',
      body: JSON.stringify(analysisData),
    });
  }

  async analyzePricing(pricingData: any): Promise<ApiResponse> {
    return this.request('/analisis/precio-venta', {
      method: 'POST',
      body: JSON.stringify(pricingData),
    });
  }

  async calculateBreakEven(analysisData: any): Promise<ApiResponse> {
    return this.request('/analisis/punto-equilibrio', {
      method: 'POST',
      body: JSON.stringify(analysisData),
    });
  }

  async getAnalysisResults(negocioId: number, tipo?: string): Promise<ApiResponse> {
    const endpoint = tipo 
      ? `/analisis/resultados/${negocioId}?tipo=${tipo}`
      : `/analisis/resultados/${negocioId}`;
    return this.request(endpoint);
  }

  async validateCostsWithAI(negocioId: number): Promise<ApiResponse> {
    return this.request(`/analisis/validacion-costos/${negocioId}`);
  }

  async getAIRecommendations(negocioId: number): Promise<ApiResponse> {
    return this.request(`/analisis/recomendaciones/${negocioId}`);
  }

  async simulateScenarios(analysisData: any): Promise<ApiResponse> {
    return this.request('/analisis/simulacion-escenarios', {
      method: 'POST',
      body: JSON.stringify(analysisData),
    });
  }

  // Métodos para sectores y tamaños
  async getSectors(): Promise<ApiResponse> {
    return this.request('/sectores');
  }

  async getBusinessSizes(): Promise<ApiResponse> {
    return this.request('/tamanos-negocio');
  }

  // Método público para peticiones GET
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  // Método público para peticiones PUT
  async put<T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Método genérico para manejar errores
  handleError(error: any, customMessage?: string): void {
    const message = customMessage || error.message || 'Error desconocido';
    toast.error(message);
    console.error('API Error:', error);
  }

  // Método para mostrar mensajes de éxito
  showSuccess(message: string): void {
    toast.success(message);
  }

  // Método para mostrar mensajes de información
  showInfo(message: string): void {
    toast(message, {
      icon: 'ℹ️',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  }

  // Método para mostrar mensajes de advertencia
  showWarning(message: string): void {
    toast(message, {
      icon: '⚠️',
      style: {
        borderRadius: '10px',
        background: '#f59e0b',
        color: '#fff',
      },
    });
  }
}

export const apiService = new ApiService();
export default apiService;
