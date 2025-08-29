import { Controller, Get, Post, Body, Param, ParseIntPipe, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FinancialRecordService } from './financial-record.service';
import { CreateFinancialRecordDto } from './dto/create-financial-record.dto';
import { UpdateFinancialRecordDto } from './dto/update-financial-record.dto';

@ApiTags('Financial Records')
@Controller('financial-records')
export class FinancialRecordController {
  constructor(private readonly recordService: FinancialRecordService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new financial record' })
  @ApiResponse({ status: 201, description: 'The record was successfully created.' })
  create(@Body() createDto: CreateFinancialRecordDto) {
    return this.recordService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all financial records' })
  findAll() {
    return this.recordService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a financial record by its ID' })
  @ApiParam({ name: 'id', description: 'The unique ID of the financial record' })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.recordService.findById(id);
  }

  @Get('business/:businessId')
  @ApiOperation({ summary: 'Get all financial records for a specific business' })
  @ApiParam({ name: 'businessId', description: 'The ID of the business' })
  findByBusinessId(@Param('businessId', ParseIntPipe) businessId: number) {
    return this.recordService.findByBusinessId(businessId);
  }

  @Get('business/:businessId/module/:moduleId')
  @ApiOperation({ summary: 'Get all financial records for a specific business and module' })
  @ApiParam({ name: 'businessId', description: 'The ID of the business' })
  @ApiParam({ name: 'moduleId', description: 'The ID of the module' })
  findByBusinessAndModule(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Param('moduleId', ParseIntPipe) moduleId: number
  ) {
    console.log(`📥 [SIMULATOR-FINANCIAL-CONTROLLER] Solicitando registros para negocio ${businessId} y módulo ${moduleId}`);
    return this.recordService.findByBusinessAndModule(businessId, moduleId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a financial record by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the record to update' })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateFinancialRecordDto) {
    return this.recordService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a financial record by its ID' })
  @ApiParam({ name: 'id', description: 'The ID of the record to delete' })
  @ApiResponse({ status: 204, description: 'The record was successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.recordService.delete(id);
  }
}