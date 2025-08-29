import { apiClient } from "../../../../shared/infrastructure/http/api-client";

export interface FinancialRecord {
  id?: number;
  name: string;
  amount: string;
  businessId: number;
  moduleId: number;
  createdAt?: string;
}

export interface CreateFinancialRecordRequest {
  businessId: number;
  moduleId: number;
  name: string;
  amount: number;
}

export interface UpdateFinancialRecordRequest {
  id: number;
  businessId: number;
  moduleId: number;
  name: string;
  amount: string;
}

export class FinancialRecordRepositoryApi {
  private static readonly BASE_URL = '/financial-records';

  // Crear un nuevo registro financiero
  static async createRecord(data: CreateFinancialRecordRequest): Promise<FinancialRecord> {
    console.log('💾 [FRONTEND-FINANCIAL] Creando registro financiero:', data);
    console.log('💾 [FRONTEND-FINANCIAL] URL de la petición:', this.BASE_URL);
    console.log('💾 [FRONTEND-FINANCIAL] Datos enviados:', JSON.stringify(data, null, 2));

    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: FinancialRecord;
      }>(this.BASE_URL, data);

      console.log('✅ [FRONTEND-FINANCIAL] Registro creado exitosamente:', response);
      console.log('✅ [FRONTEND-FINANCIAL] Respuesta completa:', JSON.stringify(response, null, 2));
      return response.data;
    } catch (error: any) {
      console.error('❌ [FRONTEND-FINANCIAL] Error al crear registro:', error);
      console.error('❌ [FRONTEND-FINANCIAL] Detalles del error:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        response: error.response,
        data: error.response?.data
      });
      throw new Error(`Error al crear el registro financiero: ${error.message}`);
    }
  }

  // Actualizar un registro financiero existente
  static async updateRecord(data: UpdateFinancialRecordRequest): Promise<FinancialRecord> {
    console.log('💾 [FRONTEND-FINANCIAL] Actualizando registro financiero:', data);

    try {
      const response = await apiClient.put<{
        success: boolean;
        message: string;
        data: FinancialRecord;
      }>(`${this.BASE_URL}/${data.id}`, data);

      console.log('✅ [FRONTEND-FINANCIAL] Registro actualizado exitosamente:', response);
      return response.data;
    } catch (error) {
      console.error('❌ [FRONTEND-FINANCIAL] Error al actualizar registro:', error);
      throw new Error('Error al actualizar el registro financiero');
    }
  }

  // Eliminar un registro financiero
  static async deleteRecord(id: number): Promise<void> {
    console.log('🗑️ [FRONTEND-FINANCIAL] Eliminando registro financiero:', id);

    try {
      await apiClient.delete(`${this.BASE_URL}/${id}`);
      console.log('✅ [FRONTEND-FINANCIAL] Registro eliminado exitosamente');
    } catch (error) {
      console.error('❌ [FRONTEND-FINANCIAL] Error al eliminar registro:', error);
      throw new Error('Error al eliminar el registro financiero');
    }
  }

  // Guardar múltiples registros (siempre crear nuevos)
  static async saveRecords(records: FinancialRecord[]): Promise<FinancialRecord[]> {
    console.log('💾 [FRONTEND-FINANCIAL] Guardando múltiples registros:', records.length);
    console.log('💾 [FRONTEND-FINANCIAL] URL base:', this.BASE_URL);
    console.log('💾 [FRONTEND-FINANCIAL] Registros a guardar:', JSON.stringify(records, null, 2));

    const savedRecords: FinancialRecord[] = [];

    for (const record of records) {
      try {
        console.log(`💾 [FRONTEND-FINANCIAL] Procesando registro: ${record.name} - $${record.amount}`);
        // Siempre crear nuevo registro (no actualizar)
        const newRecord = await this.createRecord({
          businessId: record.businessId,
          moduleId: record.moduleId,
          name: record.name,
          amount: parseFloat(record.amount) || 0
        });
        savedRecords.push(newRecord);
        console.log(`✅ [FRONTEND-FINANCIAL] Registro creado: ${record.name} - $${record.amount}`);
        console.log(`✅ [FRONTEND-FINANCIAL] Registro guardado completo:`, JSON.stringify(newRecord, null, 2));
      } catch (error: any) {
        console.error('❌ [FRONTEND-FINANCIAL] Error al guardar registro:', record);
        console.error('❌ [FRONTEND-FINANCIAL] Detalles del error:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          response: error.response,
          data: error.response?.data
        });
        // Continuar con el siguiente registro
      }
    }

    console.log(`✅ [FRONTEND-FINANCIAL] ${savedRecords.length} registros guardados exitosamente`);
    console.log(`✅ [FRONTEND-FINANCIAL] Registros guardados:`, JSON.stringify(savedRecords, null, 2));
    return savedRecords;
  }
}
