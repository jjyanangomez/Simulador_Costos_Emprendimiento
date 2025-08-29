import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { ValidationResultMapper } from '../models/mappers/validation-result.mapper';
import { ValidationResult } from '../models/entities/validation-result.entity';
import { SaveValidationResultDto } from '../models/dto/save-validation-result.dto';

@Injectable()
export class ValidationResultService {
  private readonly logger = new Logger(ValidationResultService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: ValidationResultMapper,
  ) {}

  async saveValidationResult(saveDto: SaveValidationResultDto): Promise<ValidationResult> {
    try {
      this.logger.log(`Guardando resultado de validación para negocio ${saveDto.negocioId}, módulo ${saveDto.moduloId}`);
      
      // Log de los datos que llegan
      this.logger.log('📥 [SERVICE] Datos recibidos:', {
        costosValidados: saveDto.costosValidados,
        costosFaltantes: saveDto.costosFaltantes,
        resumenValidacion: saveDto.resumenValidacion
      });

      // Validar que los datos JSON sean válidos antes de guardar
      const validatedData = this.validateAndPrepareData(saveDto);
      
      // Log de los datos validados
      this.logger.log('✅ [SERVICE] Datos validados:', {
        costosValidados: validatedData.costosValidados,
        costosFaltantes: validatedData.costosFaltantes,
        resumenValidacion: validatedData.resumenValidacion
      });

      const validationResultPrisma = await this.prisma.resultados_Validacion_Costos.create({
        data: {
          negocio_id: validatedData.negocioId,
          modulo_id: validatedData.moduloId,
          costos_validados: validatedData.costosValidados,
          costos_faltantes: validatedData.costosFaltantes,
          resumen_validacion: validatedData.resumenValidacion,
          puntuacion_global: validatedData.puntuacionGlobal,
          puede_proseguir_analisis: validatedData.puedeProseguirAnalisis,
        },
      });

      this.logger.log(`Resultado de validación guardado exitosamente con ID: ${validationResultPrisma.validacion_id}`);
      
      // Log de lo que se guardó en la base de datos
      this.logger.log('💾 [SERVICE] Datos guardados en BD:', {
        costos_validados: validationResultPrisma.costos_validados,
        costos_faltantes: validationResultPrisma.costos_faltantes,
        resumen_validacion: validationResultPrisma.resumen_validacion
      });

      return this.mapper.toDomain(validationResultPrisma);
    } catch (error) {
      this.logger.error(`Error guardando resultado de validación: ${error.message}`, error.stack);
      throw new Error(`Error al guardar resultado de validación: ${error.message}`);
    }
  }

  async getValidationResultByBusinessAndModule(negocioId: number, moduloId: number): Promise<ValidationResult | null> {
    try {
      this.logger.log(`Buscando validación para negocio ${negocioId}, módulo ${moduloId}`);

      const validationResultPrisma = await this.prisma.resultados_Validacion_Costos.findFirst({
        where: {
          negocio_id: negocioId,
          modulo_id: moduloId,
        },
        orderBy: {
          fecha_validacion: 'desc',
        },
      });

      if (!validationResultPrisma) {
        this.logger.log(`No se encontró validación para negocio ${negocioId}, módulo ${moduloId}`);
        return null;
      }

      this.logger.log(`Validación encontrada con ID: ${validationResultPrisma.validacion_id}`);
      return this.mapper.toDomain(validationResultPrisma);
    } catch (error) {
      this.logger.error(`Error obteniendo validación: ${error.message}`, error.stack);
      throw new Error(`Error al obtener validación: ${error.message}`);
    }
  }

  async getValidationResultsByBusiness(negocioId: number): Promise<ValidationResult[]> {
    try {
      this.logger.log(`Buscando todas las validaciones para negocio ${negocioId}`);

      const validationResultsPrisma = await this.prisma.resultados_Validacion_Costos.findMany({
        where: {
          negocio_id: negocioId,
        },
        orderBy: {
          fecha_validacion: 'desc',
        },
      });

      this.logger.log(`Se encontraron ${validationResultsPrisma.length} validaciones para negocio ${negocioId}`);

      return validationResultsPrisma.map(result => this.mapper.toDomain(result));
    } catch (error) {
      this.logger.error(`Error obteniendo validaciones: ${error.message}`, error.stack);
      throw new Error(`Error al obtener validaciones: ${error.message}`);
    }
  }

  /**
   * Valida y prepara los datos antes de guardarlos en la base de datos
   */
  private validateAndPrepareData(saveDto: SaveValidationResultDto): any {
    // Validar que los campos JSON sean válidos
    const costosValidados = this.validateJsonField(saveDto.costosValidados, 'costosValidados');
    const costosFaltantes = this.validateJsonField(saveDto.costosFaltantes, 'costosFaltantes');
    const resumenValidacion = this.validateJsonField(saveDto.resumenValidacion, 'resumenValidacion');

    return {
      negocioId: saveDto.negocioId,
      moduloId: saveDto.moduloId,
      costosValidados,
      costosFaltantes,
      resumenValidacion,
      puntuacionGlobal: saveDto.puntuacionGlobal,
      puedeProseguirAnalisis: saveDto.puedeProseguirAnalisis,
    };
  }

  /**
   * Valida que un campo JSON sea válido
   */
  private validateJsonField(field: any, fieldName: string): any {
    if (field === null || field === undefined) {
      return null;
    }

    // Si es un string, intentar parsearlo
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch (error) {
        this.logger.warn(`Campo ${fieldName} no es un JSON válido: ${error.message}`);
        return field; // Retornar el string original
      }
    }

    // Si es un objeto o array, validar que sea serializable
    if (typeof field === 'object') {
      try {
        JSON.stringify(field); // Probar que se puede serializar
        return field;
      } catch (error) {
        this.logger.warn(`Campo ${fieldName} no es serializable: ${error.message}`);
        return null;
      }
    }

    return field;
  }
}
