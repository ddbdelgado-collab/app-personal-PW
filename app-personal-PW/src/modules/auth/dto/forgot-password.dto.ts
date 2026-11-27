import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class ForgotPasswordDto {
  /**
   * El correo electrónico del usuario está almacenado en la columna 'email1' de la BD.
   */
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsString()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/, {
    message: 'Debe ingresar un correo electrónico válido (ej. usuario@dominio.com)',
  })
  email1!: string;

  @IsOptional()
  @IsString()
  correo?: string;
}
