import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { Usuario } from "../../usuarios/interfaces/usuarios.interface";


export class LoginAuthDto implements Pick<Usuario, 'email' | 'password_hash'> {
    
    @IsNotEmpty()
    @IsEmail()
    email!: string;
    @MinLength(6)
    @MaxLength(20)
    @IsNotEmpty()
    password_hash!: string;
}