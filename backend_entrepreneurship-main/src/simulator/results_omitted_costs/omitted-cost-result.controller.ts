import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OmittedCostResultService } from './omitted-cost-result.service';
import { CreateOmittedCostResultDto } from './dto/create-omitted-cost-result.dto';
import { UpdateOmittedCostResultDto } from './dto/update-omitted-cost-result.dto';

@ApiTags('Omitted Costs')
@Controller('omitted-costs')
export class OmittedCostResultController {
  constructor(private readonly service: OmittedCostResultService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new omitted cost result' })
  @ApiResponse({ status: 201, description: 'The omitted cost result was successfully created.' })
  create(@Body() createDto: CreateOmittedCostResultDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all omitted cost results' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an omitted cost result by its ID' })
  @ApiParam({ name: 'id', description: 'The unique ID of the omitted cost result' })
  @ApiResponse({ status: 404, description: 'Omitted cost result not found.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Get('analysis/:analysisId')
  @ApiOperation({ summary: 'Get all omitted cost results for a specific AI analysis' })
  @ApiParam({ name: 'analysisId', description: 'The ID of the AI analysis' })
  findByAnalysisId(@Param('analysisId', ParseIntPipe) analysisId: number) {
    return this.service.findByAnalysisId(analysisId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an omitted cost result by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the omitted cost result to update' })
  @ApiResponse({ status: 404, description: 'Omitted cost result not found.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateOmittedCostResultDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an omitted cost result by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the omitted cost result to delete' })
  @ApiResponse({ status: 204, description: 'The omitted cost result was successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Omitted cost result not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}