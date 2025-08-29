import { Injectable } from '@nestjs/common';
import { Usuarios as UserPrismaModel } from '@prisma/client';
import { User } from '../entities/user.entity';

@Injectable()
export class UserMapper {
    toDomain(prismaUser: UserPrismaModel): User {
        console.log('🔄 [BACKEND-MAPPER] Mapeando datos de Prisma a dominio (Usuario):', prismaUser);
        
        const mappedUser = new User(
            prismaUser.nombre_completo,
            prismaUser.email,
            prismaUser.password_hash,
            prismaUser.usuario_id,
            prismaUser.fecha_registro === null ? undefined : prismaUser.fecha_registro
        );
        
        console.log('✅ [BACKEND-MAPPER] Datos de usuario mapeados exitosamente:', mappedUser);
        
        return mappedUser;
    }
}
