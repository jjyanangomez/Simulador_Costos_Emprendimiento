import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


export class CreateBusinessDto {

    @ApiProperty({ description: 'ID del usuario dueño del negocio', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    usuarioId: number;
   

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
     @ApiProperty({ description: 'Tipo o rubro del negocio', example: 'Cafetería' })
    tipoNegocio: string;


    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    @ApiProperty({ description: 'Nombre del negocio', example: 'Cafecito' })
    nombreNegocio: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Ubicacion o dirección  del negocio', example: 'Quito - Norte' })
    ubicacion: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'ID del tamaño del negocio', example: 1 })
    idTamano: number;
}
