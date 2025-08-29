import type { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import type { User } from "../../domain/entities/User";

export class AuthRepositoryMock implements IAuthRepository {
  async login(email: string, password: string): Promise<User | null> {
    console.log(
      `Adaptador de Salida (MockAuthService): Intentando login con ${email}`
    );

    if (password === password) {
      const mockUser: User = {
        id: 1,
        full_name: "Usuario de Prueba",
        email: email,
        password: password,
        created_at: null,
      };
      console.log(
        "Adaptador de Salida (MockAuthService): Login simulado con éxito."
      );
      return Promise.resolve(mockUser);
    }

    console.log(
      "Adaptador de Salida (MockAuthService): Contraseña incorrecta."
    );
    return Promise.resolve(null);
  }
}
