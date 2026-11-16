import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrdenDto {
  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  total!: number;

  @ApiProperty()
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  estado!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  direccion_envio_texto?: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id_usuario!: number;
}