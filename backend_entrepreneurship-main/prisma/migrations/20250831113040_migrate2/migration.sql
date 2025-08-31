-- AlterTable
ALTER TABLE "public"."CostosFijos" ADD COLUMN     "categoria_id" INTEGER;

-- CreateTable
CREATE TABLE "public"."CategoriaActivoFijo" (
    "categoria_id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "icono" VARCHAR(100),
    "color" VARCHAR(7),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoriaActivoFijo_pkey" PRIMARY KEY ("categoria_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaActivoFijo_nombre_key" ON "public"."CategoriaActivoFijo"("nombre");

-- AddForeignKey
ALTER TABLE "public"."CostosFijos" ADD CONSTRAINT "CostosFijos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "public"."CategoriaActivoFijo"("categoria_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
