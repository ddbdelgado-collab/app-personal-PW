import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from '../usuarios/entities/usuario.entity';
import { ConfigModule } from '../../config/config.module';
import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Usuarios]),
    JwtModule.register({
      secret: 'MI_CODIGO_SECRETO',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailService],
  exports: [AuthService],
})
export class AuthModule {}
