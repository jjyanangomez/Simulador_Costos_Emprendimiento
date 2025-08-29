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

-- CreateIndex
CREATE UNIQUE INDEX "unique_resultado_completo" ON "public"."Resultados_Analisis_Completo"("negocio_id", "modulo_id", "analisis_id");

-- AddForeignKey
ALTER TABLE "public"."Resultados_Analisis_Completo" ADD CONSTRAINT "fk_resultados_completos_negocios" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Analisis_Completo" ADD CONSTRAINT "fk_resultados_completos_modulos" FOREIGN KEY ("modulo_id") REFERENCES "public"."Modulos"("id_modulo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Analisis_Completo" ADD CONSTRAINT "fk_resultados_completos_analisis" FOREIGN KEY ("analisis_id") REFERENCES "public"."Analisis_IA"("analisis_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
