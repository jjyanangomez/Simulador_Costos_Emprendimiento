/*
  Warnings:

  - A unique constraint covering the columns `[negocio_id]` on the table `ResumenCostosGanancias` will be added. If there are existing duplicate values, this will fail.

*/
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
CREATE UNIQUE INDEX "unique_resumen_negocio" ON "public"."ResumenCostosGanancias"("negocio_id");

-- AddForeignKey
ALTER TABLE "public"."ItemsInversion" ADD CONSTRAINT "ItemsInversion_negocio_id_fkey" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE CASCADE ON UPDATE NO ACTION;
