import { apiClient } from '../../../shared/infrastructure/http/api-client';

export interface BusinessBackendData {
  usuarioId: number;
  nombreNegocio: string;
  ubicacionExacta: string;
  idTamano: number;
  sectorId: number;
  aforoPersonas: number;
  inversionInicial: number;
  capitalPropio: number;
  capitalPrestamo: number;
  tasaInteres: number;
}

export interface InvestmentItemBackendData {
  negocio_id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  cantidad: number;
  categoria?: string;
  prioridad?: string;
  fecha_compra_estimada?: string | null;
}

export class BusinessBackendService {
  
  /**
   * 🏢 Crea un nuevo negocio en el backend
   */
  static async createBusiness(businessData: BusinessBackendData) {
    try {
      console.log('🚀 Enviando datos del negocio al backend...');
      
      const response = await apiClient.post('/negocios', businessData);
      
      console.log('🔍 Respuesta completa del backend:', response);
      console.log('🔍 Response.data:', response.data);
      console.log('🔍 Response.status:', response.status);
      console.log('🔍 Response.keys:', Object.keys(response));
      
      // Intentar acceder a los datos de diferentes maneras
      let createdBusiness;
      
      if (response.data) {
        createdBusiness = response.data;
      } else if (response.negocioId) {
        // Si los datos están directamente en response
        createdBusiness = response;
      } else {
        throw new Error('No se pudieron obtener los datos del negocio creado');
      }
      
      if (!createdBusiness) {
        throw new Error('El backend no devolvió datos del negocio creado');
      }
      
      // Verificar que tenga el ID del negocio
      if (!createdBusiness.negocioId) {
        throw new Error('El backend no devolvió el ID del negocio creado');
      }
      
      console.log('✅ Negocio creado exitosamente:', createdBusiness);
      return createdBusiness;
      
    } catch (error) {
      console.error('❌ Error al crear negocio:', error);
      throw new Error('No se pudo crear el negocio en el backend');
    }
  }

  /**
   * 💰 Crea items de inversión en el backend
   */
  static async createInvestmentItems(items: InvestmentItemBackendData[]) {
    try {
      console.log('🚀 Enviando items de inversión al backend...');
      
      const promises = items.map(item => 
        apiClient.post('/items-inversion', item)
      );
      
      const responses = await Promise.all(promises);
      
      console.log('✅ Items de inversión creados exitosamente:', responses.length);
      return responses.map(r => r.data);
      
    } catch (error) {
      console.error('❌ Error al crear items de inversión:', error);
      throw new Error('No se pudieron crear los items de inversión en el backend');
    }
  }

  /**
   * 🔄 Crea negocio completo con items de inversión
   */
  static async createCompleteBusiness(
    businessData: BusinessBackendData, 
    investmentItems: InvestmentItemBackendData[]
  ) {
    try {
      console.log('🚀 Creando negocio completo en el backend...');
      
      // 1. Crear el negocio
      const business = await this.createBusiness(businessData);
      
      console.log('🔍 Negocio creado:', business);
      console.log('🔍 Negocio ID:', business.negocioId);
      
      // 2. Actualizar los items con el ID del negocio creado
      const itemsWithBusinessId = investmentItems.map(item => ({
        ...item,
        negocio_id: business.negocioId
      }));
      
      console.log('🔍 Items con negocio_id:', itemsWithBusinessId);
      
      // 3. Crear los items de inversión
      const items = await this.createInvestmentItems(itemsWithBusinessId);
      
      console.log('✅ Negocio completo creado exitosamente');
      
      return {
        business,
        items
      };
      
    } catch (error) {
      console.error('❌ Error al crear negocio completo:', error);
      throw error;
    }
  }
}
