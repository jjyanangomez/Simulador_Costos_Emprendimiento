// Fichero: src/core/learning-path/domain/entities/Module.ts
import { ModuleStatus } from './ModuleStatus';

/**
 * Interfaz de la Entidad de Dominio "Module".
 * Representa un módulo en su forma más pura y limpia, con nombres
 * de propiedades convenientes para la lógica de la aplicación (camelCase).
 * Solo contiene los datos estrictamente necesarios para el negocio en este contexto.
 */
export interface Module {
  id: number;
  name: string;
  order: number;
  status: ModuleStatus;
}