import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DireccionesController } from './direcciones.controller';
import { DireccionesService } from './direcciones.service';
import { Direcciones } from './entities/direccion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Direcciones])],
  controllers: [DireccionesController],
  providers: [DireccionesService],
})
export class DireccionesModule {}
