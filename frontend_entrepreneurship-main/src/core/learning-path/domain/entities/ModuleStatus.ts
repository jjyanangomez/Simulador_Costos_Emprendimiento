// Fichero: src/core/learning-path/domain/entities/ModuleStatus.ts

/**
 * Objeto que contiene los posibles estados de un módulo como constantes.
 * Usamos 'as const' para que TypeScript infiera los tipos más específicos (literales de string)
 * y los haga de solo lectura (readonly). Esto reemplaza al 'enum' para ser 100% compatible
 * con todas las herramientas de compilación modernas como Vite/esbuild.
 * Este objeto SÍ existe en el JavaScript final, por lo que podemos usarlo en nuestro código.
 */
export const ModuleStatus = {
  Completed: 'COMPLETED',
  InProgress: 'IN_PROGRESS',
  Locked: 'LOCKED',
} as const;

/**
 * Tipo de Unión de Strings derivado del objeto ModuleStatus.
 * Extrae los VALORES del objeto ('COMPLETED', 'IN_PROGRESS', 'LOCKED')
 * y los une en un nuevo tipo llamado 'ModuleStatus'.
 * Este tipo se usa para la verificación estática y es COMPLETAMENTE BORRADO
 * en el momento de la compilación, cumpliendo la regla 'erasableSyntaxOnly'.
 */
export type ModuleStatus = typeof ModuleStatus[keyof typeof ModuleStatus];