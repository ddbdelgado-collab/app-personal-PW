import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from '../usuarios/entities/usuario.entity';
import { hash, compare } from 'bcrypt';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Usuarios)
    private usuarioRepository: Repository<Usuarios>,
  ) {}

  async funRegister(objUser: RegisterAuthDto) {
    const { password_hash } = objUser; // capturamos solo password de todo el objeto
    const plainToHash = await hash(password_hash, 12); // para encriptar la contraseña
    
    objUser = { ...objUser, password_hash: plainToHash }; 
    // almacena todos los datos excepto el password que fue sacado y guarda un nuevo password

    return this.usuarioRepository.save(objUser); // para guardar en la BDD
  }

  async login(credenciales: LoginAuthDto) {
    const { cedula, password_hash } = credenciales;

    // 1. Buscar usuario
    const usuarioDb = await this.usuarioRepository.findOne({ 
      where: { cedula: cedula } 
    });

    if (!usuarioDb) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Verificar bloqueo permanente (si un admin lo desactivó)
    if (!usuarioDb.activo) {
      throw new ForbiddenException('Cuenta inactiva. Por favor, contacta al administrador.');
    }

    // 3. VERIFICAR BLOQUEO TEMPORAL DE 15 MINUTOS
    if (usuarioDb.bloqueado_hasta) {
      const ahora = new Date();
      
      if (usuarioDb.bloqueado_hasta > ahora) {
        // Aún no pasan los 15 minutos. Calculamos cuánto falta para mostrarle al usuario.
        const minutosRestantes = Math.ceil((usuarioDb.bloqueado_hasta.getTime() - ahora.getTime()) / 60000);
        throw new ForbiddenException(`Cuenta bloqueada por múltiples intentos. Inténtalo de nuevo en ${minutosRestantes} minutos.`);
      } else {
        // ¡YA PASARON LOS 15 MINUTOS!
        // 1. Regresamos los intentos a 0
        usuarioDb.intentos_fallidos = 0;
        // 2. Quitamos la fecha de bloqueo
        usuarioDb.bloqueado_hasta = null;
        
        // 3. GUARDAMOS ESTE REINICIO EN LA BASE DE DATOS INMEDIATAMENTE
        await this.usuarioRepository.save(usuarioDb);
      }
    }

    // 4. Comparar contraseña
    const isPasswordValid = await compare(password_hash, usuarioDb.password_hash);

    if (!isPasswordValid) {
      usuarioDb.intentos_fallidos += 1;
      
      if (usuarioDb.intentos_fallidos >= 3) {
        // SUMAR 15 MINUTOS A LA HORA ACTUAL
        const fechaDesbloqueo = new Date();
        fechaDesbloqueo.setMinutes(fechaDesbloqueo.getMinutes() + 1);
        
        usuarioDb.bloqueado_hasta = fechaDesbloqueo;
        await this.usuarioRepository.save(usuarioDb);
        
        throw new ForbiddenException('Cuenta bloqueada tras 3 intentos fallidos. Inténtalo en 1 minuto.');
      } else {
        // Actualizar contador de intentos
        await this.usuarioRepository.save(usuarioDb);
        throw new UnauthorizedException(`Credenciales incorrectas. Intento ${usuarioDb.intentos_fallidos} de 3.`);
      }
    }

    // 5. Si la contraseña es correcta, limpiamos errores y bloqueos
    if (usuarioDb.intentos_fallidos > 0 || usuarioDb.bloqueado_hasta != null) {
      usuarioDb.intentos_fallidos = 0;
      usuarioDb.bloqueado_hasta = null;
      await this.usuarioRepository.save(usuarioDb);
    }

    // 6. Generar Token
    const payload = { cedula: usuarioDb.cedula, sub: usuarioDb.id_usuario };
    const token = this.jwtService.sign(payload);
    
    return { token: token };
  }
}