import { Test, TestingModule } from '@nestjs/testing';
import { DetallesOrdenesService } from './detalles_ordenes.service';

describe('DetallesOrdenesService', () => {
  let service: DetallesOrdenesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetallesOrdenesService],
    }).compile();

    service = module.get<DetallesOrdenesService>(DetallesOrdenesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
