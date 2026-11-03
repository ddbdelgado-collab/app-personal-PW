import { IsString, IsNotEmpty, IsOptional, IsNumber, IsInt, Min, IsPositive, IsUrl } from 'class-validator';

export class CreateProductoDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre del producto es requerido' })
    nombre!: string;

    @IsString()
    @IsNotEmpty({ message: 'La descripción es requerida' })
    descripcion!: string;

    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número válido' })
    @IsPositive({ message: 'El precio debe ser mayor a 0' })
    @IsNotEmpty({ message: 'El precio es requerido' })
    precio!: number;

    @IsInt({ message: 'El stock debe ser un número entero' })
    @Min(0, { message: 'El stock no puede ser negativo' })
    @IsOptional()
    stock?: number;

    @IsUrl({}, { message: 'Debe ser una URL válida' })
    @IsOptional()
    imagen_url?: string;

    @IsInt()
    @IsPositive()
    @IsNotEmpty({ message: 'El ID de la categoría es requerido' })
    id_categoria!: number;
}
