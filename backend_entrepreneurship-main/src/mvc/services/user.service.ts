import { Injectable, NotFoundException, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { UserMapper } from '../models/mappers/user.mapper';
import { User } from '../models/entities/user.entity';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { LoginUserDto } from '../models/dto/login-user.dto';
import { ResetPasswordDto } from '../models/dto/reset-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: UserMapper,
  ) {}

  async register(createDto: CreateUserDto): Promise<User> {
    // Verificar si el email ya existe
    const existingUser = await this.prisma.usuarios.findUnique({
      where: { email: createDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(createDto.password, 10);

    // Crear el usuario
    const newUserPrisma = await this.prisma.usuarios.create({
      data: {
        nombre_completo: createDto.nombreCompleto,
        email: createDto.email,
        password_hash: passwordHash,
        fecha_nacimiento: createDto.fechaNacimiento || new Date('1990-01-01'), // Campo requerido
      },
    });

    const mappedUser = this.mapper.toDomain(newUserPrisma);
    return mappedUser;
  }

  async login(loginDto: LoginUserDto): Promise<User> {
    // Buscar usuario por email
    const userPrisma = await this.prisma.usuarios.findUnique({
      where: { email: loginDto.email },
    });

    if (!userPrisma) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(loginDto.password, userPrisma.password_hash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const mappedUser = this.mapper.toDomain(userPrisma);
    return mappedUser;
  }

  async findById(id: number): Promise<User> {
    const userPrisma = await this.prisma.usuarios.findUnique({
      where: { usuario_id: id },
    });

    if (!userPrisma) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    const mappedUser = this.mapper.toDomain(userPrisma);
    return mappedUser;
  }

  async findAll(): Promise<User[]> {
    const usersPrisma = await this.prisma.usuarios.findMany();
    const mappedUsers = usersPrisma.map(this.mapper.toDomain);
    return mappedUsers;
  }

  async findByEmail(email: string): Promise<{ exists: boolean; message: string }> {
    const userPrisma = await this.prisma.usuarios.findUnique({
      where: { email: email },
    });

    if (userPrisma) {
      console.log('Usuario encontrado:', userPrisma);
      return { exists: true, message: 'Usuario encontrado' };
    } else {
      return { exists: false, message: 'Usuario no encontrado con ese email' };
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    // Verificar que las contraseñas coincidan
    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Buscar usuario por email
    const userPrisma = await this.prisma.usuarios.findUnique({
      where: { email: resetPasswordDto.email },
    });

    if (!userPrisma) {
      throw new NotFoundException('Usuario no encontrado con ese email');
    }

    // Hashear la nueva contraseña
    const newPasswordHash = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    // Actualizar la contraseña en la base de datos
    await this.prisma.usuarios.update({
      where: { email: resetPasswordDto.email },
      data: { password_hash: newPasswordHash },
    });

    return { message: 'Contraseña actualizada exitosamente' };
  }
}
