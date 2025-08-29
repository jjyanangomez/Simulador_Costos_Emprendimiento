import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Delete,
  HttpCode,
  Put,
} from '@nestjs/common';
import { BusinessService } from '../services/business.service';
import { CreateBusinessDto } from '../models/dto/create-business.dto';
import { UpdateBusinessDto } from '../models/dto/update-business.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('negocios')
@Controller('negocios')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo negocio' })
  @ApiBody({ type: CreateBusinessDto, description: 'Datos para la creación de un nuevo negocio' })
  @ApiResponse({ status: 201, description: 'El negocio ha sido creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async create(@Body() createBusinessDto: CreateBusinessDto) {
    try {
      const result = await this.businessService.createBuisness(createBusinessDto);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al crear negocio:', error);
      console.error('💥 [BACKEND] Stack trace completo:', error.stack);
      console.error('💥 [BACKEND] Tipo de error:', typeof error);
      console.error('💥 [BACKEND] Propiedades del error:', Object.keys(error));
      
      // Mejorar el manejo de errores específicos
      if (error.code === 'P2002') {
        throw new HttpException(
          'Ya existe un negocio con estos datos',
          HttpStatus.CONFLICT,
        );
      } else if (error.code === 'P2003') {
        throw new HttpException(
          'Error de referencia: Verifica que el usuario y el tamaño de negocio existan',
          HttpStatus.BAD_REQUEST,
        );
      } else if (error.code === 'P2025') {
        throw new HttpException(
          'No se encontró el registro requerido',
          HttpStatus.NOT_FOUND,
        );
      }
      
      throw new HttpException(
        `Error al crear el negocio: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener una lista de todos los negocios' })
  @ApiResponse({ status: 200, description: 'Lista de negocios obtenida con éxito.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findAll() {
    try {
      const result = await this.businessService.findAllBuisness();
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al obtener negocios:', error);
      throw new HttpException(
        'Error al obtener la lista de negocios',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un negocio por su ID' })
  @ApiParam({ name: 'id', description: 'El ID del negocio a buscar', type: Number })
  @ApiResponse({ status: 200, description: 'Negocio encontrado.' })
  @ApiResponse({ status: 404, description: 'Negocio no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const business = await this.businessService.findById(id);
      if (!business) {
        throw new HttpException('Negocio no encontrado', HttpStatus.NOT_FOUND);
      }
      return business;
    } catch (error) {
      console.error(`💥 [BACKEND] Error al buscar negocio con ID ${id}:`, error);
      console.log(`Fallo al buscar el negocio con id ${id}`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener el negocio',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener todos los negocios de un usuario específico' })
  @ApiParam({ name: 'usuarioId', description: 'ID del usuario propietario de los negocios', example: 5 })
  @ApiResponse({ status: 200, description: 'Lista de negocios del usuario.' })
  async findByUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    try {
      const result = await this.businessService.findBuisnessByIdUser(usuarioId);
      return result;
    } catch (error) {
      console.error(`💥 [BACKEND] Error al buscar negocios del usuario ${usuarioId}:`, error);
      throw error;
    }
  }

  @Get('debug/usuarios')
  @ApiOperation({ summary: 'Obtener todos los usuarios para debugging' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.' })
  async getUsuarios() {
    try {
      const usuarios = await this.businessService.getUsuarios();
      return usuarios;
    } catch (error) {
      console.error('💥 [BACKEND] Error al obtener usuarios:', error);
      throw error;
    }
  }



  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un negocio existente' })
  @ApiParam({ name: 'id', description: 'El ID del negocio a actualizar', type: Number })
  @ApiBody({ type: UpdateBusinessDto, description: 'Datos para actualizar el negocio' })
  @ApiResponse({ status: 200, description: 'El negocio ha sido actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Negocio no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    try {
      return await this.businessService.updateBuisness(id, updateBusinessDto);
    } catch (error) {
      if (error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error al actualizar el negocio', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un negocio por su ID' })
  @ApiParam({ name: 'id', description: 'El ID del negocio a eliminar', type: Number })
  @ApiResponse({ status: 204, description: 'El negocio ha sido eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Negocio no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.businessService.deleteBuisness(id);
    } catch (error) {
      if (error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error al eliminar el negocio', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

