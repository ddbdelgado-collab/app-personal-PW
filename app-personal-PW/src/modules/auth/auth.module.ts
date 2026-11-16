import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt'; // Cambiado a la importación estándar
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';

// IMPORTANTE: Ajusta esta ruta a donde esté realmente tu entidad Usuario
import { Usuarios } from '../usuarios/entities/usuario.entity'; 

@Module({
  imports: [
    // Registramos la entidad Usuario para que NestJS pueda inyectar su repositorio
    TypeOrmModule.forFeature([Usuarios]),
    
    JwtModule.register({
      secret: 'MI_CODIGO_SECRETO',
      signOptions: { expiresIn: '1h' }
    }),
    TypeOrmModule.forFeature([Usuarios])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
