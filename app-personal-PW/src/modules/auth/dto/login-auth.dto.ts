import { IsNotEmpty, MaxLength, MinLength, IsString, IsOptional } from "class-validator";
import { Usuario } from "../../usuarios/interfaces/usuarios.interface";

export class LoginAuthDto implements Pick<Usuario, 'cedula' | 'password_hash'> {
    
    @IsOptional()
    @IsString()
    @MinLength(10, { message: 'La cédula debe tener 10 dígitos' })
    @MaxLength(10, { message: 'La cédula debe tener 10 dígitos' })
    cedula!: string;

    // En caso de que el cliente envíe la cédula bajo la clave 'email' (nombre de la columna en BD)
    @IsOptional()
    @IsString()
    email?: string;

    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @MaxLength(100, { message: 'La contraseña no puede exceder 100 caracteres' })
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @IsString()
    password_hash!: string;
}
