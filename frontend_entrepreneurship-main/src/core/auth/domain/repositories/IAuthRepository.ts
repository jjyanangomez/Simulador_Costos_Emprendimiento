import type { User } from "../entities/User";

export interface IAuthRepository {
  login(email: string, password: string): Promise<User | null>;
}
