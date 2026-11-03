import { PartialType } from '@nestjs/swagger';
import { CreateItemCarritoDto } from './create-items_carrito.dto';

export class UpdateItemsCarritoDto extends PartialType(CreateItemCarritoDto) {}
