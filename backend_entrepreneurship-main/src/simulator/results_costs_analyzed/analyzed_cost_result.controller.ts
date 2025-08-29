import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiProperty } from '@nestjs/swagger';
import { AnalyzedCostResultService } from './analyzed_cost_result.service';
import { CreateAnalyzedCostResultDto } from './dto/create-results_costs_analyzed.dto';
import { UpdateAnalyzedCostResultDto } from './dto/update-results_costs_analyzed.dto';

// DTO para crear múltiples resultados
export class CreateMultipleAnalyzedCostResultsDto {
  @ApiProperty({ description: 'Array de resultados de análisis de costos', type: [CreateAnalyzedCostResultDto] })
  results: CreateAnalyzedCostResultDto[];
}

@ApiTags('Analyzed Costs')
@Controller('analyzed-costs')
export class AnalyzedCostResultController {
  constructor(private readonly service: AnalyzedCostResultService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new analyzed cost result' })
  @ApiResponse({ status: 201, description: 'The analyzed cost result was successfully created.' })
  create(@Body() createDto: CreateAnalyzedCostResultDto) {
    return this.service.create(createDto);
  }

  @Post('test')
  @ApiOperation({ summary: 'Test endpoint for validation' })
  @ApiResponse({ status: 200, description: 'Validation test successful.' })
  testValidation(@Body() createDto: CreateAnalyzedCostResultDto) {
    return { message: 'Validation successful', data: createDto };
  }

  @Post('test-multiple')
  @ApiOperation({ summary: 'Test endpoint for multiple validation' })
  @ApiResponse({ status: 200, description: 'Multiple validation test successful.' })
  testMultipleValidation(@Body() createDto: CreateMultipleAnalyzedCostResultsDto) {
    return { 
      message: 'Multiple validation test successful', 
      receivedData: createDto,
      resultsCount: createDto?.results?.length || 0
    };
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Create multiple analyzed cost results' })
  @ApiResponse({ status: 201, description: 'The analyzed cost results were successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  async createMultiple(@Body() createDto: any) {
    try {
      console.log('🔍 [CONTROLLER] ===== DATOS RECIBIDOS =====');
      console.log('🔍 [CONTROLLER] createDto completo:', JSON.stringify(createDto, null, 2));
      console.log('🔍 [CONTROLLER] Tipo de createDto:', typeof createDto);
      console.log('🔍 [CONTROLLER] createDto.results:', createDto?.results);
      console.log('🔍 [CONTROLLER] Tipo de results:', typeof createDto?.results);
      console.log('🔍 [CONTROLLER] Es array:', Array.isArray(createDto?.results));
      console.log('🔍 [CONTROLLER] Longitud:', createDto?.results?.length);
      
      // Validar que el DTO y los resultados estén presentes
      if (!createDto) {
        console.log('❌ [CONTROLLER] createDto es null/undefined');
        throw new Error('Se requiere un objeto con datos para crear múltiples análisis de costos');
      }

      if (!createDto.results) {
        console.log('❌ [CONTROLLER] createDto.results es null/undefined');
        throw new Error('Se requiere un array de resultados para crear múltiples análisis de costos');
      }

      // Validar que el array no esté vacío
      if (!Array.isArray(createDto.results)) {
        console.log('❌ [CONTROLLER] results no es un array:', typeof createDto.results);
        throw new Error('El campo "results" debe ser un array');
      }

      if (createDto.results.length === 0) {
        console.log('❌ [CONTROLLER] array de results está vacío');
        throw new Error('El array de resultados no puede estar vacío');
      }

      console.log('✅ [CONTROLLER] Validaciones pasadas, procesando datos...');
      console.log('✅ [CONTROLLER] Primer elemento:', createDto.results[0]);

      // Validar que cada elemento del array tenga los campos requeridos
      for (let i = 0; i < createDto.results.length; i++) {
        const result = createDto.results[i];
        if (!result.analysisId) {
          throw new Error(`El elemento ${i + 1} debe tener un analysisId válido`);
        }
        if (!result.costName) {
          throw new Error(`El elemento ${i + 1} debe tener un costName válido`);
        }
      }

      console.log('✅ [CONTROLLER] Llamando al servicio...');
      const result = await this.service.createMultiple(createDto.results);
      console.log('✅ [CONTROLLER] Servicio completado, retornando respuesta...');
      
      return {
        success: true,
        message: `${result.length} resultados de análisis creados exitosamente`,
        data: result
      };
    } catch (error) {
      console.error('❌ [CONTROLLER] Error en createMultiple:', error);
      return {
        success: false,
        message: error.message || 'Error al crear los resultados de análisis',
        error: error.message,
        receivedData: createDto
      };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all analyzed cost results' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an analyzed cost result by its ID' })
  @ApiParam({ name: 'id', description: 'The unique ID of the analyzed cost result' })
  @ApiResponse({ status: 404, description: 'Analyzed cost result not found.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Get('analysis/:analysisId')
  @ApiOperation({ summary: 'Get all analyzed cost results for a specific AI analysis' })
  @ApiParam({ name: 'analysisId', description: 'The ID of the AI analysis' })
  findByAnalysisId(@Param('analysisId', ParseIntPipe) analysisId: number) {
    return this.service.findByAnalysisId(analysisId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an analyzed cost result by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the analyzed cost result to update' })
  @ApiResponse({ status: 404, description: 'Analyzed cost result not found.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateAnalyzedCostResultDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an analyzed cost result by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the analyzed cost result to delete' })
  @ApiResponse({ status: 204, description: 'The analyzed cost result was successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Analyzed cost result not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}