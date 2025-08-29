import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DetectedRiskResultService } from './detected-risk-result.service';
import { CreateDetectedRiskResultDto } from './dto/create-detected-risk-result.dto';
import { UpdateDetectedRiskResultDto } from './dto/update-detected-risk-result.dto';

@ApiTags('Risk Detection')
@Controller('risk-detection')
export class DetectedRiskResultController {
  constructor(private readonly service: DetectedRiskResultService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new detected risk result' })
  @ApiResponse({ status: 201, description: 'The detected risk result was successfully created.' })
  create(@Body() createDto: CreateDetectedRiskResultDto) {
    return this.service.create(createDto);
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  health() {
    return { status: 'OK', message: 'Risk detection service is running', timestamp: new Date().toISOString() };
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Create multiple detected risk results' })
  @ApiResponse({ status: 201, description: 'The detected risk results were successfully created.' })
  async createMultiple(@Body() createDto: any) {
    try {
      console.log('🔍 [RISK-CONTROLLER] ===== DATOS RECIBIDOS =====');
      console.log('🔍 [RISK-CONTROLLER] createDto completo:', JSON.stringify(createDto, null, 2));
      console.log('🔍 [RISK-CONTROLLER] Tipo de createDto:', typeof createDto);
      console.log('🔍 [RISK-CONTROLLER] createDto.results:', createDto?.results);
      console.log('🔍 [RISK-CONTROLLER] Es array:', Array.isArray(createDto?.results));
      console.log('🔍 [RISK-CONTROLLER] Longitud:', createDto?.results?.length);
      
      if (!createDto.results || !Array.isArray(createDto.results) || createDto.results.length === 0) {
        console.log('❌ [RISK-CONTROLLER] Validación fallida');
        throw new Error('Se requiere un array de resultados para crear múltiples riesgos detectados');
      }
      
      console.log('✅ [RISK-CONTROLLER] Llamando al servicio...');
      const result = await this.service.createMultiple(createDto.results);
      console.log('✅ [RISK-CONTROLLER] Servicio completado');
      return result;
    } catch (error) {
      console.error('❌ [RISK-CONTROLLER] Error:', error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all detected risk results' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a detected risk result by its ID' })
  @ApiParam({ name: 'id', description: 'The unique ID of the detected risk result' })
  @ApiResponse({ status: 404, description: 'Detected risk result not found.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Get('analysis/:analysisId')
  @ApiOperation({ summary: 'Get all detected risk results for a specific AI analysis' })
  @ApiParam({ name: 'analysisId', description: 'The ID of the AI analysis' })
  findByAnalysisId(@Param('analysisId', ParseIntPipe) analysisId: number) {
    return this.service.findByAnalysisId(analysisId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a detected risk result by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the detected risk result to update' })
  @ApiResponse({ status: 404, description: 'Detected risk result not found.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateDetectedRiskResultDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a detected risk result by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the detected risk result to delete' })
  @ApiResponse({ status: 204, description: 'The detected risk result was successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Detected risk result not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}