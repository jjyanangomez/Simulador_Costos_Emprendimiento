-- CreateTable
CREATE TABLE "public"."Usuarios" (
    "usuario_id" SERIAL NOT NULL,
    "nombre_completo" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "fecha_registro" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_nacimiento" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "public"."Sectores" (
    "sector_id" SERIAL NOT NULL,
    "nombre_sector" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Sectores_pkey" PRIMARY KEY ("sector_id")
);

-- CreateTable
CREATE TABLE "public"."TamanosNegocio" (
    "id_tamano" SERIAL NOT NULL,
    "tamano_nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "TamanosNegocio_pkey" PRIMARY KEY ("id_tamano")
);

-- CreateTable
CREATE TABLE "public"."Negocios" (
    "negocio_id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nombre_negocio" VARCHAR(200) NOT NULL,
    "id_tamano" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "aforo_personas" INTEGER NOT NULL,
    "capital_prestamo" DECIMAL(15,2),
    "capital_propio" DECIMAL(15,2),
    "inversion_inicial" DECIMAL(15,2) NOT NULL,
    "sector_id" INTEGER NOT NULL,
    "tasa_interes" DECIMAL(5,2),
    "ubicacion_exacta" TEXT,

    CONSTRAINT "Negocios_pkey" PRIMARY KEY ("negocio_id")
);

-- CreateTable
CREATE TABLE "public"."CategoriasProducto" (
    "categoria_id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "CategoriasProducto_pkey" PRIMARY KEY ("categoria_id")
);

-- CreateTable
CREATE TABLE "public"."UnidadMedida" (
    "unidad_id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "abreviatura" VARCHAR(10) NOT NULL,

    CONSTRAINT "UnidadMedida_pkey" PRIMARY KEY ("unidad_id")
);

-- CreateTable
CREATE TABLE "public"."Productos" (
    "producto_id" SERIAL NOT NULL,
    "negocio_id" INTEGER NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "unidad_medida_id" INTEGER NOT NULL,
    "nombre_producto" VARCHAR(200) NOT NULL,
    "precio_por_unidad" DECIMAL(10,2) NOT NULL,
    "porcion_requerida" DECIMAL(10,2) NOT NULL,
    "porcion_unidad" DECIMAL(10,2),
    "costo_por_unidad" DECIMAL(10,2) NOT NULL,
    "precio_venta_cliente" DECIMAL(10,2),
    "precio_venta_sugerido_ia" DECIMAL(10,2),
    "margen_ganancia_ia" DECIMAL(5,2),
    "margen_ganancia_real" DECIMAL(5,2),
    "ganancia_por_unidad" DECIMAL(10,2),
    "costo_total_producto" DECIMAL(10,2),

    CONSTRAINT "Productos_pkey" PRIMARY KEY ("producto_id")
);

-- CreateTable
CREATE TABLE "public"."AnalisisPreciosProducto" (
    "analisis_id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "negocio_id" INTEGER NOT NULL,
    "fecha_analisis" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "costo_materia_prima" DECIMAL(10,2) NOT NULL,
    "costo_mano_obra" DECIMAL(10,2) NOT NULL,
    "costos_adicionales" DECIMAL(10,2) NOT NULL,
    "costo_total_producto" DECIMAL(10,2) NOT NULL,
    "precio_venta_sugerido_ia" DECIMAL(10,2) NOT NULL,
    "margen_ganancia_sugerido" DECIMAL(5,2) NOT NULL,
    "precio_venta_cliente" DECIMAL(10,2) NOT NULL,
    "margen_ganancia_real" DECIMAL(5,2) NOT NULL,
    "ganancia_por_unidad" DECIMAL(10,2) NOT NULL,
    "rentabilidad_producto" DECIMAL(5,2) NOT NULL,
    "precio_promedio_mercado" DECIMAL(10,2),
    "posicionamiento_precio" VARCHAR(50),
    "recomendaciones_precio" JSONB,
    "estado_analisis" VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    "fecha_actualizacion" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "AnalisisPreciosProducto_pkey" PRIMARY KEY ("analisis_id")
);

-- CreateTable
CREATE TABLE "public"."ResumenCostosGanancias" (
    "resumen_id" SERIAL NOT NULL,
    "negocio_id" INTEGER NOT NULL,
    "fecha_analisis" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "costo_total_productos" DECIMAL(15,2) NOT NULL,
    "costo_total_adicionales" DECIMAL(15,2) NOT NULL,
    "costo_total_general" DECIMAL(15,2) NOT NULL,
    "precio_venta_total_sugerido" DECIMAL(15,2) NOT NULL,
    "precio_venta_total_cliente" DECIMAL(15,2) NOT NULL,
    "ganancia_total_sugerida" DECIMAL(15,2) NOT NULL,
    "ganancia_total_real" DECIMAL(15,2) NOT NULL,
    "margen_ganancia_promedio" DECIMAL(5,2) NOT NULL,
    "rentabilidad_total_negocio" DECIMAL(5,2) NOT NULL,
    "roi_estimado" DECIMAL(5,2) NOT NULL,
    "producto_mas_rentable" VARCHAR(200),
    "producto_menos_rentable" VARCHAR(200),
    "productos_analizados" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ResumenCostosGanancias_pkey" PRIMARY KEY ("resumen_id")
);

-- CreateTable
CREATE TABLE "public"."Recetas" (
    "receta_id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "nombre_receta" VARCHAR(200) NOT NULL,
    "tiempo_preparacion" INTEGER,
    "personal_requerido" INTEGER,
    "costos_adicionales" DECIMAL(10,2),
    "precio_venta" DECIMAL(10,2) NOT NULL,
    "costo_receta" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Recetas_pkey" PRIMARY KEY ("receta_id")
);

-- CreateTable
CREATE TABLE "public"."TiposCosto" (
    "tipo_costo_id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "es_fijo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TiposCosto_pkey" PRIMARY KEY ("tipo_costo_id")
);

-- CreateTable
CREATE TABLE "public"."CostosFijos" (
    "costo_fijo_id" SERIAL NOT NULL,
    "negocio_id" INTEGER NOT NULL,
    "tipo_costo_id" INTEGER NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "monto" DECIMAL(12,2) NOT NULL,
    "frecuencia" VARCHAR(50) NOT NULL,
    "fecha_inicio" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CostosFijos_pkey" PRIMARY KEY ("costo_fijo_id")
);

-- CreateTable
CREATE TABLE "public"."CostosVariables" (
    "costo_variable_id" SERIAL NOT NULL,
    "negocio_id" INTEGER NOT NULL,
    "producto_id" INTEGER,
    "receta_id" INTEGER,
    "tipo_costo_id" INTEGER NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "monto_por_unidad" DECIMAL(10,2) NOT NULL,
    "unidad_medida_id" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CostosVariables_pkey" PRIMARY KEY ("costo_variable_id")
);

-- CreateTable
CREATE TABLE "public"."CargosPersonal" (
    "cargo_id" SERIAL NOT NULL,
    "nombre_cargo" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "CargosPersonal_pkey" PRIMARY KEY ("cargo_id")
);

-- CreateTable
CREATE TABLE "public"."Personal" (
    "personal_id" SERIAL NOT NULL,
    "negocio_id" INTEGER NOT NULL,
    "cargo_id" INTEGER NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "apellido" VARCHAR(150) NOT NULL,
    "salario_base" DECIMAL(10,2) NOT NULL,
    "horas_trabajo" INTEGER,
    "fecha_contratacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Personal_pkey" PRIMARY KEY ("personal_id")
);

-- CreateTable
CREATE TABLE "public"."Analisis_IA" (
    "analisis_id" SERIAL NOT NULL,
    "negocio_id" INTEGER NOT NULL,
    "fecha_analisis" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analisis_IA_pkey" PRIMARY KEY ("analisis_id")
);

-- CreateTable
CREATE TABLE "public"."Aprendizaje" (
    "id_aprendizaje" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "total_niveles" INTEGER,

    CONSTRAINT "Aprendizaje_pkey" PRIMARY KEY ("id_aprendizaje")
);

-- CreateTable
CREATE TABLE "public"."Estados" (
    "id_estado" SERIAL NOT NULL,
    "nombre_estado" VARCHAR(50) NOT NULL,

    CONSTRAINT "Estados_pkey" PRIMARY KEY ("id_estado")
);

-- CreateTable
CREATE TABLE "public"."Modulos" (
    "id_modulo" SERIAL NOT NULL,
    "id_aprendizaje" INTEGER NOT NULL,
    "orden_modulo" INTEGER,
    "nombre_modulo" VARCHAR(150) NOT NULL,
    "titulo_conteido" VARCHAR(255),
    "concepto" TEXT NOT NULL,
    "recurso_interactivo" VARCHAR(255),

    CONSTRAINT "Modulos_pkey" PRIMARY KEY ("id_modulo")
);

-- CreateTable
CREATE TABLE "public"."NegocioProgresoPaso" (
    "id" SERIAL NOT NULL,
    "negocio_id" INTEGER NOT NULL,
    "modulo_id" INTEGER NOT NULL,
    "id_estado" INTEGER NOT NULL,
    "fecha_inicio" TIMESTAMP(6),
    "fecha_completado" TIMESTAMP(6),

    CONSTRAINT "NegocioProgresoPaso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Registros_financieros" (
    "registro_id" SERIAL NOT NULL,
    "negocio_id" INTEGER NOT NULL,
    "modulo_id" INTEGER NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "fecha_registro" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Registros_financieros_pkey" PRIMARY KEY ("registro_id")
);

-- CreateTable
CREATE TABLE "public"."Resultados_Costos_Analizados" (
    "resultado_costo_id" SERIAL NOT NULL,
    "analisis_id" INTEGER NOT NULL,
    "nombre_costo" VARCHAR(150),
    "valor_recibido" VARCHAR(50),
    "rango_estimado" VARCHAR(100),
    "evaluacion" VARCHAR(100),
    "comentario" TEXT,

    CONSTRAINT "Resultados_Costos_Analizados_pkey" PRIMARY KEY ("resultado_costo_id")
);

-- CreateTable
CREATE TABLE "public"."Resultados_Costos_Omitidos" (
    "costo_omitido_id" SERIAL NOT NULL,
    "analisis_id" INTEGER NOT NULL,
    "costo_omitido" VARCHAR(255),
    "importancia" VARCHAR(100),

    CONSTRAINT "Resultados_Costos_Omitidos_pkey" PRIMARY KEY ("costo_omitido_id")
);

-- CreateTable
CREATE TABLE "public"."Resultados_Plan_Accion" (
    "plan_id" SERIAL NOT NULL,
    "analisis_id" INTEGER NOT NULL,
    "titulo" VARCHAR(255),
    "descripcion" TEXT,
    "prioridad" VARCHAR(50),

    CONSTRAINT "Resultados_Plan_Accion_pkey" PRIMARY KEY ("plan_id")
);

-- CreateTable
CREATE TABLE "public"."Resultados_Riesgos_Detectados" (
    "riesgo_id" SERIAL NOT NULL,
    "analisis_id" INTEGER NOT NULL,
    "riesgo" VARCHAR(255),
    "causa_directa" TEXT,
    "impacto_potencial" TEXT,

    CONSTRAINT "Resultados_Riesgos_Detectados_pkey" PRIMARY KEY ("riesgo_id")
);

-- CreateTable
CREATE TABLE "public"."Resultados_Validacion_Costos" (
    "validacion_id" SERIAL NOT NULL,
    "negocio_id" INTEGER NOT NULL,
    "modulo_id" INTEGER NOT NULL,
    "fecha_validacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "costos_validados" JSONB,
    "costos_faltantes" JSONB,
    "resumen_validacion" JSONB,
    "puntuacion_global" INTEGER,
    "puede_proseguir_analisis" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Resultados_Validacion_Costos_pkey" PRIMARY KEY ("validacion_id")
);

-- CreateTable
CREATE TABLE "public"."Resultados_Analisis_Completo" (
    "resultado_id" SERIAL NOT NULL,
    "negocio_id" INTEGER NOT NULL,
    "modulo_id" INTEGER NOT NULL,
    "analisis_id" INTEGER NOT NULL,
    "fecha_analisis" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "costos_analizados" JSONB,
    "riesgos_detectados" JSONB,
    "plan_accion" JSONB,
    "resumen_analisis" JSONB,
    "estado_guardado" VARCHAR(50) NOT NULL DEFAULT 'guardado',

    CONSTRAINT "Resultados_Analisis_Completo_pkey" PRIMARY KEY ("resultado_id")
);

-- CreateTable
CREATE TABLE "public"."Resultados_Precio_Venta" (
    "resultado_id" SERIAL NOT NULL,
    "negocio_id" INTEGER NOT NULL,
    "modulo_id" INTEGER NOT NULL,
    "sector_id" INTEGER NOT NULL,
    "analisis_id" INTEGER NOT NULL,
    "fecha_analisis" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "costos_fijos_totales" DECIMAL(15,2) NOT NULL,
    "costos_variables_totales" DECIMAL(15,2) NOT NULL,
    "margen_contribucion" DECIMAL(5,2) NOT NULL,
    "precio_venta_sugerido" DECIMAL(10,2) NOT NULL,
    "precio_venta_competitivo" DECIMAL(10,2) NOT NULL,
    "rentabilidad_estimada" DECIMAL(5,2) NOT NULL,
    "precio_promedio_mercado" DECIMAL(10,2),
    "posicionamiento_precio" VARCHAR(100),
    "recomendaciones_precio" JSONB,

    CONSTRAINT "Resultados_Precio_Venta_pkey" PRIMARY KEY ("resultado_id")
);

-- CreateTable
CREATE TABLE "public"."Resultados_Punto_Equilibrio" (
    "resultado_id" SERIAL NOT NULL,
    "negocio_id" INTEGER NOT NULL,
    "modulo_id" INTEGER NOT NULL,
    "sector_id" INTEGER NOT NULL,
    "analisis_id" INTEGER NOT NULL,
    "fecha_analisis" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "costos_fijos_totales" DECIMAL(15,2) NOT NULL,
    "costos_variables_totales" DECIMAL(15,2) NOT NULL,
    "precio_venta_unitario" DECIMAL(10,2) NOT NULL,
    "costo_variable_unitario" DECIMAL(10,2) NOT NULL,
    "punto_equilibrio_unidades" DECIMAL(10,2) NOT NULL,
    "punto_equilibrio_ventas" DECIMAL(15,2) NOT NULL,
    "margen_seguridad" DECIMAL(5,2) NOT NULL,
    "escenario_optimista" JSONB,
    "escenario_pesimista" JSONB,
    "recomendaciones_equilibrio" JSONB,

    CONSTRAINT "Resultados_Punto_Equilibrio_pkey" PRIMARY KEY ("resultado_id")
);

-- CreateTable
CREATE TABLE "public"."ItemsInversion" (
    "item_id" SERIAL NOT NULL,
    "negocio_id" INTEGER NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(15,2) NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "categoria" VARCHAR(100),
    "prioridad" VARCHAR(50),
    "fecha_compra_estimada" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemsInversion_pkey" PRIMARY KEY ("item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "public"."Usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Sectores_nombre_sector_key" ON "public"."Sectores"("nombre_sector");

-- CreateIndex
CREATE UNIQUE INDEX "UnidadMedida_nombre_key" ON "public"."UnidadMedida"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "unique_analisis_producto_negocio" ON "public"."AnalisisPreciosProducto"("producto_id", "negocio_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_resumen_negocio" ON "public"."ResumenCostosGanancias"("negocio_id");

-- CreateIndex
CREATE UNIQUE INDEX "TiposCosto_nombre_key" ON "public"."TiposCosto"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "unique_progreso_negocio_modulo" ON "public"."NegocioProgresoPaso"("negocio_id", "modulo_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_resultado_completo" ON "public"."Resultados_Analisis_Completo"("negocio_id", "modulo_id", "analisis_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_resultado_precio_venta" ON "public"."Resultados_Precio_Venta"("negocio_id", "modulo_id", "analisis_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_resultado_punto_equilibrio" ON "public"."Resultados_Punto_Equilibrio"("negocio_id", "modulo_id", "analisis_id");

-- AddForeignKey
ALTER TABLE "public"."Negocios" ADD CONSTRAINT "Negocios_id_tamano_fkey" FOREIGN KEY ("id_tamano") REFERENCES "public"."TamanosNegocio"("id_tamano") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Negocios" ADD CONSTRAINT "Negocios_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "public"."Sectores"("sector_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Negocios" ADD CONSTRAINT "Negocios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Productos" ADD CONSTRAINT "Productos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "public"."CategoriasProducto"("categoria_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Productos" ADD CONSTRAINT "Productos_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Productos" ADD CONSTRAINT "Productos_unidad_medida_id_fkey" FOREIGN KEY ("unidad_medida_id") REFERENCES "public"."UnidadMedida"("unidad_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."AnalisisPreciosProducto" ADD CONSTRAINT "AnalisisPreciosProducto_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."AnalisisPreciosProducto" ADD CONSTRAINT "AnalisisPreciosProducto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "public"."Productos"("producto_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ResumenCostosGanancias" ADD CONSTRAINT "ResumenCostosGanancias_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Recetas" ADD CONSTRAINT "Recetas_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "public"."Productos"("producto_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."CostosFijos" ADD CONSTRAINT "CostosFijos_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."CostosFijos" ADD CONSTRAINT "CostosFijos_tipo_costo_id_fkey" FOREIGN KEY ("tipo_costo_id") REFERENCES "public"."TiposCosto"("tipo_costo_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."CostosVariables" ADD CONSTRAINT "CostosVariables_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."CostosVariables" ADD CONSTRAINT "CostosVariables_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "public"."Productos"("producto_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."CostosVariables" ADD CONSTRAINT "CostosVariables_receta_id_fkey" FOREIGN KEY ("receta_id") REFERENCES "public"."Recetas"("receta_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."CostosVariables" ADD CONSTRAINT "CostosVariables_tipo_costo_id_fkey" FOREIGN KEY ("tipo_costo_id") REFERENCES "public"."TiposCosto"("tipo_costo_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."CostosVariables" ADD CONSTRAINT "CostosVariables_unidad_medida_id_fkey" FOREIGN KEY ("unidad_medida_id") REFERENCES "public"."UnidadMedida"("unidad_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Personal" ADD CONSTRAINT "Personal_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "public"."CargosPersonal"("cargo_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Personal" ADD CONSTRAINT "Personal_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Analisis_IA" ADD CONSTRAINT "Analisis_IA_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Modulos" ADD CONSTRAINT "Modulos_id_aprendizaje_fkey" FOREIGN KEY ("id_aprendizaje") REFERENCES "public"."Aprendizaje"("id_aprendizaje") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."NegocioProgresoPaso" ADD CONSTRAINT "NegocioProgresoPaso_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "public"."Estados"("id_estado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."NegocioProgresoPaso" ADD CONSTRAINT "NegocioProgresoPaso_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "public"."Modulos"("id_modulo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."NegocioProgresoPaso" ADD CONSTRAINT "NegocioProgresoPaso_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Registros_financieros" ADD CONSTRAINT "Registros_financieros_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "public"."Modulos"("id_modulo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Registros_financieros" ADD CONSTRAINT "Registros_financieros_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Costos_Analizados" ADD CONSTRAINT "Resultados_Costos_Analizados_analisis_id_fkey" FOREIGN KEY ("analisis_id") REFERENCES "public"."Analisis_IA"("analisis_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Costos_Omitidos" ADD CONSTRAINT "Resultados_Costos_Omitidos_analisis_id_fkey" FOREIGN KEY ("analisis_id") REFERENCES "public"."Analisis_IA"("analisis_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Plan_Accion" ADD CONSTRAINT "Resultados_Plan_Accion_analisis_id_fkey" FOREIGN KEY ("analisis_id") REFERENCES "public"."Analisis_IA"("analisis_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Riesgos_Detectados" ADD CONSTRAINT "Resultados_Riesgos_Detectados_analisis_id_fkey" FOREIGN KEY ("analisis_id") REFERENCES "public"."Analisis_IA"("analisis_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Validacion_Costos" ADD CONSTRAINT "Resultados_Validacion_Costos_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "public"."Modulos"("id_modulo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Validacion_Costos" ADD CONSTRAINT "Resultados_Validacion_Costos_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Analisis_Completo" ADD CONSTRAINT "Resultados_Analisis_Completo_analisis_id_fkey" FOREIGN KEY ("analisis_id") REFERENCES "public"."Analisis_IA"("analisis_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Analisis_Completo" ADD CONSTRAINT "Resultados_Analisis_Completo_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "public"."Modulos"("id_modulo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Analisis_Completo" ADD CONSTRAINT "Resultados_Analisis_Completo_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Precio_Venta" ADD CONSTRAINT "Resultados_Precio_Venta_analisis_id_fkey" FOREIGN KEY ("analisis_id") REFERENCES "public"."Analisis_IA"("analisis_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Precio_Venta" ADD CONSTRAINT "Resultados_Precio_Venta_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "public"."Modulos"("id_modulo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Precio_Venta" ADD CONSTRAINT "Resultados_Precio_Venta_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Precio_Venta" ADD CONSTRAINT "Resultados_Precio_Venta_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "public"."Sectores"("sector_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Punto_Equilibrio" ADD CONSTRAINT "Resultados_Punto_Equilibrio_analisis_id_fkey" FOREIGN KEY ("analisis_id") REFERENCES "public"."Analisis_IA"("analisis_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Punto_Equilibrio" ADD CONSTRAINT "Resultados_Punto_Equilibrio_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "public"."Modulos"("id_modulo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Punto_Equilibrio" ADD CONSTRAINT "Resultados_Punto_Equilibrio_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Punto_Equilibrio" ADD CONSTRAINT "Resultados_Punto_Equilibrio_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "public"."Sectores"("sector_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ItemsInversion" ADD CONSTRAINT "ItemsInversion_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE CASCADE ON UPDATE NO ACTION;
