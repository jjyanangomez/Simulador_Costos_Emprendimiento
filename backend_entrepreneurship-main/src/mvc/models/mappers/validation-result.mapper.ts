import { Injectable } from '@nestjs/common';
import { ValidationResult } from '../entities/validation-result.entity';

@Injectable()
export class ValidationResultMapper {
  toDomain(prismaValidationResult: any): ValidationResult {
    console.log('🔍 [MAPPER] Datos recibidos de Prisma:', {
      costos_validados: prismaValidationResult.costos_validados,
      costos_faltantes: prismaValidationResult.costos_faltantes,
      resumen_validacion: prismaValidationResult.resumen_validacion
    });

    // Asegurar que los campos JSON se parseen correctamente
    const costosValidados = this.parseJsonField(prismaValidationResult.costos_validados);
    const costosFaltantes = this.parseJsonField(prismaValidationResult.costos_faltantes);
    const resumenValidacion = this.parseJsonField(prismaValidationResult.resumen_validacion);

    console.log('🔍 [MAPPER] Datos parseados:', {
      costosValidados,
      costosFaltantes,
      resumenValidacion
    });

    return new ValidationResult(
      prismaValidationResult.negocio_id,
      prismaValidationResult.modulo_id,
      prismaValidationResult.puede_proseguir_analisis,
      prismaValidationResult.validacion_id,
      prismaValidationResult.fecha_validacion,
      costosValidados,
      costosFaltantes,
      resumenValidacion,
      prismaValidationResult.puntuacion_global,
    );
  }

  toPrisma(validationResult: ValidationResult): any {
    return {
      negocio_id: validationResult.negocioId,
      modulo_id: validationResult.moduloId,
      fecha_validacion: validationResult.fechaValidacion,
      costos_validados: validationResult.costosValidados, // Pasar directamente el objeto/array
      costos_faltantes: validationResult.costosFaltantes, // Pasar directamente el objeto/array
      resumen_validacion: validationResult.resumenValidacion, // Pasar directamente el objeto/array
      puntuacion_global: validationResult.puntuacionGlobal,
      puede_proseguir_analisis: validationResult.puedeProseguirAnalisis,
    };
  }

  /**
   * Parsea un campo JSON de forma segura
   */
  private parseJsonField(field: any): any {
    console.log('🔍 [MAPPER] parseJsonField recibió:', field, 'tipo:', typeof field, 'esArray:', Array.isArray(field));
    
    if (field === null || field === undefined) {
      console.log('🔍 [MAPPER] Campo es null/undefined, retornando null');
      return null;
    }
    
    // Si ya es un objeto, retornarlo tal como está
    if (typeof field === 'object' && !Array.isArray(field)) {
      console.log('🔍 [MAPPER] Campo es objeto, retornando tal como está');
      return field;
    }
    
    // Si es un array, retornarlo tal como está
    if (Array.isArray(field)) {
      console.log('🔍 [MAPPER] Campo es array, retornando tal como está:', field);
      return field;
    }
    
    // Si es un string, intentar parsearlo como JSON
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        console.log('🔍 [MAPPER] String parseado exitosamente:', parsed);
        return parsed;
      } catch (error) {
        console.warn('🔍 [MAPPER] Error parsing JSON field:', error);
        return field; // Retornar el string original si no se puede parsear
      }
    }
    
    console.log('🔍 [MAPPER] Retornando campo tal como está:', field);
    return field;
  }

  /**
   * Convierte un campo a string JSON de forma segura
   */
  private stringifyJsonField(field: any): any {
    if (field === null || field === undefined) {
      return null;
    }
    
    // Si ya es un string, retornarlo tal como está
    if (typeof field === 'string') {
      return field;
    }
    
    // Si es un objeto o array, convertirlo a string JSON
    if (typeof field === 'object') {
      try {
        return JSON.stringify(field);
      } catch (error) {
        console.warn('Error stringifying JSON field:', error);
        return null;
      }
    }
    
    return field;
  }
}
