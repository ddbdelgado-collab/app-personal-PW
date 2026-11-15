import { IsNotEmpty, MaxLength, MinLength, IsString } from "class-validator";
import { Usuario } from "../../usuarios/interfaces/usuarios.interface";

// Asegúrate de que tu interfaz 'Usuario' tenga la propiedad 'cedula'
export class LoginAuthDto implements Pick<Usuario, 'cedula' | 'password_hash'> {
    
    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    @MaxLength(10)
    cedula!: string;

    @MinLength(6)
    @MaxLength(20)
    @IsNotEmpty()
    password_hash!: string;
}