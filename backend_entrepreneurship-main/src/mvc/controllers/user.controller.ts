import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { LoginUserDto } from '../models/dto/login-user.dto';
import { ResetPasswordDto } from '../models/dto/reset-password.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('usuarios')
@Controller('usuarios')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('registro')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: CreateUserDto, description: 'Datos para el registro de un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'El usuario ha sido registrado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 409, description: 'El email ya está registrado.' })
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.userService.register(createUserDto);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al registrar usuario:', error);
      if (error.message === 'El email ya está registrado') {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Error al registrar el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiBody({ type: LoginUserDto, description: 'Credenciales de acceso' })
  @ApiResponse({ status: 200, description: 'Login exitoso.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const result = await this.userService.login(loginUserDto);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error en login:', error);
      if (error.message === 'Credenciales inválidas') {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(
        'Error al iniciar sesión',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por su ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      console.error(`💥 [BACKEND] Error al buscar usuario con ID ${id}:`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida con éxito.' })
  async findAll() {
    try {
      const result = await this.userService.findAll();
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al obtener usuarios:', error);
      throw new HttpException(
        'Error al obtener la lista de usuarios',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restablecer contraseña de usuario' })
  @ApiBody({ type: ResetPasswordDto, description: 'Datos para restablecer la contraseña' })
  @ApiResponse({ status: 200, description: 'Contraseña restablecida exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos o contraseñas no coinciden.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      const result = await this.userService.resetPassword(resetPasswordDto);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al restablecer contraseña:', error);
      if (error.message === 'Usuario no encontrado con ese email') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error.message === 'Las contraseñas no coinciden') {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Error al restablecer la contraseña',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
