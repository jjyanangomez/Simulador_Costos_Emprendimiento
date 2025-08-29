import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBusinessDto {
    @IsString()
    @MaxLength(100)
    @IsOptional()
    @ApiProperty({ description: 'Tipo o rubro del negocio', example: 'Cafetería' })
    tipoNegocio?: string;

    @IsString()
    @MaxLength(200)
    @IsOptional()
    @ApiProperty({ description: 'Nombre del negocio', example: 'Cafecito' })
    nombreNegocio?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'Ubicacion o dirección del negocio', example: 'Quito - Norte' })
    ubicacion?: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: 'ID del tamaño del negocio', example: 1 })
    idTamano?: number;
}
