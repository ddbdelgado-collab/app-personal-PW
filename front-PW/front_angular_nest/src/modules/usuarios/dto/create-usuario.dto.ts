import { IsString, IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUsuarioDto{
    @IsEmail({}, { message: 'El email debe ser un correo electrónico válido' })
    @IsNotEmpty({ message: 'El email es requerido' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password!: string;

    @IsString()
    @IsNotEmpty({ message: 'El nombre es requerido' })
    nombre!: string;

    @IsString()
    @IsNotEmpty({ message: 'El apellido es requerido' })
    apellido!: string;

    @IsString()
    @IsNotEmpty({ message: 'El teléfono es requerido' })
    telefono!: string;

    @IsString()
    @IsOptional()
    rol?: string;
}