import { PartialType } from '@nestjs/swagger';
import { CreateDetallesOrdeneDto } from './create-detalles_ordene.dto';

export class UpdateDetallesOrdeneDto extends PartialType(CreateDetallesOrdeneDto) {}
