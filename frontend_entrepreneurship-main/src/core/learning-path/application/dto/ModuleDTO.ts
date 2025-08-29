// Fichero: src/core/learning-path/application/dto/ModuleDTO.ts

/**
 * Data Transfer Object (DTO) para un Módulo.
 * Su estructura refleja fielmente el modelo de Prisma / Base de Datos.
 * Se utiliza para transferir datos entre la capa de infraestructura y la de aplicación,
 * evitando que el dominio se contamine con la estructura de la base de datos.
 * Incluimos un campo "status" simulando que la API ya hizo el cálculo de progreso.
 */
export interface ModuleDTO {
  id_modulo: number;
  id_aprendizaje: number;
  orden_modulo: number | null;
  nombre_modulo: string;
  titulo_conteido: string | null;
  concepto: string;
  recurso_interactivo: string | null;
  // En un caso real, el estado podría venir de una consulta compleja (JOIN con NegocioProgresoPaso).
  // Para el mock, lo añadimos directamente para simular el resultado de esa consulta.
  status: 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED';
}