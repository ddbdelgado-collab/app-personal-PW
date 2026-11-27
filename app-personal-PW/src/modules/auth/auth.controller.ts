import { Controller, Post, Body } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registrar un nuevo usuario (email = cédula, email1 = correo)' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @Post('register')
  registerUser(@Body() userObj: RegisterAuthDto) {
    return this.authService.register(userObj);
  }

  @ApiOperation({ summary: 'Iniciar sesión con cédula y contraseña' })
  @ApiResponse({ status: 200, description: 'Retorna token JWT' })
  @Post('login')
  login(@Body() credenciales: LoginAuthDto) {
    return this.authService.login(credenciales);
  }

  @ApiOperation({ summary: 'Solicitar enlace de recuperación de contraseña por correo (email1)' })
  @ApiResponse({ status: 200, description: 'Correo de recuperación enviado' })
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.solicitarRecuperacionPassword(dto);
  }

  @ApiOperation({ summary: 'Restablecer contraseña mediante token seguro' })
  @ApiResponse({ status: 200, description: 'Contraseña restablecida exitosamente' })
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.restablecerPassword(dto);
  }
}
