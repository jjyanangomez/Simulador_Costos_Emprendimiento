import type { IAuthRepository } from "../../domain/repositories/IAuthRepository";

export class LoginUser {
  private readonly repository: IAuthRepository;

  constructor(repository: IAuthRepository) {
    this.repository = repository;
  }

  async execute(email: string, password: string) {
    console.log("Núcleo: Ejecutando caso de uso 'LoginUser'");

    if (!email || !password) {
      console.error("Núcleo: Email o password no pueden estar vacíos.");
      return null;
    }

    const user = await this.repository.login(email, password);

    if (user) {
      console.log("Núcleo: Login exitoso para el usuario", user.full_name);
    } else {
      console.log("Núcleo: Credenciales inválidas.");
    }

    return user;
  }
}
