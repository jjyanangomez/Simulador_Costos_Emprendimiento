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

-- AddForeignKey
ALTER TABLE "public"."Resultados_Validacion_Costos" ADD CONSTRAINT "fk_validacion_negocios" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Validacion_Costos" ADD CONSTRAINT "fk_validacion_modulos" FOREIGN KEY ("modulo_id") REFERENCES "public"."Modulos"("id_modulo") ON DELETE NO ACTION ON UPDATE NO ACTION;
