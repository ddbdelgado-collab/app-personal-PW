import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenesController } from './ordenes.controller';
import { OrdenesService } from './ordenes.service';
import { Ordenes } from './entities/orden.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ordenes])],
  controllers: [OrdenesController],
  providers: [OrdenesService],
})
export class OrdenesModule {}
