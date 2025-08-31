import { apiClient } from '../../../shared/infrastructure/http/api-client';
import { 
  ItemInversion, 
  CreateItemInversionDto, 
  UpdateItemInversionDto, 
  TotalInversionResponse 
} from '../models/ItemInversion';

export class ItemsInversionService {
  private static readonly BASE_URL = '/items-inversion';

  static async createItem(item: CreateItemInversionDto): Promise<ItemInversion> {
    const response = await apiClient.post<ItemInversion>(this.BASE_URL, item);
    return response.data;
  }

  static async getAllItems(negocioId?: number): Promise<ItemInversion[]> {
    const params = negocioId ? { negocio_id: negocioId } : {};
    const response = await apiClient.get<ItemInversion[]>(this.BASE_URL, { params });
    return response.data;
  }

  static async getItemById(id: number): Promise<ItemInversion> {
    const response = await apiClient.get<ItemInversion>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  static async updateItem(id: number, item: UpdateItemInversionDto): Promise<ItemInversion> {
    const response = await apiClient.put<ItemInversion>(`${this.BASE_URL}/${id}`, item);
    return response.data;
  }

  static async deleteItem(id: number): Promise<void> {
    await apiClient.delete(`${this.BASE_URL}/${id}`);
  }

  static async getTotalInversion(negocioId: number): Promise<TotalInversionResponse> {
    const response = await apiClient.get<TotalInversionResponse>(`${this.BASE_URL}/negocio/${negocioId}/total`);
    return response.data;
  }

  static async getItemsByNegocio(negocioId: number): Promise<ItemInversion[]> {
    return this.getAllItems(negocioId);
  }
}
