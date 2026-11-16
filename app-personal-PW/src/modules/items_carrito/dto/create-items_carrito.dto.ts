import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemCarritoDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  cantidad!: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id_usuario!: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id_producto!: number;
}
