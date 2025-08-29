export class User {
  usuarioId?: number;
  nombreCompleto: string;
  email: string;
  passwordHash: string;
  fechaRegistro?: Date;

  constructor(
    nombreCompleto: string,
    email: string,
    passwordHash: string,
    usuarioId?: number,
    fechaRegistro?: Date,
  ) {
    this.nombreCompleto = nombreCompleto;
    this.email = email;
    this.passwordHash = passwordHash;
    this.usuarioId = usuarioId;
    this.fechaRegistro = fechaRegistro;
  }
}
