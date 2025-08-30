import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


export class CreateBusinessDto {

    @ApiProperty({ description: 'ID del usuario dueño del negocio', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    usuarioId: number;
   

    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: 'ID del sector del negocio', example: 1 })
    sectorId?: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    @ApiProperty({ description: 'Nombre del negocio', example: 'Cafecito' })
    nombreNegocio: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Ubicación exacta del negocio', example: 'Quito - Norte' })
    ubicacionExacta: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: 'ID del tamaño del negocio', example: 1 })
    idTamano?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: 'Aforo de personas', example: 50 })
    aforoPersonas?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: 'Inversión inicial', example: 25000 })
    inversionInicial?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: 'Capital propio', example: 15000 })
    capitalPropio?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: 'Capital prestado', example: 10000 })
    capitalPrestamo?: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: 'Tasa de interés', example: 8.5 })
    tasaInteres?: number;
}
