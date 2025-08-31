import { PartialType } from '@nestjs/mapped-types';
import { CreateItemInversionDto } from './create-item-inversion.dto';

export class UpdateItemInversionDto extends PartialType(CreateItemInversionDto) {}
