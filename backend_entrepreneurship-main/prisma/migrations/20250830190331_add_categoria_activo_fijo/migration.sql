-- CreateTable
CREATE TABLE "CategoriaActivoFijo" (
    "categoria_id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255),
    "icono" VARCHAR(100),
    "color" VARCHAR(7),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoriaActivoFijo_pkey" PRIMARY KEY ("categoria_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaActivoFijo_nombre_key" ON "CategoriaActivoFijo"("nombre");

-- AlterTable
ALTER TABLE "CostosFijos" ADD COLUMN "categoria_id" INTEGER;

-- AddForeignKey
ALTER TABLE "CostosFijos" ADD CONSTRAINT "CostosFijos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "CategoriaActivoFijo"("categoria_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
