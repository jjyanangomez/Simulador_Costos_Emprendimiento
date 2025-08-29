import { Controller, Post, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ValidationResultService } from '../services/validation-result.service';
import { SaveValidationResultDto } from '../models/dto/save-validation-result.dto';

@ApiTags('Cost Validation')
@Controller('cost-validation')
export class CostValidationController {
  constructor(private readonly validationResultService: ValidationResultService) {}

  @Post()
  @ApiOperation({ summary: 'Guardar resultado de validación de costos' })
  @ApiResponse({ status: 201, description: 'Resultado de validación guardado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async saveValidationResult(@Body() saveDto: SaveValidationResultDto) {
    const result = await this.validationResultService.saveValidationResult(saveDto);
    return {
      success: true,
      message: 'Resultado de validación guardado exitosamente',
      data: result,
    };
  }

  @Get('business/:negocioId/module/:moduloId')
  @ApiOperation({ summary: 'Obtener resultado de validación por negocio y módulo' })
  @ApiParam({ name: 'negocioId', description: 'ID del negocio' })
  @ApiParam({ name: 'moduloId', description: 'ID del módulo' })
  @ApiResponse({ status: 200, description: 'Resultado de validación encontrado.' })
  @ApiResponse({ status: 404, description: 'No se encontró validación.' })
  async getValidationResultByBusinessAndModule(
    @Param('negocioId', ParseIntPipe) negocioId: number,
    @Param('moduloId', ParseIntPipe) moduloId: number,
  ) {
    const result = await this.validationResultService.getValidationResultByBusinessAndModule(negocioId, moduloId);
    
    if (!result) {
      return {
        success: false,
        message: 'No se encontró validación para el negocio y módulo especificados',
        data: null,
      };
    }

    return {
      success: true,
      message: 'Validación encontrada exitosamente',
      data: result,
    };
  }

  @Get('business/:negocioId')
  @ApiOperation({ summary: 'Obtener todos los resultados de validación de un negocio' })
  @ApiParam({ name: 'negocioId', description: 'ID del negocio' })
  @ApiResponse({ status: 200, description: 'Resultados de validación encontrados.' })
  async getValidationResultsByBusiness(@Param('negocioId', ParseIntPipe) negocioId: number) {
    const results = await this.validationResultService.getValidationResultsByBusiness(negocioId);
    
    return {
      success: true,
      message: `Se encontraron ${results.length} validaciones`,
      data: results,
    };
  }
}
