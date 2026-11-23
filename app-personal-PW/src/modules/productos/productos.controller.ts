import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductoDto } from './dto/create-producto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProductoDto } from './dto/update-producto.dto';
import type { Request } from 'express';

@ApiTags('CRUD Productos')
@ApiBearerAuth()
//@UseGuards(JwtAuthGuard)
@Controller('productos')
export class ProductosController {

    constructor(private productosService: ProductosService){}

    @Post()
    create(@Body() createProductoDto: CreateProductoDto) {
        return this.productosService.create(createProductoDto);
    }
    @ApiOperation({summary: 'Obtener lista de Productos'})
    @ApiResponse({status: 200, description: 'Retorna lista de productos'})
    @Get()
    funListar(){
        let productos = this.productosService.findAll()
        return productos;
    }

    @Get('back')
    async backend(@Req() req: Request){
        const builder = await this.productosService.queryBuilder('productos');
        
        // Filtro por búsqueda de nombre
        if (req.query.q){
        builder.where("productos.nombre LIKE :q", {q: `%${req.query.q}%`})
        }

        // Ordenación por precio (asc o desc)
        const sort: any = req.query.sort;
        if(sort){
        builder.orderBy('productos.precio', sort.toUpperCase());
        }

        // Paginación
        const page: number = parseInt(req.query.page as any) || 1; // si no existe nada captura la pagina 1
        const limit = 2; // limite de productos por pagina (en clase se puso 10 y luego 2 para probar)

        builder.offset((page - 1) * limit).limit(limit);

        const total = await builder.getCount();

        return {
        data: await builder.getMany(),
        total: total,
        page,
        last_page: Math.ceil(total / limit)
        }
    }

    @ApiOperation({summary: 'Crear un nuevo Producto'})
    @ApiResponse({status: 200, description: 'Registra nuevo producto'})
    @Post()
    funGuardar(@Body() producto: CreateProductoDto){
        let respuesta = this.productosService.create(producto)
        return respuesta
    }

    @ApiOperation({summary: 'Actualizar un producto'})
    @ApiResponse({status: 200, description: 'Actualiza un producto'})
    @Put(':id')
    funActualizar(
        @Param('id') id: number,
        @Body() producto: UpdateProductoDto,
    ) {
        return this.productosService.update(id, producto);
    }

    @ApiOperation({summary: 'Eliminar un producto'})
    @ApiResponse({status: 200, description: 'Elimina un producto'})
    @Delete(':id')
    funEliminar(
        @Param('id') id: number,
    ) {
        return this.productosService.remove(id);
    }
}