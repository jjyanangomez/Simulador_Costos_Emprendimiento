import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { CreateCostoFijoDto } from '../models/dto/create-costo-fijo.dto';

@Injectable()
export class CostosFijosService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 📋 Obtener todos los tipos de costo disponibles
   */
  async getTiposCosto() {
    try {
      const tipos = await this.prisma.tiposCosto.findMany({
        where: {
          es_fijo: true // Solo tipos de costo fijo
        },
        orderBy: {
          nombre: 'asc'
        }
      });

      return tipos;
    } catch (error) {
      console.error('💥 [BACKEND] Error al obtener tipos de costo:', error);
      throw new Error('Error al obtener tipos de costo');
    }
  }

  /**
   * 💰 Obtener costos fijos de un negocio específico
   */
  async getCostosFijosByNegocio(negocioId: number) {
    try {
      const costos = await this.prisma.costosFijos.findMany({
        where: {
          negocio_id: negocioId,
          activo: true
        },
        include: {
          TiposCosto: {
            select: {
              nombre: true,
              descripcion: true
            }
          }
        },
        orderBy: {
          fecha_inicio: 'desc'
        }
      });

      return costos;
    } catch (error) {
      console.error('💥 [BACKEND] Error al obtener costos fijos:', error);
      throw new Error('Error al obtener costos fijos');
    }
  }

  /**
   * ➕ Crear un nuevo costo fijo
   */
  async createCostoFijo(createCostoFijoDto: CreateCostoFijoDto) {
    try {
      // 🔍 DEBUG: Log del DTO recibido
      console.log('🔍 [BACKEND] DTO recibido:', {
        negocioId: createCostoFijoDto.negocioId,
        tipoCostoId: createCostoFijoDto.tipoCostoId,
        nombre: createCostoFijoDto.nombre,
        descripcion: createCostoFijoDto.descripcion,
        monto: {
          value: createCostoFijoDto.monto,
          type: typeof createCostoFijoDto.monto,
          isNumber: typeof createCostoFijoDto.monto === 'number',
          isNaN: isNaN(createCostoFijoDto.monto)
        },
        frecuencia: createCostoFijoDto.frecuencia
      });
      
      // Verificar que el negocio existe
      const negocio = await this.prisma.negocios.findUnique({
        where: { negocio_id: createCostoFijoDto.negocioId }
      });

      if (!negocio) {
        throw new Error('El negocio especificado no existe');
      }

      // Verificar que el tipo de costo existe
      const tipoCosto = await this.prisma.tiposCosto.findUnique({
        where: { tipo_costo_id: createCostoFijoDto.tipoCostoId }
      });

      if (!tipoCosto) {
        throw new Error('El tipo de costo especificado no existe');
      }

      // 🔍 DEBUG: Log de los datos que se envían a Prisma
      console.log('🔍 [BACKEND] Datos enviados a Prisma:', {
        negocio_id: createCostoFijoDto.negocioId,
        tipo_costo_id: createCostoFijoDto.tipoCostoId,
        nombre: createCostoFijoDto.nombre,
        descripcion: createCostoFijoDto.descripcion,
        monto: {
          value: createCostoFijoDto.monto,
          type: typeof createCostoFijoDto.monto,
          isNumber: typeof createCostoFijoDto.monto === 'number',
          isNaN: isNaN(createCostoFijoDto.monto)
        },
        frecuencia: createCostoFijoDto.frecuencia,
        activo: true
      });
      
      // Crear el costo fijo
      const costo = await this.prisma.costosFijos.create({
        data: {
          negocio_id: createCostoFijoDto.negocioId,
          tipo_costo_id: createCostoFijoDto.tipoCostoId,
          nombre: createCostoFijoDto.nombre,
          descripcion: createCostoFijoDto.descripcion,
          monto: createCostoFijoDto.monto,
          frecuencia: createCostoFijoDto.frecuencia,
          activo: true
        },
        include: {
          TiposCosto: {
            select: {
              nombre: true,
              descripcion: true
            }
          }
        }
      });

      // 🔍 DEBUG: Log de éxito
      console.log('✅ [BACKEND] Costo fijo creado exitosamente:', {
        costo_fijo_id: costo.costo_fijo_id,
        monto_guardado: costo.monto,
        tipo_monto_guardado: typeof costo.monto
      });

      return costo;
    } catch (error) {
      console.error('💥 [BACKEND] Error al crear costo fijo:', error);
      throw new Error(`Error al crear costo fijo: ${error.message}`);
    }
  }
}
