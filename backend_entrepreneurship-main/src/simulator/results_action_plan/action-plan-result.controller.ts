import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ActionPlanResultService } from './action-plan-result.service';
import { CreateActionPlanResultDto } from './dto/create-action-plan-result.dto';
import { UpdateActionPlanResultDto } from './dto/update-action-plan-result.dto';

@ApiTags('Action Plan')
@Controller('action-plan')
export class ActionPlanResultController {
  constructor(private readonly service: ActionPlanResultService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new action plan result' })
  @ApiResponse({ status: 201, description: 'The action plan result was successfully created.' })
  create(@Body() createDto: CreateActionPlanResultDto) {
    return this.service.create(createDto);
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  health() {
    return { status: 'OK', message: 'Action plan service is running', timestamp: new Date().toISOString() };
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Create multiple action plan results' })
  @ApiResponse({ status: 201, description: 'The action plan results were successfully created.' })
  async createMultiple(@Body() createDto: any) {
    try {
      console.log('🔍 [ACTION-CONTROLLER] ===== DATOS RECIBIDOS =====');
      console.log('🔍 [ACTION-CONTROLLER] createDto completo:', JSON.stringify(createDto, null, 2));
      console.log('🔍 [ACTION-CONTROLLER] Tipo de createDto:', typeof createDto);
      console.log('🔍 [ACTION-CONTROLLER] createDto.results:', createDto?.results);
      console.log('🔍 [ACTION-CONTROLLER] Es array:', Array.isArray(createDto?.results));
      console.log('🔍 [ACTION-CONTROLLER] Longitud:', createDto?.results?.length);
      
      if (!createDto.results || !Array.isArray(createDto.results) || createDto.results.length === 0) {
        console.log('❌ [ACTION-CONTROLLER] Validación fallida');
        throw new Error('Se requiere un array de resultados para crear múltiples planes de acción');
      }
      
      console.log('✅ [ACTION-CONTROLLER] Llamando al servicio...');
      const result = await this.service.createMultiple(createDto.results);
      console.log('✅ [ACTION-CONTROLLER] Servicio completado');
      return result;
    } catch (error) {
      console.error('❌ [ACTION-CONTROLLER] Error:', error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all action plan results' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an action plan result by its ID' })
  @ApiParam({ name: 'id', description: 'The unique ID of the action plan result' })
  @ApiResponse({ status: 404, description: 'Action plan result not found.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Get('analysis/:analysisId')
  @ApiOperation({ summary: 'Get all action plan results for a specific AI analysis' })
  @ApiParam({ name: 'analysisId', description: 'The ID of the AI analysis' })
  findByAnalysisId(@Param('analysisId', ParseIntPipe) analysisId: number) {
    return this.service.findByAnalysisId(analysisId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an action plan result by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the action plan result to update' })
  @ApiResponse({ status: 404, description: 'Action plan result not found.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateActionPlanResultDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an action plan result by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the action plan result to delete' })
  @ApiResponse({ status: 204, description: 'The action plan result was successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Action plan result not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}