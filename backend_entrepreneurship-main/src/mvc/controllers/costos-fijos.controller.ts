import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CostosFijosService } from '../services/costos-fijos.service';
import { CreateCostoFijoDto } from '../models/dto/create-costo-fijo.dto';

@Controller('costos-fijos')
export class CostosFijosController {
  constructor(private readonly costosFijosService: CostosFijosService) {}

  /**
   * 📋 Obtener todos los tipos de costo disponibles
   */
  @Get('tipos/lista')
  async getTiposCosto() {
    try {
      const tipos = await this.costosFijosService.getTiposCosto();
      return {
        success: true,
        data: tipos,
        message: `${tipos.length} tipos de costo encontrados`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al obtener tipos de costo'
      };
    }
  }

  /**
   * 💰 Obtener costos fijos de un negocio específico
   */
  @Get(':negocioId')
  async getCostosFijosByNegocio(@Param('negocioId') negocioId: string) {
    try {
      const costos = await this.costosFijosService.getCostosFijosByNegocio(parseInt(negocioId));
      return {
        success: true,
        data: costos,
        message: `${costos.length} costos fijos encontrados`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al obtener costos fijos'
      };
    }
  }

  /**
   * ➕ Crear un nuevo costo fijo
   */
  @Post()
  async createCostoFijo(@Body() createCostoFijoDto: CreateCostoFijoDto) {
    try {
      const costo = await this.costosFijosService.createCostoFijo(createCostoFijoDto);
      return {
        success: true,
        data: costo,
        message: 'Costo fijo creado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al crear costo fijo'
      };
    }
  }
}
