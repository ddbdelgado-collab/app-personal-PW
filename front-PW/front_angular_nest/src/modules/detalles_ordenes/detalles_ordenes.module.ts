import { Module } from '@nestjs/common';
import { DetallesOrdenesService } from './detalles_ordenes.service';
import { DetallesOrdenesController } from './detalles_ordenes.controller';

@Module({
  controllers: [DetallesOrdenesController],
  providers: [DetallesOrdenesService],
})
export class DetallesOrdenesModule {}
