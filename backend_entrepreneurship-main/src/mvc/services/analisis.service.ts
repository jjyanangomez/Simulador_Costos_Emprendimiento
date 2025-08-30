import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { AnalisisRentabilidadDto } from '../models/dto/analisis-rentabilidad.dto';
import { AnalisisPrecioVentaDto } from '../models/dto/analisis-precio-venta.dto';

// Interfaces para definir tipos de datos
interface ValidacionCosto {
  tipo: 'warning' | 'error' | 'info';
  mensaje: string;
  severidad: 'baja' | 'media' | 'alta';
}

interface Riesgo {
  riesgo: string;
  causaDirecta: string;
  impactoPotencial: string;
}

interface Accion {
  titulo: string;
  descripcion: string;
  prioridad: 'baja' | 'media' | 'alta';
}

interface Recomendacion {
  categoria: string;
  prioridad: 'baja' | 'media' | 'alta';
  titulo: string;
  descripcion: string;
  acciones: string[];
}

interface CostosAnalizados {
  [key: string]: any;
  costosFijos: any[];
  costosVariables: any[];
  totales: {
    costosFijosMensuales: number;
    costosVariablesTotales: number;
    ingresosTotales: number;
  };
}

interface ResumenAnalisis {
  [key: string]: any;
  utilidadBruta: number;
  utilidadNeta: number;
  margenContribucion: number;
  puntoEquilibrioUnidades: number;
  puntoEquilibrioVentas: number;
  margenSeguridad: number;
  roi: number;
}

@Injectable()
export class AnalisisService {
  constructor(private readonly prisma: PrismaService) {}

  async analizarRentabilidad(analisisDto: AnalisisRentabilidadDto) {
    try {
      // Verificar que el negocio existe
      const negocio = await this.prisma.negocios.findUnique({
        where: { negocio_id: analisisDto.negocioId },
        include: {
          Sectores: {
            select: {
              nombre_sector: true,
            },
          },
        },
      });

      if (!negocio) {
        throw new NotFoundException('El negocio no existe');
      }

      // Calcular costos fijos totales mensuales
      const costosFijosMensuales = analisisDto.costosFijos.reduce((total, costo) => {
        return total + costo.montoMensual;
      }, 0);

      // Calcular costos variables totales
      const costosVariablesTotales = analisisDto.productos.reduce((total, producto) => {
        return total + (producto.costoVariable * producto.volumenVentas);
      }, 0);

      // Calcular ingresos totales
      const ingresosTotales = analisisDto.productos.reduce((total, producto) => {
        return total + (producto.precioVenta * producto.volumenVentas);
      }, 0);

      // Calcular utilidad bruta
      const utilidadBruta = ingresosTotales - costosVariablesTotales;

      // Calcular margen de contribución
      const margenContribucion = ingresosTotales > 0 ? (utilidadBruta / ingresosTotales) * 100 : 0;

      // Calcular punto de equilibrio
      const puntoEquilibrioUnidades = costosFijosMensuales > 0 ? 
        costosFijosMensuales / (analisisDto.productos[0]?.precioVenta - analisisDto.productos[0]?.costoVariable) : 0;

      const puntoEquilibrioVentas = puntoEquilibrioUnidades * (analisisDto.productos[0]?.precioVenta || 0);

      // Calcular margen de seguridad
      const volumenTotal = analisisDto.productos.reduce((total, producto) => total + producto.volumenVentas, 0);
      const margenSeguridad = volumenTotal > 0 ? ((volumenTotal - puntoEquilibrioUnidades) / volumenTotal) * 100 : 0;

      // Calcular utilidad neta
      const utilidadNeta = utilidadBruta - costosFijosMensuales;

      // Calcular ROI
      const inversionInicial = analisisDto.inversionInicial || 0;
      const roi = inversionInicial > 0 ? (utilidadNeta * 12 / inversionInicial) * 100 : 0;

      // Crear análisis en la base de datos
      const analisisIA = await this.prisma.analisis_IA.create({
        data: {
          negocio_id: analisisDto.negocioId,
          fecha_analisis: new Date(),
        },
      });

      // Preparar datos para el campo JSON
      const costosAnalizados: CostosAnalizados = {
        costosFijos: analisisDto.costosFijos,
        costosVariables: analisisDto.productos,
        totales: {
          costosFijosMensuales,
          costosVariablesTotales,
          ingresosTotales,
        },
      };

      const resumenAnalisis: ResumenAnalisis = {
        utilidadBruta,
        utilidadNeta,
        margenContribucion,
        puntoEquilibrioUnidades,
        puntoEquilibrioVentas,
        margenSeguridad,
        roi,
      };

      // Guardar resultados del análisis completo
      const resultadoAnalisis = await this.prisma.resultados_Analisis_Completo.create({
        data: {
          negocio_id: analisisDto.negocioId,
          modulo_id: analisisDto.moduloId,
          analisis_id: analisisIA.analisis_id,
          fecha_analisis: new Date(),
          costos_analizados: costosAnalizados,
          riesgos_detectados: this.analizarRiesgos(analisisDto, utilidadNeta, margenSeguridad) as any,
          plan_accion: this.generarPlanAccion(analisisDto, utilidadNeta, margenSeguridad, roi) as any,
          resumen_analisis: resumenAnalisis,
          estado_guardado: 'completado',
        },
      });

      return {
        message: 'Análisis de rentabilidad completado exitosamente',
        data: {
          analisisId: analisisIA.analisis_id,
          resultadoId: resultadoAnalisis.resultado_id,
          resumen: {
            utilidadBruta: Math.round(utilidadBruta * 100) / 100,
            utilidadNeta: Math.round(utilidadNeta * 100) / 100,
            margenContribucion: Math.round(margenContribucion * 100) / 100,
            puntoEquilibrioUnidades: Math.round(puntoEquilibrioUnidades * 100) / 100,
            puntoEquilibrioVentas: Math.round(puntoEquilibrioVentas * 100) / 100,
            margenSeguridad: Math.round(margenSeguridad * 100) / 100,
            roi: Math.round(roi * 100) / 100,
          },
          recomendaciones: this.generarRecomendaciones(utilidadNeta, margenSeguridad, roi),
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al analizar la rentabilidad: ${error.message}`);
    }
  }

  async analizarPrecioVenta(precioDto: AnalisisPrecioVentaDto) {
    try {
      // Verificar que el negocio existe
      const negocio = await this.prisma.negocios.findUnique({
        where: { negocio_id: precioDto.negocioId },
        include: {
          Sectores: {
            select: {
              nombre_sector: true,
            },
          },
        },
      });

      if (!negocio) {
        throw new NotFoundException('El negocio no existe');
      }

      // Analizar cada producto
      const analisisProductos = precioDto.productos.map(producto => {
        const margenBeneficio = ((producto.precioVenta - producto.costoTotal) / producto.precioVenta) * 100;
        const rentabilidadEstimada = (producto.precioVenta - producto.costoTotal) * producto.volumenVentas;
        
        return {
          productoId: producto.id,
          nombre: producto.nombre,
          margenBeneficio: Math.round(margenBeneficio * 100) / 100,
          rentabilidadEstimada: Math.round(rentabilidadEstimada * 100) / 100,
          precioCompetitivo: this.calcularPrecioCompetitivo(producto, margenBeneficio),
          recomendaciones: this.generarRecomendacionesPrecio(producto, margenBeneficio),
        };
      });

      // Calcular promedios del sector
      const precioPromedioMercado = analisisProductos.reduce((total, producto) => 
        total + producto.precioCompetitivo, 0) / analisisProductos.length;

      // Crear análisis en la base de datos
      const analisisIA = await this.prisma.analisis_IA.create({
        data: {
          negocio_id: precioDto.negocioId,
          fecha_analisis: new Date(),
        },
      });

      // Guardar resultados del análisis de precios
      const resultadoPrecio = await this.prisma.resultados_Precio_Venta.create({
        data: {
          negocio_id: precioDto.negocioId,
          modulo_id: precioDto.moduloId,
          sector_id: precioDto.sectorId,
          analisis_id: analisisIA.analisis_id,
          fecha_analisis: new Date(),
          costos_fijos_totales: 0, // Se calculará si es necesario
          costos_variables_totales: precioDto.productos.reduce((total, p) => total + p.costoTotal, 0),
          margen_contribucion: precioDto.margenObjetivo || 30,
          precio_venta_sugerido: precioPromedioMercado,
          precio_venta_competitivo: precioPromedioMercado,
          rentabilidad_estimada: analisisProductos.reduce((total, p) => total + p.rentabilidadEstimada, 0),
          precio_promedio_mercado: precioPromedioMercado,
          posicionamiento_precio: this.determinarPosicionamientoPrecio(precioDto.productos, precioPromedioMercado),
          recomendaciones_precio: analisisProductos.map(p => p.recomendaciones),
        },
      });

      return {
        message: 'Análisis de precios completado exitosamente',
        data: {
          analisisId: analisisIA.analisis_id,
          resultadoId: resultadoPrecio.resultado_id,
          productos: analisisProductos,
          resumen: {
            precioPromedioMercado: Math.round(precioPromedioMercado * 100) / 100,
            posicionamientoPrecio: this.determinarPosicionamientoPrecio(precioDto.productos, precioPromedioMercado),
            rentabilidadTotal: Math.round(analisisProductos.reduce((total, p) => total + p.rentabilidadEstimada, 0) * 100) / 100,
          },
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al analizar los precios: ${error.message}`);
    }
  }

  async calcularPuntoEquilibrio(analisisDto: AnalisisRentabilidadDto) {
    try {
      // Calcular costos fijos totales mensuales
      const costosFijosMensuales = analisisDto.costosFijos.reduce((total, costo) => {
        return total + costo.montoMensual;
      }, 0);

      // Calcular costo variable unitario promedio
      const costoVariableUnitario = analisisDto.productos.reduce((total, producto) => {
        return total + producto.costoVariable;
      }, 0) / analisisDto.productos.length;

      // Calcular precio de venta unitario promedio
      const precioVentaUnitario = analisisDto.productos.reduce((total, producto) => {
        return total + producto.precioVenta;
      }, 0) / analisisDto.productos.length;

      // Calcular punto de equilibrio
      const puntoEquilibrioUnidades = costosFijosMensuales / (precioVentaUnitario - costoVariableUnitario);
      const puntoEquilibrioVentas = puntoEquilibrioUnidades * precioVentaUnitario;

      // Calcular margen de seguridad
      const volumenTotal = analisisDto.productos.reduce((total, producto) => total + producto.volumenVentas, 0);
      const margenSeguridad = ((volumenTotal - puntoEquilibrioUnidades) / volumenTotal) * 100;

      // Crear análisis en la base de datos
      const analisisIA = await this.prisma.analisis_IA.create({
        data: {
          negocio_id: analisisDto.negocioId,
          fecha_analisis: new Date(),
        },
      });

      // Guardar resultados del punto de equilibrio
      const resultadoEquilibrio = await this.prisma.resultados_Punto_Equilibrio.create({
        data: {
          negocio_id: analisisDto.negocioId,
          modulo_id: analisisDto.moduloId,
          sector_id: 1, // Default sector
          analisis_id: analisisIA.analisis_id,
          fecha_analisis: new Date(),
          costos_fijos_totales: costosFijosMensuales,
          costos_variables_totales: costoVariableUnitario * volumenTotal,
          precio_venta_unitario: precioVentaUnitario,
          costo_variable_unitario: costoVariableUnitario,
          punto_equilibrio_unidades: puntoEquilibrioUnidades,
          punto_equilibrio_ventas: puntoEquilibrioVentas,
          margen_seguridad: margenSeguridad,
          escenario_optimista: this.generarEscenarioOptimista(analisisDto, puntoEquilibrioUnidades),
          escenario_pesimista: this.generarEscenarioPesimista(analisisDto, puntoEquilibrioUnidades),
          recomendaciones_equilibrio: this.generarRecomendacionesEquilibrio(puntoEquilibrioUnidades, volumenTotal, margenSeguridad),
        },
      });

      return {
        message: 'Punto de equilibrio calculado exitosamente',
        data: {
          analisisId: analisisIA.analisis_id,
          resultadoId: resultadoEquilibrio.resultado_id,
          puntoEquilibrio: {
            unidades: Math.round(puntoEquilibrioUnidades * 100) / 100,
            ventas: Math.round(puntoEquilibrioVentas * 100) / 100,
            margenSeguridad: Math.round(margenSeguridad * 100) / 100,
          },
          escenarios: {
            optimista: this.generarEscenarioOptimista(analisisDto, puntoEquilibrioUnidades),
            pesimista: this.generarEscenarioPesimista(analisisDto, puntoEquilibrioUnidades),
          },
          recomendaciones: this.generarRecomendacionesEquilibrio(puntoEquilibrioUnidades, volumenTotal, margenSeguridad),
        },
      };
    } catch (error) {
      throw new BadRequestException(`Error al calcular el punto de equilibrio: ${error.message}`);
    }
  }

  async obtenerResultados(negocioId: number, tipo?: string) {
    try {
      let resultados: any = {};

      if (!tipo || tipo === 'rentabilidad') {
        const analisisCompleto = await this.prisma.resultados_Analisis_Completo.findMany({
          where: { negocio_id: negocioId },
          orderBy: { fecha_analisis: 'desc' },
          take: 1,
        });
        if (analisisCompleto.length > 0) {
          resultados.rentabilidad = analisisCompleto[0];
        }
      }

      if (!tipo || tipo === 'precio-venta') {
        const analisisPrecios = await this.prisma.resultados_Precio_Venta.findMany({
          where: { negocio_id: negocioId },
          orderBy: { fecha_analisis: 'desc' },
          take: 1,
        });
        if (analisisPrecios.length > 0) {
          resultados.precioVenta = analisisPrecios[0];
        }
      }

      if (!tipo || tipo === 'punto-equilibrio') {
        const puntoEquilibrio = await this.prisma.resultados_Punto_Equilibrio.findMany({
          where: { negocio_id: negocioId },
          orderBy: { fecha_analisis: 'desc' },
          take: 1,
        });
        if (puntoEquilibrio.length > 0) {
          resultados.puntoEquilibrio = puntoEquilibrio[0];
        }
      }

      return {
        message: 'Resultados obtenidos exitosamente',
        data: resultados,
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener los resultados: ${error.message}`);
    }
  }

  async validarCostosConIA(negocioId: number) {
    try {
      // Obtener costos del negocio
      const costosFijos = await this.prisma.costosFijos.findMany({
        where: { negocio_id: negocioId, activo: true },
        include: { TiposCosto: true },
      });

      const productos = await this.prisma.productos.findMany({
        where: { negocio_id: negocioId },
        include: { Recetas: true },
      });

      // Validar costos fijos
      const validacionesCostosFijos = costosFijos.map(costo => {
        const validaciones: ValidacionCosto[] = [];
        const montoMensual = this.convertirAMensual(costo.monto, costo.frecuencia);
        
        // Validaciones básicas según el tipo de costo
        if (costo.TiposCosto.nombre === 'arriendo' && montoMensual < 500) {
          validaciones.push({
            tipo: 'warning',
            mensaje: 'El arriendo parece estar por debajo del mercado',
            severidad: 'baja',
          });
        }

        if (costo.TiposCosto.nombre === 'personal' && montoMensual < 425) {
          validaciones.push({
            tipo: 'error',
            mensaje: 'El salario está por debajo del salario básico unificado',
            severidad: 'alta',
          });
        }

        return {
          costoId: costo.costo_fijo_id,
          nombre: costo.nombre,
          validaciones,
        };
      });

      // Validar productos
      const validacionesProductos = productos.map(producto => {
        const validaciones: ValidacionCosto[] = [];
        const margenBeneficio = ((Number(producto.precio_por_unidad) - Number(producto.costo_por_unidad)) / Number(producto.precio_por_unidad)) * 100;
        
        if (margenBeneficio < 20) {
          validaciones.push({
            tipo: 'warning',
            mensaje: 'El margen de beneficio es muy bajo',
            severidad: 'media',
          });
        }

        if (margenBeneficio > 80) {
          validaciones.push({
            tipo: 'info',
            mensaje: 'El margen de beneficio es muy alto, considera revisar precios',
            severidad: 'baja',
          });
        }

        return {
          productoId: producto.producto_id,
          nombre: producto.nombre_producto,
          validaciones,
        };
      });

      return {
        message: 'Validación de costos completada',
        data: {
          costosFijos: validacionesCostosFijos,
          productos: validacionesProductos,
          resumen: {
            totalValidaciones: validacionesCostosFijos.length + validacionesProductos.length,
            advertencias: validacionesCostosFijos.filter(c => c.validaciones.some(v => v.tipo === 'warning')).length +
                         validacionesProductos.filter(p => p.validaciones.some(v => v.tipo === 'warning')).length,
            errores: validacionesCostosFijos.filter(c => c.validaciones.some(v => v.tipo === 'error')).length +
                    validacionesProductos.filter(p => p.validaciones.some(v => v.tipo === 'error')).length,
          },
        },
      };
    } catch (error) {
      throw new BadRequestException(`Error al validar los costos: ${error.message}`);
    }
  }

  async obtenerRecomendacionesIA(negocioId: number) {
    try {
      // Obtener análisis recientes
      const analisisRecientes = await this.prisma.resultados_Analisis_Completo.findMany({
        where: { negocio_id: negocioId },
        orderBy: { fecha_analisis: 'desc' },
        take: 1,
      });

      if (analisisRecientes.length === 0) {
        return {
          message: 'No hay análisis recientes para generar recomendaciones',
          data: [],
        };
      }

      const analisis = analisisRecientes[0];
      const resumen = analisis.resumen_analisis as any;

      const recomendaciones: Recomendacion[] = [];

      // Recomendaciones basadas en la utilidad
      if (resumen.utilidadNeta < 0) {
        recomendaciones.push({
          categoria: 'Rentabilidad',
          prioridad: 'alta',
          titulo: 'Negocio no rentable',
          descripcion: 'El negocio está generando pérdidas. Revisa costos y precios.',
          acciones: [
            'Revisar y reducir costos fijos',
            'Aumentar precios de venta',
            'Optimizar costos variables',
            'Evaluar la viabilidad del negocio',
          ],
        });
      }

      // Recomendaciones basadas en el margen de seguridad
      if (resumen.margenSeguridad < 20) {
        recomendaciones.push({
          categoria: 'Riesgo',
          prioridad: 'media',
          titulo: 'Margen de seguridad bajo',
          descripcion: 'El negocio está cerca del punto de equilibrio.',
          acciones: [
            'Aumentar ventas',
            'Diversificar productos',
            'Mejorar marketing',
            'Reducir costos fijos',
          ],
        });
      }

      // Recomendaciones basadas en el ROI
      if (resumen.roi < 15) {
        recomendaciones.push({
          categoria: 'Inversión',
          prioridad: 'media',
          titulo: 'ROI bajo',
          descripcion: 'El retorno sobre la inversión es menor al esperado.',
          acciones: [
            'Optimizar operaciones',
            'Aumentar eficiencia',
            'Revisar estructura de costos',
            'Evaluar nuevas oportunidades',
          ],
        });
      }

      return {
        message: 'Recomendaciones generadas exitosamente',
        data: recomendaciones,
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener recomendaciones: ${error.message}`);
    }
  }

  async simularEscenarios(analisisDto: AnalisisRentabilidadDto) {
    try {
      const escenarios = {
        optimista: this.generarEscenarioOptimista(analisisDto, 0),
        pesimista: this.generarEscenarioPesimista(analisisDto, 0),
        realista: this.generarEscenarioRealista(analisisDto),
      };

      return {
        message: 'Simulación de escenarios completada',
        data: escenarios,
      };
    } catch (error) {
      throw new BadRequestException(`Error al simular escenarios: ${error.message}`);
    }
  }

  // Métodos auxiliares privados
  private analizarRiesgos(analisisDto: AnalisisRentabilidadDto, utilidadNeta: number, margenSeguridad: number): Riesgo[] {
    const riesgos: Riesgo[] = [];

    if (utilidadNeta < 0) {
      riesgos.push({
        riesgo: 'Negocio no rentable',
        causaDirecta: 'Costos superan ingresos',
        impactoPotencial: 'Pérdidas continuas y posible cierre',
      });
    }

    if (margenSeguridad < 20) {
      riesgos.push({
        riesgo: 'Bajo margen de seguridad',
        causaDirecta: 'Ventas cercanas al punto de equilibrio',
        impactoPotencial: 'Vulnerabilidad a caídas en ventas',
      });
    }

    return riesgos;
  }

  private generarPlanAccion(analisisDto: AnalisisRentabilidadDto, utilidadNeta: number, margenSeguridad: number, roi: number): Accion[] {
    const acciones: Accion[] = [];

    if (utilidadNeta < 0) {
      acciones.push({
        titulo: 'Reducir costos fijos',
        descripcion: 'Identificar y eliminar costos innecesarios',
        prioridad: 'alta',
      });
    }

    if (margenSeguridad < 20) {
      acciones.push({
        titulo: 'Aumentar ventas',
        descripcion: 'Implementar estrategias de marketing y ventas',
        prioridad: 'media',
      });
    }

    return acciones;
  }

  private generarRecomendaciones(utilidadNeta: number, margenSeguridad: number, roi: number): string[] {
    const recomendaciones: string[] = [];

    if (utilidadNeta < 0) {
      recomendaciones.push('Revisar estructura de costos');
      recomendaciones.push('Evaluar precios de venta');
      recomendaciones.push('Optimizar operaciones');
    }

    if (margenSeguridad < 20) {
      recomendaciones.push('Diversificar productos');
      recomendaciones.push('Mejorar estrategia de ventas');
      recomendaciones.push('Reducir costos fijos');
    }

    return recomendaciones;
  }

  private calcularPrecioCompetitivo(producto: any, margenBeneficio: number) {
    const margenObjetivo = 30; // 30% de margen objetivo
    const factorPrecio = 1 + (margenObjetivo / 100);
    return producto.costoTotal * factorPrecio;
  }

  private generarRecomendacionesPrecio(producto: any, margenBeneficio: number): string[] {
    const recomendaciones: string[] = [];

    if (margenBeneficio < 20) {
      recomendaciones.push('Considerar aumentar el precio de venta');
      recomendaciones.push('Revisar costos del producto');
      recomendaciones.push('Evaluar la competitividad del precio');
    } else if (margenBeneficio > 60) {
      recomendaciones.push('El precio puede ser muy alto para el mercado');
      recomendaciones.push('Evaluar la elasticidad de la demanda');
    }

    return recomendaciones;
  }

  private determinarPosicionamientoPrecio(productos: any[], precioPromedio: number) {
    const precioPromedioNegocio = productos.reduce((total, p) => total + p.precioVenta, 0) / productos.length;
    
    if (precioPromedioNegocio < precioPromedio * 0.8) return 'bajo';
    if (precioPromedioNegocio > precioPromedio * 1.2) return 'alto';
    return 'medio';
  }

  private generarEscenarioOptimista(analisisDto: AnalisisRentabilidadDto, puntoEquilibrio: number) {
    const factorOptimista = 1.3; // 30% mejor que el escenario base
    return {
      volumenVentas: analisisDto.productos.reduce((total, p) => total + p.volumenVentas, 0) * factorOptimista,
      utilidadEsperada: 'Aumento del 30% en ventas',
      probabilidad: '25%',
    };
  }

  private generarEscenarioPesimista(analisisDto: AnalisisRentabilidadDto, puntoEquilibrio: number) {
    const factorPesimista = 0.7; // 30% peor que el escenario base
    return {
      volumenVentas: analisisDto.productos.reduce((total, p) => total + p.volumenVentas, 0) * factorPesimista,
      utilidadEsperada: 'Reducción del 30% en ventas',
      probabilidad: '25%',
    };
  }

  private generarEscenarioRealista(analisisDto: AnalisisRentabilidadDto) {
    return {
      volumenVentas: analisisDto.productos.reduce((total, p) => total + p.volumenVentas, 0),
      utilidadEsperada: 'Mantenimiento de ventas actuales',
      probabilidad: '50%',
    };
  }

  private generarRecomendacionesEquilibrio(puntoEquilibrio: number, volumenActual: number, margenSeguridad: number): string[] {
    const recomendaciones: string[] = [];

    if (margenSeguridad < 20) {
      recomendaciones.push('Implementar estrategias para aumentar ventas');
      recomendaciones.push('Reducir costos fijos si es posible');
      recomendaciones.push('Diversificar la oferta de productos');
    }

    if (volumenActual < puntoEquilibrio * 1.2) {
      recomendaciones.push('Focalizar esfuerzos en marketing y ventas');
      recomendaciones.push('Evaluar precios y competitividad');
      recomendaciones.push('Considerar promociones temporales');
    }

    return recomendaciones;
  }

  private convertirAMensual(monto: any, frecuencia: string): number {
    const montoNum = Number(monto);
    
    switch (frecuencia) {
      case 'mensual':
        return montoNum;
      case 'semestral':
        return montoNum / 6;
      case 'anual':
        return montoNum / 12;
      default:
        return montoNum;
    }
  }
}
