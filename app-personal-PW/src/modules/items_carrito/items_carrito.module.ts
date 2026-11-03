import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsCarritoController } from './items_carrito.controller';
import { ItemsCarritoService } from './items_carrito.service';
import { ItemsCarrito } from './entities/items_carrito.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemsCarrito])],
  controllers: [ItemsCarritoController],
  providers: [ItemsCarritoService],
})
export class ItemsCarritoModule {}
