import { apiClient } from "../../../../shared/infrastructure/http/api-client";

console.log('🔧 [FRONTEND] AuthRepositoryApi cargado correctamente');

export interface User {
  usuarioId: number;
  nombreCompleto: string;
  email: string;
  passwordHash: string;
  fechaRegistro?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombreCompleto: string;
  email: string;
  password: string;
}

export interface AuthRepository {
  login(credentials: LoginRequest): Promise<User>;
  register(userData: RegisterRequest): Promise<User>;
}

export class AuthRepositoryApi implements AuthRepository {
  constructor() {
    console.log('🔧 [FRONTEND] AuthRepositoryApi instanciado');
  }

  async login(credentials: LoginRequest): Promise<User> {
    try {
      console.log('🔐 [FRONTEND] Intentando login con:', credentials.email);
      
      const response = await apiClient.post<User>('/usuarios/login', credentials);
      
      console.log('✅ [FRONTEND] Login exitoso:', response);
      
      return response;
    } catch (error) {
      console.error('💥 [FRONTEND] Error en login:', error);
      throw new Error('Credenciales inválidas. Inténtalo de nuevo.');
    }
  }

  async register(userData: RegisterRequest): Promise<User> {
    try {
      console.log('👤 [FRONTEND] Intentando registro con:', userData);
      
      const response = await apiClient.post<User>('/usuarios/registro', userData);
      
      console.log('✅ [FRONTEND] Registro exitoso:', response);
      
      return response;
    } catch (error) {
      console.error('💥 [FRONTEND] Error en registro:', error);
      if (error instanceof Error && error.message.includes('409')) {
        throw new Error('El email ya está registrado. Intenta con otro email.');
      }
      throw new Error('Error al registrar usuario. Inténtalo de nuevo.');
    }
  }
}
