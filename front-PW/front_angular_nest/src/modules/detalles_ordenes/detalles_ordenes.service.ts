import { Injectable } from '@nestjs/common';
import { CreateDetallesOrdeneDto } from './dto/create-detalles_ordene.dto';
import { UpdateDetallesOrdeneDto } from './dto/update-detalles_ordene.dto';

@Injectable()
export class DetallesOrdenesService {
  create(createDetallesOrdeneDto: CreateDetallesOrdeneDto) {
    return 'This action adds a new detallesOrdene';
  }

  findAll() {
    return `This action returns all detallesOrdenes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detallesOrdene`;
  }

  update(id: number, updateDetallesOrdeneDto: UpdateDetallesOrdeneDto) {
    return `This action updates a #${id} detallesOrdene`;
  }

  remove(id: number) {
    return `This action removes a #${id} detallesOrdene`;
  }
}
