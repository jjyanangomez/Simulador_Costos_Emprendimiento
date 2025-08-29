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
CREATE TABLE "public"."Negocios" (
    "negocio_id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "tipo_negocio" VARCHAR(100) NOT NULL,
    "nombre_negocio" VARCHAR(200) NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "id_tamano" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Negocios_pkey" PRIMARY KEY ("negocio_id")
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
CREATE TABLE "public"."Usuarios" (
    "usuario_id" SERIAL NOT NULL,
    "nombre_completo" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "fecha_registro" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "public"."tamano_negocio" (
    "id_tamano" SERIAL NOT NULL,
    "tamano_nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "tamano_negocio_pkey" PRIMARY KEY ("id_tamano")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_progreso_negocio_modulo" ON "public"."NegocioProgresoPaso"("negocio_id", "modulo_id");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "public"."Usuarios"("email");

-- AddForeignKey
ALTER TABLE "public"."Analisis_IA" ADD CONSTRAINT "fk_analisis_negocios" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Modulos" ADD CONSTRAINT "fk_modulos_aprendizaje" FOREIGN KEY ("id_aprendizaje") REFERENCES "public"."Aprendizaje"("id_aprendizaje") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."NegocioProgresoPaso" ADD CONSTRAINT "fk_progreso_estados" FOREIGN KEY ("id_estado") REFERENCES "public"."Estados"("id_estado") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."NegocioProgresoPaso" ADD CONSTRAINT "fk_progreso_modulos" FOREIGN KEY ("modulo_id") REFERENCES "public"."Modulos"("id_modulo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."NegocioProgresoPaso" ADD CONSTRAINT "fk_progreso_negocios" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Negocios" ADD CONSTRAINT "fk_negocios_tamano" FOREIGN KEY ("id_tamano") REFERENCES "public"."tamano_negocio"("id_tamano") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Negocios" ADD CONSTRAINT "fk_negocios_usuarios" FOREIGN KEY ("usuario_id") REFERENCES "public"."Usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Registros_financieros" ADD CONSTRAINT "fk_registros_modulos" FOREIGN KEY ("modulo_id") REFERENCES "public"."Modulos"("id_modulo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Registros_financieros" ADD CONSTRAINT "fk_registros_negocios" FOREIGN KEY ("negocio_id") REFERENCES "public"."Negocios"("negocio_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Costos_Analizados" ADD CONSTRAINT "fk_resultados_analisis" FOREIGN KEY ("analisis_id") REFERENCES "public"."Analisis_IA"("analisis_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Costos_Omitidos" ADD CONSTRAINT "fk_omitidos_analisis" FOREIGN KEY ("analisis_id") REFERENCES "public"."Analisis_IA"("analisis_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Plan_Accion" ADD CONSTRAINT "fk_plan_analisis" FOREIGN KEY ("analisis_id") REFERENCES "public"."Analisis_IA"("analisis_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Resultados_Riesgos_Detectados" ADD CONSTRAINT "fk_riesgos_analisis" FOREIGN KEY ("analisis_id") REFERENCES "public"."Analisis_IA"("analisis_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
