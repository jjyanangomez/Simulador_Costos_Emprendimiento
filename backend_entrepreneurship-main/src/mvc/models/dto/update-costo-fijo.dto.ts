import { PartialType } from '@nestjs/swagger';
import { CreateCostoFijoDto } from './create-costo-fijo.dto';

export class UpdateCostoFijoDto extends PartialType(CreateCostoFijoDto) {}
