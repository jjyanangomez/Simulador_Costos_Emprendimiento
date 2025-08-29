import { Controller, Get, Post, Body, Param, ParseIntPipe, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('Statuses')
@Controller('statuses')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new status' })
  @ApiResponse({ status: 201, description: 'The status was successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createDto: CreateStatusDto) {
    return this.statusService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all statuses' })
  @ApiResponse({ status: 200, description: 'A list of all statuses.' })
  findAll() {
    return this.statusService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a status by its ID' })
  @ApiParam({ name: 'id', description: 'The unique ID of the status' })
  @ApiResponse({ status: 200, description: 'Status found.' })
  @ApiResponse({ status: 404, description: 'Status not found.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.statusService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a status by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the status to update' })
  @ApiResponse({ status: 200, description: 'The status was successfully updated.' })
  @ApiResponse({ status: 404, description: 'Status not found.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateStatusDto) {
    return this.statusService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a status by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the status to delete' })
  @ApiResponse({ status: 204, description: 'The status was successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Status not found.' })
  @ApiResponse({ status: 409, description: 'Conflict: The status is currently in use and cannot be deleted.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.statusService.delete(id);
  }
}