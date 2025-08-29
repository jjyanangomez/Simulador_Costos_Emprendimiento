import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptService {
  
  /**
   * Genera el prompt optimizado para validación rápida con retroalimentación detallada
   */
  generateValidationPrompt(
    costs: Array<{ name: string; amount: string }>,
    businessInfo: { tipoNegocio: string; tamano: string; ubicacion: string }
  ): string {
    const listaCostos = costs
      .map(c => c.name && c.amount ? `${c.name.trim()}: $${c.amount}` : null)
      .filter(Boolean)
      .join('\n');

    return `Rol: Actúa como un auditor de datos financieros y analista de riesgos. Tu especialización es asegurar la calidad y precisión de la información financiera de entrada para emprendimientos en Ecuador, ${businessInfo.ubicacion}, antes de que sea utilizada en un análisis estratégico.

Contexto: Soy un emprendedor con un negocio ${businessInfo.tamano} de tipo ${businessInfo.tipoNegocio} ubicado en ${businessInfo.ubicacion} y necesito tu ayuda para depurar mi lista de costos mensuales antes de que tu colega, el asesor financiero de élite, realice el diagnóstico completo. Tu misión es auditar mi lista y darme el visto bueno para proceder, o indicarme exactamente qué debo corregir.

Reglas de Validación:
1.  **Exclusividad de Costos Fijos:** La lista solo debe contener costos fijos, es decir, aquellos que no varían significativamente con el volumen de ventas mes a mes. Costos como 'materia prima', 'compra de inventario', 'insumos' o 'packaging' son costos variables y deben ser marcados como inválidos.
2.  **Costos Desagregados:** Cada ítem debe representar un único costo. No se aceptan costos agrupados como 'Servicios básicos e internet' o 'Marketing y permisos'. Deben ser listados por separado para un análisis preciso.
3.  **Especificidad:** No se aceptan costos ambiguos o genéricos como 'Varios', 'Otros gastos' o 'Gastos administrativos'. Cada costo debe ser claramente identificable.
4.  **Exclusión Explícita de Costos obligatorios:** Cualquier costo relacionado con compensación humana debe ser omitido, descartado y/o no incluido en los costos obligatorios para este análisis específico. Esto incluye pero no se limita a:

Sueldos y salarios: Pagos fijos mensuales a empleados
Honorarios profesionales: Pagos a consultores, asesores o profesionales independientes
Nómina: Cualquier concepto incluido en la planilla de pagos
Beneficios sociales: Décimo tercero, décimo cuarto, vacaciones, utilidades
Aportes patronales: IESS, fondos de reserva, contribuciones obligatorias
Bonificaciones: Incentivos, comisiones fijas, bonos de productividad
Contratistas de servicios personales: Pagos a personas naturales por servicios específicos
Capacitación de personal: Cursos, entrenamientos, desarrollo profesional
Uniformes y equipos de trabajo: Vestimenta, herramientas personales, EPP

**NO DEBES INCLUIR EN LOS COSTOS OBLIGATORIOS Cualquier costo relacionado con 'sueldos', 'honorarios', 'salarios' o 'nómina' INCLUSO SI SON ESCENCIALES**
**NO DEBES INCLUIR EN LOS COSTOS OBLIGATORIOS Cualquier costo relacionado con 'contabilidad' INCLUSO SI SON ESCENCIALES**

Justificación: Este análisis se enfoca exclusivamente en costos operativos mensuales no relacionados con personal para proporcionar una base de costos fijos que permita evaluar la viabilidad operativa independiente de las decisiones de contratación. Los costos de personal serán analizados en una fase posterior del proceso de planificación financiera.

5.  **Verificación de Costos obligatorios faltantes:** Basado en el ${businessInfo.tipoNegocio} proporcionado, debes inferir los costos fijos críticos que fueron omitidos y mencionarlos en el resumen (en caso de haber alguno). En caso de existir costos obligatorios faltantes no se podrá proseguir con el analisis por lo que debes ser muy cauteloso al agregar alguno, recuerda que es un negocio pequeño y a lo mejor no es imperativo tener en cuenta estos costos, NO ESTAS OBLIGADO A INCLUIR COSTOS OBLIGATORIOS, SI CONSIDERAS QUE SE A PROPORCIONADO UNA LISTA ACEPTABLE DE COSTOS FIJOS DEJA LA SECCION DE COSTOS OBLIGATORIOS VACIA Y CENTRATE EN VALIDAR SUS VALORES. en tal caso puedes ponerlos en la seccion de recomendados, que no impiden que se prosiga con el analisis.
6.  **Verificación de Costos recomendados faltantes:** Basado en el ${businessInfo.tipoNegocio} proporcionado, debes inferir los costos fijos no tan importantes (Mejoran eficiencia/rentabilidad pero no son críticos) que fueron omitidos y mencionarlos en el resumen (en caso de haber alguno). Estos costos son meramente informativos para el conocimiento del emprendedor por lo tanto no impiden que se prosiga con el analisis en caso de no ser incluidos.
7.  **Verificación de costos realistas:** Parte crucial de tu trabajo es identificar los valores ilógicos (valores extremadamente altos o bajos). En caso de no cumplir con esta regla el costo debe ser marcado como invalido.

Información a Validar:
Tipo de Negocio: ${businessInfo.tipoNegocio}
Ubicacion: ${businessInfo.ubicacion}
Lista de Costos Proporcionada:
${listaCostos}

Tarea:
Analiza cada costo en la lista proporcionada según las reglas de validación. Luego, determina si faltan costos obligatorios para el tipo de negocio. Evita incluir costos redundantes aparentemente obligatorios y adhierete firmemente a las reglas de validacion, en caso de que la lista de costos provista sea suficientemente robusta puedes no incluir la seccion de costos_obligatorios_faltantes. Finalmente, genera un veredicto que indique si puedo proceder con el análisis principal. Tu respuesta debe ser únicamente un objeto JSON que siga estrictamente la siguiente estructura. No incluyas ningún texto introductorio o explicaciones fuera del formato JSON.


Formato de Respuesta:

{
  "validacion_de_costos": [
    {
      "costo_recibido": "Costo1",
      "valor_recibido": "$Valor1",
      "es_valido": true,
      "justificacion": "Válido. Es un costo fijo, específico y fundamental para el análisis."
    },
    {
      "costo_recibido": "Costo2",
      "valor_recibido": "$Valor2",
      "es_valido": false,
      "justificacion": "Inválido. Este costo es variable, no fijo. Su valor depende directamente de las ventas y la producción."
    },
    {
      "costo_recibido": "Costo3",
      "valor_recibido": "$Valor3",
      "es_valido": false,
      "justificacion": "Inválido. El término es ambiguo y agrupa múltiples costos. Se debe desglosar en ítems específicos."
    },
    {
      "costo_recibido": "Costo4",
      "valor_recibido": "$Valor4",
      "es_valido": false,
      "justificacion": "Inválido. Según las instrucciones, este tipo de costo debe ser excluido del análisis."
    }
  ],
  "costos_obligatorios_faltantes": [
    {
      "nombre": "Costo Obligatorio 1",
      "descripcion": "Descripción del costo obligatorio que debe incluirse por necesidad operativa.",
      "motivo_critico": "Razón por la cual este costo es crítico y obligatorio para el funcionamiento del negocio."
    },
    {
      "nombre": "Costo Obligatorio 2",
      "descripcion": "Descripción del segundo costo obligatorio necesario para la operación.",
      "motivo_critico": "Explicación de por qué es indispensable incluir este costo en el análisis."
    }
  ],
  "costos_recomendados_faltantes": [
    {
      "nombre": "Costo Recomendado 1",
      "descripcion": "Descripción del costo recomendado que mejora la operación del negocio.",
      "beneficio": "Beneficio específico que aporta este costo al crecimiento y eficiencia del negocio."
    },
    {
      "nombre": "Costo Recomendado 2",
      "descripcion": "Descripción del segundo costo recomendado para optimizar operaciones.",
      "beneficio": "Ventaja competitiva o mejora operativa que proporciona este costo al negocio."
    }
  ],
  "resumen_validacion": {
    "mensaje_general": "Se han detectado errores en la lista proporcionada. Por favor, corrígela siguiendo las justificaciones para cada ítem inválido. Adicionalmente, para este tipo de negocio, es crítico que no olvides incluir los costos obligatorios y recomendados listados. Estos son vitales para la protección y el crecimiento sostenible del negocio.",
    "puede_proseguir_analisis": false
  }
}

Nota: Este formato tiene funciones exclusivamente informativas para el correcto formato de la respuesta. Por ningún motivo debe ser la respuesta recibida. Los textos genéricos deben ser reemplazados con contenido específico.

  `;
  }

  /**
   * Genera el prompt para análisis detallado con formato específico
   */
  generateAnalysisPrompt(
    costs: Array<{ name: string; amount: string }>,
    businessInfo: { tipoNegocio: string; tamano: string; ubicacion: string },
    validationResult: any
  ): string {
    const listaCostos = costs
      .map(c => c.name && c.amount ? `${c.name.trim()}: $${c.amount}` : null)
      .filter(Boolean)
      .join('\n');

    return `Rol: Asesor financiero especializado en análisis de costos para ${businessInfo.tipoNegocio} en ${businessInfo.ubicacion}.

Contexto: ${businessInfo.tipoNegocio} (${businessInfo.tamano}) en ${businessInfo.ubicacion}
Costos a analizar: ${listaCostos}

Tarea: Realizar análisis comparativo de mercado y evaluación de riesgos operativos.

Rangos de mercado para ${businessInfo.ubicacion}:
- Alquiler: $500-2000/mes (depende de zona y tamaño)
- Luz: $50-200/mes (depende de consumo)
- Agua: $20-80/mes (depende de consumo)
- Internet: $30-100/mes (depende de velocidad)
- Seguros: $50-300/mes (depende de cobertura)
- Patentes: $100-500/año (depende de actividad)
- Permisos: $200-1000/año (depende de tipo de negocio)

Responde SOLO JSON con estructura EXACTA:

{
  "analisis_costos": {
    "Alquiler": {
      "valor_recibido": "$500",
      "rango_estimado_zona_especifica": "$500-1500/mes para ${businessInfo.tamano} en ${businessInfo.ubicacion}",
      "evaluacion": "Dentro del rango",
      "analisis": "El valor de alquiler de $500 se encuentra dentro del rango esperado para un ${businessInfo.tamano} en una zona comercial/residencial de ${businessInfo.ubicacion}. Este valor es competitivo y representa una ventaja en la estructura de costos fijos."
    },
    "Internet": {
      "valor_recibido": "$80",
      "rango_estimado_zona_especifica": "$30-100/mes para fibra óptica empresarial",
      "evaluacion": "Fuera del rango",
      "analisis": "El costo de internet de $80 mensuales está por encima del promedio del mercado para paquetes de fibra óptica de grado empresarial en ${businessInfo.ubicacion}. Los planes competitivos suelen oscilar entre $45 y $70 para empresas."
    }
  },
  "riesgos_identificados": [
    {
      "nombre": "Sobrecosto por Clasificación Regulatoria Errónea o Ineficiente",
      "causa": "El costo de Bomberos está muy por encima del promedio del mercado, lo que sugiere una posible clasificación errónea de la actividad o un error en el cálculo del valor.",
      "probabilidad": "Alta",
      "impacto": "Erosión significativa y recurrente de la rentabilidad debido a pagos regulatorios excesivos. Riesgo de multas si la base de cálculo es incorrecta.",
      "consecuencias": "Pérdidas anuales estimadas de $240 a $300 solo en el rubro de Bomberos si el costo real es el promedio de mercado."
    },
    {
      "nombre": "Ineficiencia en la Contratación y Gestión de Servicios de Telecomunicaciones",
      "causa": "El costo de Internet de $80 mensuales está 'Fuera del rango' superior del mercado en ${businessInfo.ubicacion} para un servicio estándar de fibra óptica empresarial.",
      "probabilidad": "Alta",
      "impacto": "Reducción directa del margen operativo y del capital disponible para reinversión. Se está pagando más por un servicio que probablemente podría obtenerse a un costo menor.",
      "consecuencias": "Pérdida de entre $10 y $25 mensuales, lo que se traduce en $120 a $300 anuales en un costo fijo fácilmente optimizable."
    }
  ]
}

IMPORTANTE: 
1. Analiza cada costo recibido comparándolo con los rangos de mercado
2. Identifica riesgos específicos basados en costos fuera de rango
3. Proporciona análisis detallado para cada costo
4. Usa el formato exacto mostrado arriba`;
  }

  /**
   * Genera el prompt para análisis final con plan de acción específico
   */
  generateFinalAnalysisPrompt(
    costs: Array<{ name: string; amount: string }>,
    businessInfo: { tipoNegocio: string; tamano: string; ubicacion: string },
    previousResults: any
  ): string {
    const listaCostos = costs
      .map(c => c.name && c.amount ? `${c.name.trim()}: $${c.amount}` : null)
      .filter(Boolean)
      .join('\n');

    return `Basado en el análisis previo, genera un plan de acción específico para ${businessInfo.tipoNegocio} (${businessInfo.tamano}) en ${businessInfo.ubicacion}.

Costos analizados: ${listaCostos}

Genera un plan de acción detallado con acciones específicas, prioridades, plazos e inversiones estimadas.

Responde SOLO JSON con estructura EXACTA:

{
  "plan_accion": {
    "Auditoría Urgente y Reclasificación de Tasas de Bomberos y ARCSA": [
      {
        "descripcion": "Contactar al Cuerpo de Bomberos de ${businessInfo.ubicacion} para obtener el desglose y la justificación del costo de $30 mensuales, verificando la clasificación de riesgo de la actividad y el cálculo de la tasa anual.",
        "prioridad": "Crítica",
        "plazo": "Inmediato",
        "inversion": "$0 (tiempo propio para gestión y consulta)",
        "impacto": "Reducción potencial de $20-$25 mensuales ($240-$300 anuales) en la tasa de Bomberos si se identifica un error. Claridad sobre la necesidad de ARCSA, evitando pagos innecesarios."
      }
    ],
    "Optimización del Costo de Internet Mediante Renegociación o Cambio de Proveedor": [
      {
        "descripcion": "Realizar un estudio de mercado comparativo de al menos 3 proveedores de internet en ${businessInfo.ubicacion}, buscando planes de fibra óptica empresariales con velocidades comparables, pero a precios entre $45 y $70 mensuales.",
        "prioridad": "Alta",
        "plazo": "1-3 meses",
        "inversion": "$0 - $50 (costo potencial de instalación en caso de cambio de proveedor)",
        "impacto": "Ahorro proyectado de $10-$25 mensuales ($120-$300 anuales) sin comprometer la calidad del servicio, mejorando directamente el flujo de caja y la rentabilidad del negocio."
      }
    ],
    "Clarificación y Gestión Proactiva de Permisos Municipales": [
      {
        "descripcion": "Obtener un desglose detallado de todos los permisos y licencias que conforman el costo mensual, identificando el tipo de permiso, la autoridad emisora, la fecha de emisión y la fecha de renovación.",
        "prioridad": "Media",
        "plazo": "1-3 meses",
        "inversion": "$0 (tiempo propio para gestión y consulta)",
        "impacto": "Mayor transparencia financiera, prevención de pagos innecesarios y mitigación de riesgos de multas por omisión. Potencial de ahorro de $5-$10 mensuales si se identifican permisos no obligatorios."
      }
    ]
  }
}

IMPORTANTE:
1. Genera acciones específicas y ejecutables
2. Incluye prioridades claras (Crítica, Alta, Media)
3. Especifica plazos realistas
4. Estima inversiones requeridas
5. Describe impactos esperados cuantificables
6. Usa el formato exacto mostrado arriba`;
  }
}
