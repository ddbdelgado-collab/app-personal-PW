import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ItemsCarritoService } from './items_carrito.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateItemCarritoDto } from './dto/create-items_carrito.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateItemsCarritoDto } from './dto/update-items_carrito.dto';

@ApiTags('CRUD Items Carrito')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('carrito')
export class ItemsCarritoController {

    constructor(private itemsCarritoService: ItemsCarritoService){}

    @ApiOperation({summary: 'Obtener items del carrito'})
    @ApiResponse({status: 200, description: 'Retorna lista de items en el carrito'})
    @Get()
    funListar(){
        let items = this.itemsCarritoService.findAll()
        return items;
    }

    @ApiOperation({summary: 'Agregar item al carrito'})
    @ApiResponse({status: 200, description: 'Registra nuevo item en el carrito'})
    @Post()
    funGuardar(@Body() item: CreateItemCarritoDto){
        let respuesta = this.itemsCarritoService.create(item)
        return respuesta
    }

    @ApiOperation({summary: 'Actualizar cantidad de un item'})
    @ApiResponse({status: 200, description: 'Actualiza un item del carrito'})
    @Put(':id')
    funActualizar(
        @Param('id') id: number,
        @Body() item: UpdateItemsCarritoDto,
    ) {
        return this.itemsCarritoService.update(id, item);
    }

    @ApiOperation({summary: 'Eliminar un item del carrito'})
    @ApiResponse({status: 200, description: 'Elimina un item del carrito'})
    @Delete(':id')
    funEliminar(
        @Param('id') id: number,
    ) {
        return this.itemsCarritoService.delete(id);
    }
}