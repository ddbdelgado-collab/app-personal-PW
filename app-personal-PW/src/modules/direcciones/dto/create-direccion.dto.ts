import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDireccionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  calle_principal!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  calle_secundaria?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ciudad!: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  referencia?: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id_usuario!: number;
}