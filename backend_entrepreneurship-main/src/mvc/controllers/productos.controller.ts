import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductosService } from '../services/productos.service';
import { CreateProductoDto } from '../models/dto/create-producto.dto';
import { UpdateProductoDto } from '../models/dto/update-producto.dto';
import { CreateRecetaDto } from '../models/dto/create-receta.dto';
import { UpdateRecetaDto } from '../models/dto/update-receta.dto';

@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiBody({ type: CreateProductoDto, description: 'Datos para crear un producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async create(@Body() createProductoDto: CreateProductoDto) {
    try {
      const result = await this.productosService.create(createProductoDto);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al crear producto:', error);
      throw new HttpException(
        `Error al crear el producto: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos de un negocio' })
  @ApiQuery({ name: 'negocioId', description: 'ID del negocio', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de productos obtenida' })
  async findAll(@Query('negocioId', ParseIntPipe) negocioId: number) {
    try {
      const result = await this.productosService.findByNegocioId(negocioId);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al obtener productos:', error);
      throw new HttpException(
        'Error al obtener los productos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: Number })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const producto = await this.productosService.findById(id);
      if (!producto) {
        throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
      }
      return producto;
    } catch (error) {
      console.error(`💥 [BACKEND] Error al buscar producto con ID ${id}:`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener el producto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: Number })
  @ApiBody({ type: UpdateProductoDto, description: 'Datos para actualizar el producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    try {
      const result = await this.productosService.update(id, updateProductoDto);
      return result;
    } catch (error) {
      console.error(`💥 [BACKEND] Error al actualizar producto con ID ${id}:`, error);
      if (error.message === 'Producto no encontrado') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        `Error al actualizar el producto: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: Number })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.productosService.remove(id);
      return result;
    } catch (error) {
      console.error(`💥 [BACKEND] Error al eliminar producto con ID ${id}:`, error);
      if (error.message === 'Producto no encontrado') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        `Error al eliminar el producto: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('categorias/lista')
  @ApiOperation({ summary: 'Obtener lista de categorías de producto' })
  @ApiResponse({ status: 200, description: 'Lista de categorías obtenida' })
  async getCategorias() {
    try {
      const result = await this.productosService.getCategorias();
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al obtener categorías:', error);
      throw new HttpException(
        'Error al obtener las categorías',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('unidades-medida/lista')
  @ApiOperation({ summary: 'Obtener lista de unidades de medida' })
  @ApiResponse({ status: 200, description: 'Lista de unidades de medida obtenida' })
  async getUnidadesMedida() {
    try {
      const result = await this.productosService.getUnidadesMedida();
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al obtener unidades de medida:', error);
      throw new HttpException(
        'Error al obtener las unidades de medida',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

@ApiTags('recetas')
@Controller('recetas')
export class RecetasController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva receta' })
  @ApiBody({ type: CreateRecetaDto, description: 'Datos para crear una receta' })
  @ApiResponse({ status: 201, description: 'Receta creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async create(@Body() createRecetaDto: CreateRecetaDto) {
    try {
      const result = await this.productosService.createReceta(createRecetaDto);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al crear receta:', error);
      throw new HttpException(
        `Error al crear la receta: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las recetas de un producto' })
  @ApiQuery({ name: 'productoId', description: 'ID del producto', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de recetas obtenida' })
  async findAll(@Query('productoId', ParseIntPipe) productoId: number) {
    try {
      const result = await this.productosService.findRecetasByProductoId(productoId);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al obtener recetas:', error);
      throw new HttpException(
        'Error al obtener las recetas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('all')
  @ApiOperation({ summary: 'Obtener todas las recetas disponibles' })
  @ApiResponse({ status: 200, description: 'Lista de todas las recetas obtenida' })
  async findAllRecetas() {
    try {
      const result = await this.productosService.findAllRecetas();
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al obtener todas las recetas:', error);
      throw new HttpException(
        'Error al obtener todas las recetas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una receta por ID' })
  @ApiParam({ name: 'id', description: 'ID de la receta', type: Number })
  @ApiResponse({ status: 200, description: 'Receta encontrada' })
  @ApiResponse({ status: 404, description: 'Receta no encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const receta = await this.productosService.findRecetaById(id);
      if (!receta) {
        throw new HttpException('Receta no encontrada', HttpStatus.NOT_FOUND);
      }
      return receta;
    } catch (error) {
      console.error(`💥 [BACKEND] Error al buscar receta con ID ${id}:`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener la receta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una receta' })
  @ApiParam({ name: 'id', description: 'ID de la receta', type: Number })
  @ApiBody({ type: UpdateRecetaDto, description: 'Datos para actualizar la receta' })
  @ApiResponse({ status: 200, description: 'Receta actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Receta no encontrada' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecetaDto: UpdateRecetaDto,
  ) {
    try {
      const result = await this.productosService.updateReceta(id, updateRecetaDto);
      return result;
    } catch (error) {
      console.error(`💥 [BACKEND] Error al actualizar receta con ID ${id}:`, error);
      if (error.message === 'Receta no encontrada') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        `Error al actualizar la receta: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una receta' })
  @ApiParam({ name: 'id', description: 'ID de la receta', type: Number })
  @ApiResponse({ status: 200, description: 'Receta eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Receta no encontrada' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.productosService.removeReceta(id);
      return result;
    } catch (error) {
      console.error(`💥 [BACKEND] Error al eliminar receta con ID ${id}:`, error);
      if (error.message === 'Receta no encontrada') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        `Error al eliminar la receta: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
