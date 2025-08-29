import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { OmittedCostResult } from './entities/omitted-cost-result.entity';
import { CreateOmittedCostResultDto } from './dto/create-omitted-cost-result.dto';
import { UpdateOmittedCostResultDto } from './dto/update-omitted-cost-result.dto';
import { OmittedCostResultMapper } from './mappers/omitted-cost-result.mapper';

@Injectable()
export class OmittedCostResultService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: OmittedCostResultMapper,
  ) {}

  async create(createDto: CreateOmittedCostResultDto): Promise<OmittedCostResult> {
    const prismaResult = await this.prisma.resultados_Costos_Omitidos.create({
      data: {
        analisis_id: createDto.analysisId,
        costo_omitido: createDto.omittedCost,
        importancia: createDto.importance,
      },
    });
    return this.mapper.toDomain(prismaResult);
  }

  async findAll(): Promise<OmittedCostResult[]> {
    const prismaResults = await this.prisma.resultados_Costos_Omitidos.findMany();
    return prismaResults.map(this.mapper.toDomain);
  }

  async findById(id: number): Promise<OmittedCostResult> {
    const prismaResult = await this.prisma.resultados_Costos_Omitidos.findUnique({
      where: { costo_omitido_id: id },
    });
    if (!prismaResult) {
      throw new NotFoundException(`Omitted cost result with ID ${id} not found.`);
    }
    return this.mapper.toDomain(prismaResult);
  }

  async findByAnalysisId(analysisId: number): Promise<OmittedCostResult[]> {
    const prismaResults = await this.prisma.resultados_Costos_Omitidos.findMany({
      where: { analisis_id: analysisId },
    });
    return prismaResults.map(this.mapper.toDomain);
  }

  async update(id: number, updateDto: UpdateOmittedCostResultDto): Promise<OmittedCostResult> {
    await this.findById(id); // Verifica si el registro existe
    const updatedResult = await this.prisma.resultados_Costos_Omitidos.update({
      where: { costo_omitido_id: id },
      data: {
        costo_omitido: updateDto.omittedCost,
        importancia: updateDto.importance,
      },
    });
    return this.mapper.toDomain(updatedResult);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id); // Verifica si el registro existe
    await this.prisma.resultados_Costos_Omitidos.delete({
      where: { costo_omitido_id: id },
    });
  }
}