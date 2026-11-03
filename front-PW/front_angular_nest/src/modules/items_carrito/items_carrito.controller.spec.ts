import { Test, TestingModule } from '@nestjs/testing';
import { ItemsCarritoController } from './items_carrito.controller';
import { ItemsCarritoService } from './items_carrito.service';

describe('ItemsCarritoController', () => {
  let controller: ItemsCarritoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsCarritoController],
      providers: [ItemsCarritoService],
    }).compile();

    controller = module.get<ItemsCarritoController>(ItemsCarritoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
