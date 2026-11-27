import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from '../usuarios/entities/usuario.entity';
import { ConfigService } from '../../config/config.service';
import { MailService } from './mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Usuarios)
    private readonly usuarioRepository: Repository<Usuarios>,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Garantiza que las columnas requeridas ('email1', 'intentos_fallidos', 'bloqueado_hasta')
   * existan en la tabla 'usuarios' de PostgreSQL.
   */
  async onModuleInit() {
    try {
      await this.usuarioRepository.query(
        `ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "email1" character varying;`,
      );
      await this.usuarioRepository.query(
        `ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "intentos_fallidos" integer NOT NULL DEFAULT 0;`,
      );
      await this.usuarioRepository.query(
        `ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "bloqueado_hasta" timestamp NULL;`,
      );
    } catch (error: any) {
      this.logger.warn(`Verificación automática de columnas en 'usuarios': ${error?.message}`);
    }
  }

  /**
   * Registro de usuario aplicando el mapeo de base de datos:
   * - Cédula -> se guarda en la columna 'email' (propiedad 'cedula' en la entidad)
   * - Correo Electrónico -> se guarda en la columna 'email1' (propiedad 'email1' en la entidad)
   */
  async register(userObj: RegisterAuthDto) {
    const cedula = (userObj.email || userObj.cedula || '').trim();
    const correoElectronico = (userObj.email1 || '').trim().toLowerCase();

    if (!cedula) {
      throw new BadRequestException('La cédula es obligatoria');
    }

    // 1. Verificar si la cédula (columna 'email') ya está registrada
    const existeCedula = await this.usuarioRepository.findOne({
      where: { cedula },
    });

    if (existeCedula) {
      throw new ConflictException('Ya existe un usuario registrado con este número de cédula.');
    }

    // 2. Verificar si el correo electrónico (columna 'email1') ya está registrado
    const existeCorreo = await this.usuarioRepository
      .createQueryBuilder('u')
      .where('LOWER(u.email1) = LOWER(:correo)', { correo: correoElectronico })
      .getOne();

    if (existeCorreo) {
      throw new ConflictException('Ya existe un usuario registrado con este correo electrónico.');
    }

    // 3. Encriptar la contraseña con bcrypt
    const saltRounds = 10;
    const passwordHasheada = await bcrypt.hash(userObj.password_hash, saltRounds);

    // 4. Crear y guardar la entidad con el mapeo exacto hacia la BD
    const nuevoUsuario = this.usuarioRepository.create({
      cedula, // Mapeado a columna 'email' en la BD
      email1: correoElectronico, // Mapeado a columna 'email1' en la BD
      nombre: userObj.nombre.trim(),
      apellido: userObj.apellido.trim(),
      telefono: userObj.telefono.trim(),
      password_hash: passwordHasheada,
      rol: 'cliente',
      activo: true,
      intentos_fallidos: 0,
      bloqueado_hasta: null,
    });

    const usuarioGuardado = await this.usuarioRepository.save(nuevoUsuario);

    return {
      message: 'Usuario registrado exitosamente',
      usuario: {
        id_usuario: usuarioGuardado.id_usuario,
        nombre: usuarioGuardado.nombre,
        apellido: usuarioGuardado.apellido,
        telefono: usuarioGuardado.telefono,
        email: usuarioGuardado.cedula, // Columna 'email' (Cédula)
        email1: usuarioGuardado.email1, // Columna 'email1' (Correo Electrónico)
        rol: usuarioGuardado.rol,
      },
    };
  }

  async login(credenciales: LoginAuthDto) {
    const cedula = (credenciales.cedula || credenciales.email || '').trim();
    const { password_hash } = credenciales;

    if (!cedula) {
      throw new BadRequestException('Debe ingresar su número de cédula');
    }

    // 1. Buscar usuario por cédula (columna 'email')
    const usuarioDb = await this.usuarioRepository.findOne({
      where: { cedula },
    });

    if (!usuarioDb) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Verificar bloqueo permanente (si un admin lo desactivó)
    if (!usuarioDb.activo) {
      throw new ForbiddenException('Cuenta inactiva. Por favor, contacta al administrador.');
    }

    // 3. Verificar bloqueo temporal
    if (usuarioDb.bloqueado_hasta) {
      const ahora = new Date();

      if (usuarioDb.bloqueado_hasta > ahora) {
        const minutosRestantes = Math.ceil(
          (usuarioDb.bloqueado_hasta.getTime() - ahora.getTime()) / 60000,
        );
        throw new ForbiddenException(
          `Cuenta bloqueada por múltiples intentos. Inténtalo de nuevo en ${minutosRestantes} minuto(s).`,
        );
      } else {
        usuarioDb.intentos_fallidos = 0;
        usuarioDb.bloqueado_hasta = null;
        await this.usuarioRepository.save(usuarioDb);
      }
    }

    // 4. Comparar contraseña con bcrypt
    const isPasswordValid = await bcrypt.compare(password_hash, usuarioDb.password_hash);

    if (!isPasswordValid) {
      usuarioDb.intentos_fallidos += 1;

      if (usuarioDb.intentos_fallidos >= 3) {
        const fechaDesbloqueo = new Date();
        fechaDesbloqueo.setMinutes(fechaDesbloqueo.getMinutes() + 1);

        usuarioDb.bloqueado_hasta = fechaDesbloqueo;
        await this.usuarioRepository.save(usuarioDb);

        throw new ForbiddenException(
          'Cuenta bloqueada tras 3 intentos fallidos. Inténtalo en 1 minuto.',
        );
      } else {
        await this.usuarioRepository.save(usuarioDb);
        throw new UnauthorizedException(
          `Credenciales incorrectas. Intento ${usuarioDb.intentos_fallidos} de 3.`,
        );
      }
    }

    // 5. Si la contraseña es correcta, limpiamos errores y bloqueos
    if (usuarioDb.intentos_fallidos > 0 || usuarioDb.bloqueado_hasta != null) {
      usuarioDb.intentos_fallidos = 0;
      usuarioDb.bloqueado_hasta = null;
      await this.usuarioRepository.save(usuarioDb);
    }

    // 6. Generar Token JWT
    const payload = {
      cedula: usuarioDb.cedula,
      email: usuarioDb.cedula,
      email1: usuarioDb.email1,
      sub: usuarioDb.id_usuario,
      id_usuario: usuarioDb.id_usuario,
      rol: usuarioDb.rol,
    };
    const token = this.jwtService.sign(payload);

    return {
      token,
      usuario: {
        id_usuario: usuarioDb.id_usuario,
        nombre: usuarioDb.nombre,
        apellido: usuarioDb.apellido,
        cedula: usuarioDb.cedula,
        email1: usuarioDb.email1,
        rol: usuarioDb.rol,
      },
    };
  }

  /**
   * Genera un token JWT único de recuperación (15 min de validez y un solo uso)
   * y envía el correo electrónico al usuario buscando en la columna 'email1'.
   */
  async solicitarRecuperacionPassword(dto: ForgotPasswordDto) {
    const correo = (dto.email1 || dto.correo || '').trim().toLowerCase();

    const usuarioDb = await this.usuarioRepository
      .createQueryBuilder('u')
      .where('LOWER(u.email1) = LOWER(:correo)', { correo })
      .getOne();

    if (!usuarioDb) {
      throw new NotFoundException(
        'No existe ninguna cuenta registrada con ese correo electrónico.',
      );
    }

    if (!usuarioDb.activo) {
      throw new ForbiddenException('Esta cuenta se encuentra desactivada.');
    }

    // Huella de la contraseña actual para invalidar el token automáticamente tras su primer uso
    const pwdFingerprint = usuarioDb.password_hash.slice(-12);

    const resetToken = this.jwtService.sign(
      {
        sub: usuarioDb.id_usuario,
        email1: usuarioDb.email1,
        purpose: 'password-reset',
        pwdFingerprint,
      },
      { expiresIn: '15m' },
    );

    const frontendUrl = (
      this.configService.get('FRONTEND_URL') ||
      process.env.FRONTEND_URL ||
      'http://localhost:4200'
    )
      .replace(/['"]/g, '')
      .replace(/\/$/, '')
      .trim();

    const resetLink = `${frontendUrl}/auth/reset-password?token=${encodeURIComponent(resetToken)}`;

    const resultadoEnvio = await this.mailService.enviarCorreoRecuperacion(
      usuarioDb.email1,
      `${usuarioDb.nombre} ${usuarioDb.apellido}`,
      resetLink,
    );

    return {
      message: 'Se ha enviado un enlace de recuperación a tu correo electrónico.',
      modoEnvio: resultadoEnvio.modo,
    };
  }

  /**
   * Verifica el token de recuperación y actualiza la contraseña encriptada con bcrypt.
   */
  async restablecerPassword(dto: ResetPasswordDto) {
    let payload: any;
    try {
      payload = this.jwtService.verify(dto.token);
    } catch {
      throw new BadRequestException(
        'El enlace de recuperación es inválido o ha expirado. Por favor, solicita uno nuevo.',
      );
    }

    if (!payload || payload.purpose !== 'password-reset' || !payload.sub) {
      throw new BadRequestException('El token proporcionado no es válido para recuperación.');
    }

    const usuarioDb = await this.usuarioRepository.findOne({
      where: { id_usuario: Number(payload.sub) },
    });

    if (!usuarioDb) {
      throw new NotFoundException('El usuario asociado al enlace ya no existe.');
    }

    // Validar que el enlace no haya sido usado previamente
    const currentFingerprint = usuarioDb.password_hash.slice(-12);
    if (payload.pwdFingerprint && payload.pwdFingerprint !== currentFingerprint) {
      throw new BadRequestException(
        'Este enlace de recuperación ya fue utilizado anteriormente. Solicita uno nuevo si lo necesitas.',
      );
    }

    const esMismaPassword = await bcrypt.compare(dto.password_hash, usuarioDb.password_hash);
    if (esMismaPassword) {
      throw new BadRequestException(
        'La nueva contraseña no puede ser igual a tu contraseña anterior.',
      );
    }

    const nuevoHash = await bcrypt.hash(dto.password_hash, 10);
    usuarioDb.password_hash = nuevoHash;
    usuarioDb.intentos_fallidos = 0;
    usuarioDb.bloqueado_hasta = null;

    await this.usuarioRepository.save(usuarioDb);

    return {
      message: 'Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión.',
    };
  }
}
