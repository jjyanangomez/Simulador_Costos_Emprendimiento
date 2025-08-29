import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';

@Injectable()
export class BusinessProgressStepService {
  constructor(private readonly prisma: PrismaService) {}

  async completeModule(negocioId: number, moduloId: number) {
    try {
      console.log('🔍 [SERVICE] Buscando progreso existente:', { negocioId, moduloId });
      
      // Buscar el progreso existente
      let existingProgress = await this.prisma.negocioProgresoPaso.findFirst({
        where: {
          negocio_id: negocioId,
          modulo_id: moduloId,
        },
      });

      // Si no existe, crear uno nuevo
      if (!existingProgress) {
        console.log('📝 [SERVICE] Creando nuevo progreso para:', { negocioId, moduloId });
        
        // Obtener el estado "En Progreso" (id_estado = 2 según el seed)
        const estadoEnProgreso = await this.prisma.estados.findFirst({
          where: { nombre_estado: 'En Progreso' },
        });

        if (!estadoEnProgreso) {
          throw new Error('Estado "En Progreso" no encontrado en la base de datos');
        }

        existingProgress = await this.prisma.negocioProgresoPaso.create({
          data: {
            negocio_id: negocioId,
            modulo_id: moduloId,
            id_estado: estadoEnProgreso.id_estado,
            fecha_inicio: new Date(),
          },
        });

        console.log('✅ [SERVICE] Nuevo progreso creado:', existingProgress);
      }

      // Obtener el ID del estado "Completado" (id_estado = 3 según el seed)
      const estadoCompletado = await this.prisma.estados.findFirst({
        where: { nombre_estado: 'Completado' },
      });

      if (!estadoCompletado) {
        throw new Error('Estado "Completado" no encontrado en la base de datos');
      }

      console.log('📝 [SERVICE] Actualizando progreso a completado...');
      
      // Actualizar el progreso
      const updatedProgress = await this.prisma.negocioProgresoPaso.update({
        where: {
          id: existingProgress.id,
        },
        data: {
          id_estado: estadoCompletado.id_estado,
          fecha_completado: new Date(),
        },
        include: {
          Estados: true,
          Modulos: true,
          Negocios: true,
        },
      });

      console.log('✅ [SERVICE] Progreso actualizado exitosamente:', updatedProgress);
      
      return {
        id: updatedProgress.id,
        negocio_id: updatedProgress.negocio_id,
        modulo_id: updatedProgress.modulo_id,
        estado: updatedProgress.Estados.nombre_estado,
        fecha_completado: updatedProgress.fecha_completado,
        modulo_nombre: updatedProgress.Modulos.nombre_modulo,
        negocio_nombre: updatedProgress.Negocios.nombre_negocio,
      };
    } catch (error) {
      console.error('💥 [SERVICE] Error en completeModule:', error);
      throw error;
    }
  }

  async getProgress(negocioId: number, moduloId: number) {
    try {
      console.log('🔍 [SERVICE] Obteniendo progreso del módulo:', { negocioId, moduloId });
      
      const progress = await this.prisma.negocioProgresoPaso.findFirst({
        where: {
          negocio_id: negocioId,
          modulo_id: moduloId,
        },
        include: {
          Estados: true,
          Modulos: true,
          Negocios: true,
        },
      });

      if (!progress) {
        console.log('❌ [SERVICE] Progreso no encontrado para:', { negocioId, moduloId });
        return null;
      }

      console.log('✅ [SERVICE] Progreso encontrado:', progress);
      
      return {
        id: progress.id,
        negocio_id: progress.negocio_id,
        modulo_id: progress.modulo_id,
        id_estado: progress.id_estado,
        fecha_inicio: progress.fecha_inicio,
        fecha_completado: progress.fecha_completado,
        estado_nombre: progress.Estados.nombre_estado,
      };
    } catch (error) {
      console.error('💥 [SERVICE] Error en getProgress:', error);
      throw error;
    }
  }
}
