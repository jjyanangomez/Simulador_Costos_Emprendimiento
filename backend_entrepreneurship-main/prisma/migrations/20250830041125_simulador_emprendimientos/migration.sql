/*
  Warnings:

  - You are about to drop the column `tipo_negocio` on the `Negocios` table. All the data in the column will be lost.
  - You are about to drop the column `ubicacion` on the `Negocios` table. All the data in the column will be lost.
  - You are about to drop the `tamano_negocio` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `aforo_personas` to the `Negocios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inversion_inicial` to the `Negocios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sector_id` to the `Negocios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha_nacimiento` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Negocios" DROP CONSTRAINT "fk_negocios_tamano";

-- AlterTable
ALTER TABLE "public"."Negocios" DROP COLUMN "tipo_negocio",
DROP COLUMN "ubicacion",
ADD COLUMN     "aforo_personas" INTEGER NOT NULL,
ADD COLUMN     "capital_prestamo" DECIMAL(15,2),
ADD COLUMN     "capital_propio" DECIMAL(15,2),
ADD COLUMN     "inversion_inicial" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "sector_id" INTEGER NOT NULL,
ADD COLUMN     "tasa_interes" DECIMAL(5,2),
ADD COLUMN     "ubicacion_exacta" TEXT;

-- AlterTable
ALTER TABLE "public"."Usuarios" ADD COLUMN     "fecha_nacimiento" TIMESTAMP(6) NOT NULL;

-- DropTable
DROP TABLE "public"."tamano_negocio";

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

    CONSTRAINT "Productos_pkey" PRIMARY KEY ("producto_id")
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

-- CreateIndex
CREATE UNIQUE INDEX "Sectores_nombre_sector_key" ON "public"."Sectores"("nombre_sector");

-- CreateIndex
CREATE UNIQUE INDEX "UnidadMedida_nombre_key" ON "public"."UnidadMedida"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "TiposCosto_nombre_key" ON "public"."TiposCosto"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "unique_resultado_precio_venta" ON "public"."Resultados_Precio_Venta"("negocio_id", "modulo_id", "analisis_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_resultado_punto_equilibrio" ON "public"."Resultados_Punto_Equilibrio"("negocio_id", "modulo_id", "analisis_id");

-- RenameForeignKey
ALTER TABLE "public"."Analisis_IA" RENAME CONSTRAINT "fk_analisis_negocios" TO "Analisis_IA_negocio_id_fkey";

-- RenameForeignKey
ALTER TABLE "public"."Modulos" RENAME CONSTRAINT "fk_modulos_aprendizaje" TO "Modulos_id_aprendizaje_fkey";

-- RenameForeignKey
ALTER TABLE "public"."NegocioProgresoPaso" RENAME CONSTRAINT "fk_progreso_estados" TO "NegocioProgresoPaso_id_estado_fkey";

-- RenameForeignKey
ALTER TABLE "public"."NegocioProgresoPaso" RENAME CONSTRAINT "fk_progreso_modulos" TO "NegocioProgresoPaso_modulo_id_fkey";

-- RenameForeignKey
ALTER TABLE "public"."NegocioProgresoPaso" RENAME CONSTRAINT "fk_progreso_negocios" TO "NegocioProgresoPaso_negocio_id_fkey";

-- RenameForeignKey
ALTER TABLE "public"."Negocios" RENAME CONSTRAINT "fk_negocios_usuarios" TO "Negocios_usuario_id_fkey";

-- RenameForeignKey
ALTER TABLE "public"."Registros_financieros" RENAME CONSTRAINT "fk_registros_modulos" TO "Registros_financieros_modulo_id_fkey";

-- RenameForeignKey
ALTER TABLE "public"."Registros_financieros" RENAME CONSTRAINT "fk_registros_negocios" TO "Registros_financieros_negocio_id_fkey";

-- RenameForeignKey
ALTER TABLE "public"."Resultados_Analisis_Completo" RENAME CONSTRAINT "fk_resultados_completos_analisis" TO "Resultados_Analisis_Completo_analisis_id_fkey";

-- RenameForeignKey
ALTER TABLE "public"."Resultados_Analisis_Completo" RENAME CONSTRAINT "fk_resultados_completos_modulos" TO "Resultados_Analisis_Completo_modulo_id_fkey";

-- RenameForeignKey
ALTER TABLE "public"."Resultados_Analisis_Completo" RENAME CONSTRAINT "fk_resultados_completos_negocios" TO "Resultados_Analisis_Completo_negocio_id_fkey";

-- RenameForeignKey
ALTER TABLE "public"."Resultados_Costos_Analizados" RENAME CONSTRAINT "fk_resultados_analisis" TO "Resultados_Costos_Analizados_analisis_id_fkey";

-- RenameForeignKey
ALTER TABLE "public"."Resultados_Costos_Omitidos" RENAME CONSTRAINT "fk_omitidos_analisis" TO "Resultados_Costos_Omitidos_analisis_id_fkey";

-- RenameForeignKey
ALTER TABLE "public"."Resultados_Plan_Accion" RENAME CONSTRAINT "fk_plan_analisis" TO "Resultados_Plan_Accion_analisis_id_fkey";

-- RenameForeignKey
ALTER TABLE "public"."Resultados_Riesgos_Detectados" RENAME CONSTRAINT "fk_riesgos_analisis" TO "Resultados_Riesgos_Detectados_analisis_id_fkey";

-- RenameForeignKey
ALTER TABLE "public"."Resultados_Validacion_Costos" RENAME CONSTRAINT "fk_validacion_modulos" TO "Resultados_Validacion_Costos_modulo_id_fkey";

-- RenameForeignKey
ALTER TABLE "public"."Resultados_Validacion_Costos" RENAME CONSTRAINT "fk_validacion_negocios" TO "Resultados_Validacion_Costos_negocio_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."Negocios" ADD CONSTRAINT "Negocios_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "public"."Sectores"("sector_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Negocios" ADD CONSTRAINT "Negocios_id_tamano_fkey" FOREIGN KEY ("id_tamano") REFERENCES "public"."TamanosNegocio"("id_tamano") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Productos" ADD CONSTRAINT "Productos_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Productos" ADD CONSTRAINT "Productos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "public"."CategoriasProducto"("categoria_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Productos" ADD CONSTRAINT "Productos_unidad_medida_id_fkey" FOREIGN KEY ("unidad_medida_id") REFERENCES "public"."UnidadMedida"("unidad_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

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
ALTER TABLE "public"."Personal" ADD CONSTRAINT "Personal_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Personal" ADD CONSTRAINT "Personal_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "public"."CargosPersonal"("cargo_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Precio_Venta" ADD CONSTRAINT "Resultados_Precio_Venta_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Precio_Venta" ADD CONSTRAINT "Resultados_Precio_Venta_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "public"."Modulos"("id_modulo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Precio_Venta" ADD CONSTRAINT "Resultados_Precio_Venta_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "public"."Sectores"("sector_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Precio_Venta" ADD CONSTRAINT "Resultados_Precio_Venta_analisis_id_fkey" FOREIGN KEY ("analisis_id") REFERENCES "public"."Analisis_IA"("analisis_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Punto_Equilibrio" ADD CONSTRAINT "Resultados_Punto_Equilibrio_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Punto_Equilibrio" ADD CONSTRAINT "Resultados_Punto_Equilibrio_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "public"."Modulos"("id_modulo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Punto_Equilibrio" ADD CONSTRAINT "Resultados_Punto_Equilibrio_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "public"."Sectores"("sector_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Punto_Equilibrio" ADD CONSTRAINT "Resultados_Punto_Equilibrio_analisis_id_fkey" FOREIGN KEY ("analisis_id") REFERENCES "public"."Analisis_IA"("analisis_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
