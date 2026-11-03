import { IsString, IsNotEmpty, IsOptional, IsInt, IsPositive } from 'class-validator';

export class CreateDireccionDto {
    @IsString()
    @IsNotEmpty({ message: 'La calle principal es requerida' })
    calle_principal!: string;

    @IsString()
    @IsNotEmpty({ message: 'La calle secundaria es requerida' })
    calle_secundaria!: string;

    @IsString()
    @IsNotEmpty({ message: 'La ciudad es requerida' })
    ciudad!: string;

    @IsString()
    @IsOptional()
    referencia?: string;

    @IsInt()
    @IsPositive()
    @IsNotEmpty({ message: 'El ID del usuario es requerido para asociar la dirección' })
    id_usuario!: number;
}