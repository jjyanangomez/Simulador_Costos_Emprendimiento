// import type { BaseResponseApi } from "../../../../shared/domain/entities/BaseResponseApi";
// import type { BusinessDTO } from "../../application/dto/BusinessDTO";
import type { Business } from "../../domain/entities/Business";
import type {
  IBusinessRepository,
  CreateBusinessData,
} from "../../domain/repositories/IBusinessRepository";

// Datos de prueba
const mockBusinesses: Business[] = [
  /**
  {
    id: 1,
    userId: 1,
    businessType: "Restaurante",
    name: "La Buena Mesa",
    location: "Calle Falsa 123",
    sizeId: 2,
    createdAt: new Date(),
    // Nuevos atributos:
    icon: "fas fa-utensils", // Icono para restaurantes
    color: "primary-500", // Usa el color primario de tu tema
    progress: 78, // Progreso en porcentaje
    completedModules: 7,
    totalModules: 9,
  },
  {
    id: 2,
    userId: 1,
    businessType: "Tienda de Ropa",
    name: "Modas Elegantes",
    location: "Avenida Siempre Viva 742",
    sizeId: 1,
    createdAt: new Date(),
    // Nuevos atributos:
    icon: "fas fa-tshirt", // Icono para tiendas de ropa
    color: "secondary-500", // Usa el color secundario
    progress: 25,
    completedModules: 2,
    totalModules: 8,
  },
  {
    id: 3,
    userId: 2,
    businessType: "Cafetería",
    name: "El Rincón del Café",
    location: "Plaza Mayor 5",
    sizeId: 1,
    createdAt: new Date(),
    // Nuevos atributos:
    icon: "fas fa-coffee", // Icono para cafeterías
    color: "accent-500", // Usa un color de acento
    progress: 100,
    completedModules: 5,
    totalModules: 5,
  },
  {
    id: 4,
    userId: 1,
    businessType: "Ferretería",
    name: "El Tornillo Feliz",
    location: "Bulevar de los Sueños Rotos 404",
    sizeId: 3,
    createdAt: new Date(),
    // Nuevos atributos:
    icon: "fas fa-tools", // Icono para ferreterías
    color: "neutral-700",
    progress: 0,
    completedModules: 0,
    totalModules: 10,
  }, */
];

export class BusinessRepositoryMock implements IBusinessRepository {
  async createBusiness(data: CreateBusinessData): Promise<Business> {
    console.log("Adaptador (Mock): Creando negocio con datos:", data);
    const newId = mockBusinesses.length + 1;
    const newBusiness: Business = {
      id: newId,
      createdAt: new Date(),
      progress: 0,
      completedModules: 0,
      totalModules: 10, // Un valor por defecto
      ...data,
    };
    mockBusinesses.push(newBusiness);
    return Promise.resolve(newBusiness);
  }

  async getAll(): Promise<Business[]> {
    console.log("Adaptador de Salida (Mock): Obteniendo todos los negocios.");
    // Simulamos una demora de red
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBusinesses);
      }, 200);
    });
  }

  async getById(id: number): Promise<Business | null> {
    console.log("Adaptador de Salida (Mock): Obteniendo negocio por ID:", id);
    const business = mockBusinesses.find(b => b.id === id);
    return Promise.resolve(business || null);
  }

  async getByUserId(userId: number): Promise<Business[]> {
    console.log("Adaptador de Salida (Mock): Obteniendo negocios por usuario ID:", userId);
    const userBusinesses = mockBusinesses.filter(b => b.userId === userId);
    return Promise.resolve(userBusinesses);
  }
}
