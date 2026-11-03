import { IsInt, IsNotEmpty, Min, IsPositive } from 'class-validator';

export class CreateItemCarritoDto {
    @IsInt()
    @Min(1, { message: 'La cantidad debe ser al menos 1' })
    @IsNotEmpty({ message: 'La cantidad es requerida' })
    cantidad!: number;

    @IsInt()
    @IsPositive()
    @IsNotEmpty({ message: 'El ID del producto es requerido' })
    id_producto!: number;

    @IsInt()
    @IsPositive()
    @IsNotEmpty({ message: 'El ID del usuario es requerido' })
    id_usuario!: number;
}
