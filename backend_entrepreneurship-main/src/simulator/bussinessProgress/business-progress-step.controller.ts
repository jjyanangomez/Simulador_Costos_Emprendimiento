import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BusinessProgressStepService } from './business-progress-step.service';
import { CreateBusinessProgressStepDto } from './dto/create-business-progress-step.dto';
import { UpdateBusinessProgressStepDto } from './dto/update-business-progress-step.dto';

@ApiTags('Business Progress')
@Controller('business-progress')
export class BusinessProgressStepController {
  constructor(private readonly progressService: BusinessProgressStepService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new business progress step' })
  @ApiResponse({ status: 201, description: 'The progress step was successfully created.' })
  create(@Body() createDto: CreateBusinessProgressStepDto) {
    return this.progressService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all business progress steps' })
  findAll() {
    return this.progressService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a progress step by its ID' })
  @ApiParam({ name: 'id', description: 'The unique ID of the progress step' })
  @ApiResponse({ status: 404, description: 'Progress step not found.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.progressService.findById(id);
  }

  @Get('business/:businessId')
  @ApiOperation({ summary: 'Get all progress steps for a specific business' })
  @ApiParam({ name: 'businessId', description: 'The ID of the business' })
  findByBusinessId(@Param('businessId', ParseIntPipe) businessId: number) {
    return this.progressService.findByBusinessId(businessId);
  }

  @Patch(':id') // PATCH es más apropiado aquí para actualizaciones parciales
  @ApiOperation({ summary: 'Update a progress step by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the progress step to update' })
  @ApiResponse({ status: 404, description: 'Progress step not found.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateBusinessProgressStepDto) {
    return this.progressService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a progress step by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the progress step to delete' })
  @ApiResponse({ status: 204, description: 'The progress step was successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Progress step not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.progressService.delete(id);
  }
}