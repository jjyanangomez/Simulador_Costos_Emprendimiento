import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoriaActivoFijoService } from '../services/categoria-activo-fijo.service';
import { CreateCategoriaActivoFijoDto } from '../models/dto/create-categoria-activo-fijo.dto';
import { UpdateCategoriaActivoFijoDto } from '../models/dto/update-categoria-activo-fijo.dto';

@Controller('categorias-activo-fijo')
export class CategoriaActivoFijoController {
  constructor(private readonly categoriaActivoFijoService: CategoriaActivoFijoService) {}

  /**
   * Crear una nueva categoría de activo fijo
   * POST /categorias-activo-fijo
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCategoriaDto: CreateCategoriaActivoFijoDto) {
    return this.categoriaActivoFijoService.create(createCategoriaDto);
  }

  /**
   * Obtener todas las categorías de activo fijo
   * GET /categorias-activo-fijo
   */
  @Get()
  findAll() {
    return this.categoriaActivoFijoService.findAll();
  }

  /**
   * Obtener solo las categorías activas
   * GET /categorias-activo-fijo/activas
   */
  @Get('activas')
  findActive() {
    return this.categoriaActivoFijoService.findActive();
  }

  /**
   * Obtener categorías con sus costos fijos asociados
   * GET /categorias-activo-fijo/with-costos
   */
  @Get('with-costos')
  findWithCostosFijos() {
    return this.categoriaActivoFijoService.findWithCostosFijos();
  }

  /**
   * Obtener estadísticas de las categorías
   * GET /categorias-activo-fijo/stats
   */
  @Get('stats')
  getStats() {
    return this.categoriaActivoFijoService.getStats();
  }

  /**
   * Buscar categorías por término de búsqueda
   * GET /categorias-activo-fijo/search?q=termino
   */
  @Get('search')
  search(@Query('q') searchTerm: string) {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return this.categoriaActivoFijoService.findAll();
    }
    return this.categoriaActivoFijoService.search(searchTerm.trim());
  }

  /**
   * Obtener una categoría por ID
   * GET /categorias-activo-fijo/:id
   */
  @Get(':id')
  findById(@Param('id') id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error('ID debe ser un número válido');
    }
    return this.categoriaActivoFijoService.findById(numericId);
  }

  /**
   * Obtener una categoría por nombre
   * GET /categorias-activo-fijo/nombre/:nombre
   */
  @Get('nombre/:nombre')
  findByName(@Param('nombre') nombre: string) {
    return this.categoriaActivoFijoService.findByName(nombre);
  }

  /**
   * Actualizar una categoría
   * PATCH /categorias-activo-fijo/:id
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaActivoFijoDto,
  ) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error('ID debe ser un número válido');
    }
    return this.categoriaActivoFijoService.update(numericId, updateCategoriaDto);
  }

  /**
   * Cambiar el estado activo/inactivo de una categoría
   * PATCH /categorias-activo-fijo/:id/toggle-status
   */
  @Patch(':id/toggle-status')
  toggleStatus(@Param('id') id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error('ID debe ser un número válido');
    }
    return this.categoriaActivoFijoService.toggleStatus(numericId);
  }

  /**
   * Eliminar una categoría
   * DELETE /categorias-activo-fijo/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error('ID debe ser un número válido');
    }
    return this.categoriaActivoFijoService.remove(numericId);
  }

  /**
   * Obtener categorías por negocio específico
   * GET /categorias-activo-fijo/negocio/:negocioId
   */
  @Get('negocio/:negocioId')
  findByNegocioId(@Param('negocioId') negocioId: string) {
    const numericNegocioId = parseInt(negocioId, 10);
    if (isNaN(numericNegocioId)) {
      throw new Error('ID de negocio debe ser un número válido');
    }
    return this.categoriaActivoFijoService.findByNegocioId(numericNegocioId);
  }

  /**
   * Obtener resumen de categorías por negocio
   * GET /categorias-activo-fijo/negocio/:negocioId/resumen
   */
  @Get('negocio/:negocioId/resumen')
  getResumenByNegocio(@Param('negocioId') negocioId: string) {
    const numericNegocioId = parseInt(negocioId, 10);
    if (isNaN(numericNegocioId)) {
      throw new Error('ID de negocio debe ser un número válido');
    }
    return this.categoriaActivoFijoService.getResumenByNegocio(numericNegocioId);
  }
}
