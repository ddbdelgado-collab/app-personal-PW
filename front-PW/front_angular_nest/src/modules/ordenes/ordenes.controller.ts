import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateOrdenDto } from './dto/update-ordene.dto';

@ApiTags('CRUD Ordenes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ordenes')
export class OrdenesController {

    constructor(private ordenesService: OrdenesService){}

    @ApiOperation({summary: 'Obtener lista de Ordenes'})
    @ApiResponse({status: 200, description: 'Retorna lista de ordenes'})
    @Get()
    funListar(){
        let ordenes = this.ordenesService.findAll()
        return ordenes;
    }

    @ApiOperation({summary: 'Crear una nueva Orden (Procesar pago)'})
    @ApiResponse({status: 200, description: 'Registra nueva orden de compra'})
    @Post()
    funGuardar(@Body() orden: CreateOrdenDto){
        let respuesta = this.ordenesService.create(orden)
        return respuesta
    }

    @ApiOperation({summary: 'Actualizar estado de una orden'})
    @ApiResponse({status: 200, description: 'Actualiza una orden'})
    @Put(':id')
    funActualizar(
        @Param('id') id: number,
        @Body() orden: UpdateOrdenDto,
    ) {
        return this.ordenesService.update(id, orden);
    }

    @ApiOperation({summary: 'Eliminar/Cancelar una orden'})
    @ApiResponse({status: 200, description: 'Elimina una orden'})
    @Delete(':id')
    funEliminar(
        @Param('id') id: number,
    ) {
        return this.ordenesService.delete(id);
    }
}