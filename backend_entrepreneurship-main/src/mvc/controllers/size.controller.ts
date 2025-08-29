import { Controller, Get, Post, Body, Param, ParseIntPipe, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SizeService } from '../services/size.service';
import { CreateSizeDto } from '../models/dto/create-size.dto';
import { UpdateSizeDto } from '../models/dto/update-size.dto';

@ApiTags('Sizes')
@Controller('sizes')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new business size' })
  @ApiResponse({ status: 201, description: 'The size was successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createDto: CreateSizeDto) {
    return this.sizeService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all business sizes' })
  @ApiResponse({ status: 200, description: 'A list of all business sizes.' })
  findAll() {
    return this.sizeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a business size by its ID' })
  @ApiParam({ name: 'id', description: 'The unique ID of the business size' })
  @ApiResponse({ status: 200, description: 'Business size found.' })
  @ApiResponse({ status: 404, description: 'Business size not found.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.sizeService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a business size by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the business size to update' })
  @ApiResponse({ status: 200, description: 'The size was successfully updated.' })
  @ApiResponse({ status: 404, description: 'Business size not found.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateSizeDto) {
    return this.sizeService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a business size by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the business size to delete' })
  @ApiResponse({ status: 204, description: 'The size was successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Business size not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.sizeService.delete(id);
  }
}
