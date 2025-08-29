import { Controller, Get, Post, Body, Param, ParseIntPipe, Put, Delete, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { LearningService } from './learning.service';
import { CreateLearningDto } from './dto/create-learnig.dto';
import { UpdateLearningDto } from './dto/update-learning.dto';

@ApiTags('Learning')
@Controller('learning')
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new learning path' })
  @ApiResponse({ status: 201, description: 'The learning path was successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createDto: CreateLearningDto) {
    return this.learningService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all learning paths' })
  @ApiResponse({ status: 200, description: 'A list of all learning paths.' })
  findAll() {
    return this.learningService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a learning path by its ID' })
  @ApiParam({ name: 'id', description: 'The unique ID of the learning path' })
  @ApiResponse({ status: 200, description: 'Learning path found.' })
  @ApiResponse({ status: 404, description: 'Learning path not found.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.learningService.findById(id);
  }

  @Put(':id') // Usamos PUT para reemplazo completo, Patch sería para parcial
  @ApiOperation({ summary: 'Update a learning path by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the learning path to update' })
  @ApiResponse({ status: 200, description: 'The learning path was successfully updated.' })
  @ApiResponse({ status: 404, description: 'Learning path not found.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateLearningDto) {
    return this.learningService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a learning path by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the learning path to delete' })
  @ApiResponse({ status: 204, description: 'The learning path was successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Learning path not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.learningService.delete(id);
  }
}