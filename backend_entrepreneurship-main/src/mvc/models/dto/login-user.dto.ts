import { IsNotEmpty, IsString, IsEmail } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({ description: 'Email del usuario', example: 'juan@ejemplo.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'Contraseña del usuario', example: '123456' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
