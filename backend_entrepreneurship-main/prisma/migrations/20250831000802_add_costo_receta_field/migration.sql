/*
  Warnings:

  - A unique constraint covering the columns `[negocio_id]` on the table `ResumenCostosGanancias` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `costo_receta` to the `Recetas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Recetas" ADD COLUMN     "costo_receta" DECIMAL(10,2) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "unique_resumen_negocio" ON "public"."ResumenCostosGanancias"("negocio_id");
