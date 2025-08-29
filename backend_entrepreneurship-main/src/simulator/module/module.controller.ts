import { Controller, Get, Post, Body, Param, ParseIntPipe, Put, Delete, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@ApiTags('Modules')
@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new module' })
  @ApiResponse({ status: 201, description: 'The module was successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createDto: CreateModuleDto) {
    return this.moduleService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all modules' })
  @ApiResponse({ status: 200, description: 'A list of all modules.' })
  findAll() {
    return this.moduleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a module by its ID' })
  @ApiParam({ name: 'id', description: 'The unique ID of the module' })
  @ApiResponse({ status: 200, description: 'Module found.' })
  @ApiResponse({ status: 404, description: 'Module not found.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.moduleService.findById(id);
  }

  @Patch(':id') // Usamos PATCH para actualizaciones parciales
  @ApiOperation({ summary: 'Update a module by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the module to update' })
  @ApiResponse({ status: 200, description: 'The module was successfully updated.' })
  @ApiResponse({ status: 404, description: 'Module not found.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateModuleDto) {
    return this.moduleService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a module by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the module to delete' })
  @ApiResponse({ status: 204, description: 'The module was successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Module not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.moduleService.delete(id);
  }
}