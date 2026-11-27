import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'El token de recuperación es obligatorio' })
  @IsString()
  token!: string;

  @IsNotEmpty({ message: 'La nueva contraseña es obligatoria' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`¡¿]).+$/, {
    message: 'La contraseña debe incluir al menos 1 letra mayúscula, 1 número y 1 carácter especial',
  })
  password_hash!: string;
}
