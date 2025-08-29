export interface Business {
  id: number;
  userId: number;
  businessType: string;
  name: string;
  location: string;
  sizeId: number;
  createdAt: Date | null;

  // Nuevas propiedades inferidas de la tarjeta de UI
  icon: string; // ej: "fas fa-utensils"
  color: string; // ej: "green-500" o "blue-500"
  progress: number; // Un valor de 0 a 100
  totalModules?: number;
  completedModules?: number;
}
