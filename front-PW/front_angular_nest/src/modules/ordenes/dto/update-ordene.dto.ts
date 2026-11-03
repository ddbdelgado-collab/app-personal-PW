import { PartialType } from '@nestjs/swagger';
import { CreateOrdenDto } from './create-orden.dto';
import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateOrdenDto extends PartialType(CreateOrdenDto) {
    @IsString()
    @IsOptional()
    @IsIn(['pendiente', 'pagada', 'enviada', 'cancelada'], {
        message: 'El estado solo puede ser: pendiente, pagada, enviada o cancelada'
    })
    estado?: string;
}
