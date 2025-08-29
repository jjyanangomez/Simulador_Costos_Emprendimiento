import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { FinancialRecordMapper } from '../models/mappers/financial-record.mapper';
import { CreateFinancialRecordDto } from '../models/dto/create-financial-record.dto';
import { FinancialRecord } from '../models/entities/financial-record.entity';
import { UpdateFinancialRecordDto } from '../models/dto/update-financial-record.dto';

@Injectable()
export class FinancialRecordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: FinancialRecordMapper,
  ) {}

  async create(createDto: CreateFinancialRecordDto): Promise<FinancialRecord> {
    const recordPrisma = await this.prisma.registros_financieros.create({
      data: {
        negocio_id: createDto.businessId,
        modulo_id: createDto.moduleId,
        nombre: createDto.name,
        monto: createDto.amount,
      },
    });
    return this.mapper.toDomain(recordPrisma);
  }

  async findAll(): Promise<FinancialRecord[]> {
    const recordsPrisma = await this.prisma.registros_financieros.findMany();
    return recordsPrisma.map(this.mapper.toDomain);
  }

  async findById(id: number): Promise<FinancialRecord> {
    const recordPrisma = await this.prisma.registros_financieros.findUnique({
      where: { registro_id: id },
    });

    if (!recordPrisma) {
      throw new NotFoundException(`Financial Record with ID ${id} not found.`);
    }
    return this.mapper.toDomain(recordPrisma);
  }

  async findByBusinessId(businessId: number): Promise<FinancialRecord[]> {
    const recordsPrisma = await this.prisma.registros_financieros.findMany({
      where: { negocio_id: businessId },
    });
    return recordsPrisma.map(this.mapper.toDomain);
  }

  async findByBusinessAndModule(businessId: number, moduleId: number): Promise<FinancialRecord[]> {
    const recordsPrisma = await this.prisma.registros_financieros.findMany({
      where: { 
        negocio_id: businessId,
        modulo_id: moduleId 
      },
      orderBy: {
        fecha_registro: 'asc'
      }
    });
    
    return recordsPrisma.map(this.mapper.toDomain);
  }

  async update(id: number, updateDto: UpdateFinancialRecordDto): Promise<FinancialRecord> {
    await this.findById(id); // Verifica que el registro exista

    const updatedRecordPrisma = await this.prisma.registros_financieros.update({
      where: { registro_id: id },
      data: {
        negocio_id: updateDto.businessId,
        modulo_id: updateDto.moduleId,
        nombre: updateDto.name,
        monto: updateDto.amount,
      },
    });
    return this.mapper.toDomain(updatedRecordPrisma);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id); // Verifica que el registro exista

    await this.prisma.registros_financieros.delete({
      where: { registro_id: id },
    });
  }
}
