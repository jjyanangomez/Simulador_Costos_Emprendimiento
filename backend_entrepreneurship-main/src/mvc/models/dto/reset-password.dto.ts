import { IsNotEmpty, IsString, IsEmail, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty({ description: 'Email del usuario', example: 'juan@ejemplo.com' })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(255)
    email: string;

    @ApiProperty({ description: 'Nueva contraseña (mínimo 6 caracteres)', example: 'nueva123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(255)
    newPassword: string;

    @ApiProperty({ description: 'Confirmación de la nueva contraseña', example: 'nueva123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(255)
    confirmPassword: string;
}
