import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  Delete,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateAnalisisIADto } from './dto/create-analysis_ai.dto';
import { UpdateAnalisisIADto } from './dto/update-analysis_ai.dto';
import { AnalisisIAService } from './analysis_ai.service';

@ApiTags('Analisis IA')
@Controller('analisis-ia')
export class AnalisisIAController {
  constructor(private readonly analisisIAService: AnalisisIAService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new analysis ai' })
  @ApiResponse({ status: 201, description: 'The analysis ai was successfully created.' })
  create(@Body() createDto: CreateAnalisisIADto) {
    return this.analisisIAService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all analysis ai ' })
  findAll() {
    return this.analisisIAService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a analysis ai by its ID' })
  @ApiParam({ name: 'id', description: 'The unique ID of the analysis ai' })
  @ApiResponse({ status: 404, description: 'Analysis ai not found.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.analisisIAService.findById(id);
  }

  @Patch(':id') // PATCH es más apropiado aquí para actualizaciones parciales
  @ApiOperation({ summary: 'Update a analysis ai by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the analysis ai to update' })
  @ApiResponse({ status: 404, description: 'analysis ai not found.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateAnalisisIADto) {
    return this.analisisIAService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a analysis ai by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the analysis ai to delete' })
  @ApiResponse({ status: 204, description: 'The analysis ai was successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Analysis ai not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.analisisIAService.delete(id);
  }
}
