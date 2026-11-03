import { Test, TestingModule } from '@nestjs/testing';
import { DetallesOrdenesController } from './detalles_ordenes.controller';
import { DetallesOrdenesService } from './detalles_ordenes.service';

describe('DetallesOrdenesController', () => {
  let controller: DetallesOrdenesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetallesOrdenesController],
      providers: [DetallesOrdenesService],
    }).compile();

    controller = module.get<DetallesOrdenesController>(DetallesOrdenesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
