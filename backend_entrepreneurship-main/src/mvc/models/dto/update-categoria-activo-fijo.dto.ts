import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaActivoFijoDto } from './create-categoria-activo-fijo.dto';

export class UpdateCategoriaActivoFijoDto extends PartialType(CreateCategoriaActivoFijoDto) {}
