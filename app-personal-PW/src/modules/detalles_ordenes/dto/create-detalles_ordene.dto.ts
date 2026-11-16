import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDetalleOrdenDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  cantidad!: number;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Min(0)
  precio_unitario!: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id_orden!: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id_producto!: number;
}