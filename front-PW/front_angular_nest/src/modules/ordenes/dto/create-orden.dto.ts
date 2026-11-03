import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateOrdenDto {
    @IsInt()
    @IsPositive()
    @IsNotEmpty({ message: 'El ID del usuario es requerido' })
    id_usuario!: number;

    @IsInt()
    @IsPositive()
    @IsNotEmpty({ message: 'El ID de la dirección de envío es requerido' })
    id_direccion!: number;
}
