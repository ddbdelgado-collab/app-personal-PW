import { PartialType } from '@nestjs/swagger';
import { CreateDetalleOrdenDto } from './create-detalles_ordene.dto';

export class UpdateDetallesOrdeneDto extends PartialType(CreateDetalleOrdenDto) {}
