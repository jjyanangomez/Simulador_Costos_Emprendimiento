// src/simulator/bussiness/domain/mappers/business.mapper.ts
import { Injectable } from '@nestjs/common';
import { Aprendizaje as AprendizajePrismaModel } from '@prisma/client';
import {  Learning } from '../entities/learning.entity';

@Injectable()
export class LearningMapper {
   // Convierte desde el modelo de Prisma al modelo de Dominio
  toDomain(prismaAprendizaje: AprendizajePrismaModel): Learning {
    return new Learning(
      prismaAprendizaje.nombre,
      prismaAprendizaje.total_niveles ?? 0);
  }

}