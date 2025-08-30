import { IsNotEmpty, IsString, IsEmail, MinLength, MaxLength, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'Nombre completo del usuario', example: 'Juan Pérez' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    nombreCompleto: string;

    @ApiProperty({ description: 'Email del usuario', example: 'juan@ejemplo.com' })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(255)
    email: string;

    @ApiProperty({ description: 'Contraseña del usuario (mínimo 6 caracteres)', example: '123456' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(255)
    password: string;

    @ApiProperty({ description: 'Fecha de nacimiento del usuario', example: '1990-01-01' })
    @IsOptional()
    fechaNacimiento?: Date;
}
