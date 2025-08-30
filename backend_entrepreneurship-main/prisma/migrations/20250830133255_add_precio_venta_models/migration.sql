-- AlterTable: Agregar nuevos campos a Productos
ALTER TABLE "Productos" ADD COLUMN "precio_venta_cliente" DECIMAL(10,2),
ADD COLUMN "precio_venta_sugerido_ia" DECIMAL(10,2),
ADD COLUMN "margen_ganancia_ia" DECIMAL(5,2),
ADD COLUMN "margen_ganancia_real" DECIMAL(5,2),
ADD COLUMN "ganancia_por_unidad" DECIMAL(10,2),
ADD COLUMN "costo_total_producto" DECIMAL(10,2);

-- CreateTable: Crear tabla AnalisisPreciosProducto
CREATE TABLE "AnalisisPreciosProducto" (
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

-- CreateTable: Crear tabla ResumenCostosGanancias
CREATE TABLE "ResumenCostosGanancias" (
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

-- CreateIndex: Crear índice único para AnalisisPreciosProducto
CREATE UNIQUE INDEX "unique_analisis_producto_negocio" ON "AnalisisPreciosProducto"("producto_id", "negocio_id");

-- AddForeignKey: Agregar foreign key para AnalisisPreciosProducto.producto_id
ALTER TABLE "AnalisisPreciosProducto" ADD CONSTRAINT "AnalisisPreciosProducto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Productos"("producto_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey: Agregar foreign key para AnalisisPreciosProducto.negocio_id
ALTER TABLE "AnalisisPreciosProducto" ADD CONSTRAINT "AnalisisPreciosProducto_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey: Agregar foreign key para ResumenCostosGanancias.negocio_id
ALTER TABLE "ResumenCostosGanancias" ADD CONSTRAINT "ResumenCostosGanancias_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
