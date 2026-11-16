import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetallesOrdenesService } from './detalles_ordenes.service';
import { CreateDetalleOrdenDto } from './dto/create-detalles_ordene.dto';
import { UpdateDetallesOrdeneDto } from './dto/update-detalles_ordene.dto';

@Controller('detalles-ordenes')
export class DetallesOrdenesController {
  constructor(private readonly detallesOrdenesService: DetallesOrdenesService) {}

  @Post()
  create(@Body() createDetalleOrdenDto: CreateDetalleOrdenDto) {
    return this.detallesOrdenesService.create(createDetalleOrdenDto);
  }

  @Get()
  findAll() {
    return this.detallesOrdenesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detallesOrdenesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetallesOrdeneDto: UpdateDetallesOrdeneDto) {
    return this.detallesOrdenesService.update(+id, updateDetallesOrdeneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detallesOrdenesService.remove(+id);
  }
}
